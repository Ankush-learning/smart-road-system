package com.smc.roadsystem.service;

import com.smc.roadsystem.dto.AdminStatsResponse;
import com.smc.roadsystem.dto.ReportResponse;
import com.smc.roadsystem.entity.Report;
import com.smc.roadsystem.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ReportRepository reportRepository;

    public AdminStatsResponse getStats() {
        List<Report> all = reportRepository.findAll();

        Map<String, Long> byStatus = all.stream()
                .collect(Collectors.groupingBy(Report::getStatus, Collectors.counting()));

        Map<String, Long> byDamageType = all.stream()
                .collect(Collectors.groupingBy(Report::getDamageType, Collectors.counting()));

        Map<String, Long> bySeverity = all.stream()
                .collect(Collectors.groupingBy(Report::getSeverity, Collectors.counting()));

        return AdminStatsResponse.builder()
                .totalReports(all.size())
                .pendingReports(byStatus.getOrDefault("PENDING", 0L))
                .inProgressReports(byStatus.getOrDefault("IN_PROGRESS", 0L))
                .resolvedReports(byStatus.getOrDefault("RESOLVED", 0L))
                .byDamageType(byDamageType)
                .bySeverity(bySeverity)
                .build();
    }

    public List<ReportResponse> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ReportResponse updateStatus(Long reportId, String status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found: " + reportId));
        report.setStatus(status);
        return toResponse(reportRepository.save(report));
    }

    private ReportResponse toResponse(Report r) {
        return com.smc.roadsystem.dto.ReportResponse.builder()
                .id(r.getId())
                .fullName(r.getUser().getFullName())
                .latitude(r.getLatitude())
                .longitude(r.getLongitude())
                .damageType(r.getDamageType())
                .severity(r.getSeverity())
                .description(r.getDescription())
                .imageUrl(r.getImageUrl())
                .status(r.getStatus())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
