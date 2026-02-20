package com.smc.roadsystem.controller;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/citizen/reports")
public class ImageValidationController {

    @Value("${gemini.api-key:}")
    private String geminiApiKey;

    @PostMapping("/validate-image")
    public ResponseEntity<Map<String, Object>> validateImage(@RequestBody ImageValidationRequest request) {
        Map<String, Object> result = new HashMap<>();

        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            result.put("valid", true);
            result.put("message", "");
            return ResponseEntity.ok(result);
        }

        try {
            SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
            factory.setConnectTimeout(5000);
            factory.setReadTimeout(8000);
            RestTemplate restTemplate = new RestTemplate(factory);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> imageData = new HashMap<>();
            imageData.put("mime_type", request.getMimeType());
            imageData.put("data", request.getBase64());

            Map<String, Object> inlinePart = new HashMap<>();
            inlinePart.put("inline_data", imageData);

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text",
                "You are validating images for a road damage reporting system. " +
                "Does this image show road damage such as a pothole, road crack, waterlogging, broken pavement, or similar infrastructure damage? " +
                "Reply with ONLY a JSON object like: {\"valid\": true, \"message\": \"Image shows a pothole on a paved road.\"} " +
                "or {\"valid\": false, \"message\": \"This image does not appear to show road damage.\"} " +
                "No other text, just the JSON."
            );

            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(inlinePart, textPart));

            Map<String, Object> body = new HashMap<>();
            body.put("contents", List.of(content));

            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getBody() != null) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    Map<String, Object> contentObj = (Map<String, Object>) candidate.get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) contentObj.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        String text = ((String) parts.get(0).get("text")).trim();
                        text = text.replaceAll("```json", "").replaceAll("```", "").trim();
                        if (text.startsWith("{")) {
                            boolean valid = text.contains("\"valid\": true") || text.contains("\"valid\":true");
                            String msg = extractJsonString(text, "message");
                            result.put("valid", valid);
                            result.put("message", msg);
                            return ResponseEntity.ok(result);
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Image validation error: " + e.getMessage());
        }

        result.put("valid", true);
        result.put("message", "");
        return ResponseEntity.ok(result);
    }

    private String extractJsonString(String json, String key) {
        try {
            String search = "\"" + key + "\": \"";
            int start = json.indexOf(search);
            if (start == -1) { search = "\"" + key + "\":\""; start = json.indexOf(search); }
            if (start == -1) return "";
            start += search.length();
            int end = json.indexOf("\"", start);
            return end == -1 ? "" : json.substring(start, end);
        } catch (Exception e) {
            return "";
        }
    }

    @Data
    public static class ImageValidationRequest {
        private String base64;
        private String mimeType;
    }
}
