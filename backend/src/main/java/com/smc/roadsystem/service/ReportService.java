package com.smc.roadsystem.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.smc.roadsystem.dto.ReportRequest;
import com.smc.roadsystem.dto.ReportResponse;
import com.smc.roadsystem.entity.Report;
import com.smc.roadsystem.entity.User;
import com.smc.roadsystem.repository.ReportRepository;
import com.smc.roadsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final Cloudinary cloudinary;

    public ReportResponse createReport(String email, ReportRequest req, MultipartFile image) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(image.getBytes(),
                    ObjectUtils.asMap("folder", "roadwatch"));
            imageUrl = (String) uploadResult.get("secure_url");
        }

        Report report = Report.builder()
                .user(user)
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .damageType(req.getDamageType())
                .severity(req.getSeverity())
                .description(req.getDescription())
                .imageUrl(imageUrl)
                .build();

        report = reportRepository.save(report);
        return toResponse(report);
    }

    public List<ReportResponse> getMyReports(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return reportRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private ReportResponse toResponse(Report r) {
        return ReportResponse.builder()
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
