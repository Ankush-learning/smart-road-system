package com.smc.roadsystem.dto;

import lombok.Data;

@Data
public class ReportRequest {
    private Double latitude;
    private Double longitude;
    private String damageType;
    private String severity;
    private String description;
}
