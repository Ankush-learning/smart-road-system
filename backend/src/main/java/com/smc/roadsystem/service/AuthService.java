package com.smc.roadsystem.service;

import com.smc.roadsystem.dto.AuthResponse;
import com.smc.roadsystem.dto.LoginRequest;
import com.smc.roadsystem.dto.RegisterRequest;
import com.smc.roadsystem.entity.Role;
import com.smc.roadsystem.entity.User;
import com.smc.roadsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // ─── Register ──────────────────────────────────────────────────────────────

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use.");
        }

        Role role = Role.CITIZEN;
        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            role = Role.ADMIN;
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .userId(user.getId())
                .build();
    }

    // ─── Login ─────────────────────────────────────────────────────────────────

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .userId(user.getId())
                .build();
    }
}
