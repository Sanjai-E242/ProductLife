package com.productlife.controller;

import com.productlife.dto.AdminAuthDTO;
import com.productlife.exception.UnauthorizedException;
import com.productlife.service.AdminAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

/**
 * Controller for administrator authentication lifecycle.
 */
@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    public AdminAuthController(AdminAuthService adminAuthService) {
        this.adminAuthService = adminAuthService;
    }

    /**
     * Authenticates administrator credentials and returns an active session token.
     */
    @PostMapping("/login")
    public ResponseEntity<AdminAuthDTO.AuthResponse> login(@Valid @RequestBody AdminAuthDTO.LoginRequest request) {
        AdminAuthDTO.AuthResponse response = adminAuthService.login(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(response);
    }

    /**
     * Verifies that the provided token is valid.
     */
    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyToken(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-Admin-Token", required = false) String customHeader) {
        String token = (authHeader != null && authHeader.startsWith("Bearer "))
                ? authHeader.substring(7).trim()
                : customHeader;

        if (token == null || !adminAuthService.validateToken(token)) {
            throw new UnauthorizedException("Session token is invalid or expired");
        }

        return ResponseEntity.ok(Map.of(
                "valid", true,
                "username", adminAuthService.getAdminUsername(),
                "role", "ROLE_ADMIN"
        ));
    }

    /**
     * Terminates an active administrator session.
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-Admin-Token", required = false) String customHeader) {
        String token = (authHeader != null && authHeader.startsWith("Bearer "))
                ? authHeader.substring(7).trim()
                : customHeader;

        adminAuthService.logout(token);
        return ResponseEntity.ok(Collections.singletonMap("message", "Logged out successfully"));
    }
}
