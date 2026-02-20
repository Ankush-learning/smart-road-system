package com.smc.roadsystem.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/citizen/reports")
@RequiredArgsConstructor
public class ImageValidationController {

    @Value("${anthropic.api-key:}")
    private String anthropicApiKey;

    @PostMapping("/validate-image")
    public ResponseEntity<Map<String, Object>> validateImage(@RequestBody ImageValidationRequest request) {
        Map<String, Object> result = new HashMap<>();

        if (anthropicApiKey == null || anthropicApiKey.isBlank()) {
            result.put("valid", true);
            result.put("message", "");
            return ResponseEntity.ok(result);
        }

        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", anthropicApiKey);
            headers.set("anthropic-version", "2023-06-01");

            Map<String, Object> imageSource = new HashMap<>();
            imageSource.put("type", "base64");
            imageSource.put("media_type", request.getMimeType());
            imageSource.put("data", request.getBase64());

            Map<String, Object> imageContent = new HashMap<>();
            imageContent.put("type", "image");
            imageContent.put("source", imageSource);

            Map<String, Object> textContent = new HashMap<>();
            textContent.put("type", "text");
            textContent.put("text",
                "You are validating images for a road damage reporting system. " +
                "Does this image show road damage such as a pothole, road crack, waterlogging, broken pavement, or similar infrastructure damage? " +
                "Reply with ONLY a JSON object like: {\"valid\": true, \"message\": \"Image shows a pothole on a paved road.\"} " +
                "or {\"valid\": false, \"message\": \"This image does not appear to show road damage.\"} " +
                "No other text, just the JSON."
            );

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", List.of(imageContent, textContent));

            Map<String, Object> body = new HashMap<>();
            body.put("model", "claude-haiku-4-5-20251001");
            body.put("max_tokens", 150);
            body.put("messages", List.of(message));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.anthropic.com/v1/messages", entity, Map.class
            );

            if (response.getBody() != null) {
                List<Map<String, Object>> content = (List<Map<String, Object>>) response.getBody().get("content");
                if (content != null && !content.isEmpty()) {
                    String text = (String) content.get(0).get("text");
                    // Parse JSON from response
                    text = text.trim();
                    if (text.startsWith("{")) {
                        // simple parse
                        boolean valid = text.contains("\"valid\": true") || text.contains("\"valid\":true");
                        String msg = extractJsonString(text, "message");
                        result.put("valid", valid);
                        result.put("message", msg);
                        return ResponseEntity.ok(result);
                    }
                }
            }
        } catch (Exception e) {
            // fail open — don't block upload if validation fails
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
