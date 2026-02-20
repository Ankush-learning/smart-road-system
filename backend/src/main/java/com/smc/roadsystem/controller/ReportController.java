package com.smc.roadsystem.controller;

import com.smc.roadsystem.dto.ReportRequest;
import com.smc.roadsystem.dto.ReportResponse;
import com.smc.roadsystem.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/citizen/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReportResponse> createReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart("data") ReportRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {
        return ResponseEntity.ok(
                reportService.createReport(userDetails.getUsername(), request, image)
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReportResponse>> getMyReports(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(
                reportService.getMyReports(userDetails.getUsername())
        );
    }
}
