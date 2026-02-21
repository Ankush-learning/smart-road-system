package com.smc.roadsystem.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class AdminStatsResponse {
    private long totalReports;
    private long pendingReports;
    private long inProgressReports;
    private long resolvedReports;
    private Map<String, Long> byDamageType;
    private Map<String, Long> bySeverity;
}
