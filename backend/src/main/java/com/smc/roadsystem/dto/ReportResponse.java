package com.smc.roadsystem.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class ReportResponse {
    private Long id;
    private String fullName;
    private Double latitude;
    private Double longitude;
    private String damageType;
    private String severity;
    private String description;
    private String imageUrl;
    private String status;
    private LocalDateTime createdAt;
}
