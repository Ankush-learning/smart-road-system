package com.smc.roadsystem.repository;

import com.smc.roadsystem.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Report> findAllByOrderByCreatedAtDesc();
}
