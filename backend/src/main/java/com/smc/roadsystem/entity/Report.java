package com.smc.roadsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private String damageType;   // POTHOLE, CRACK, WATERLOGGING, OTHER

    @Column(nullable = false)
    private String severity;     // LOW, MEDIUM, HIGH

    @Column(length = 1000)
    private String description;

    private String imageUrl;

    @Column(nullable = false)
    private String status;       // PENDING, IN_PROGRESS, RESOLVED

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "PENDING";
    }
}
