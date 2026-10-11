package com.productlife.service;

import com.productlife.dto.AdminAuthDTO;
import com.productlife.exception.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service managing administrator authentication, token issuance, and session validation.
 * Protects administrative APIs without requiring bulky external authentication servers.
 */
@Service
public class AdminAuthService {

    private static final Logger log = LoggerFactory.getLogger(AdminAuthService.class);

    // 24-hour session token duration in seconds
    private static final long TOKEN_VALIDITY_SECONDS = 86400;

    @Value("${productlife.admin.username:${ADMIN_USERNAME:admin}}")
    private String adminUsername;

    @Value("${productlife.admin.password:${ADMIN_PASSWORD:}}")
    private String adminPassword;

    // In-memory token storage: token -> expiration Instant
    private final Map<String, Instant> activeTokens = new ConcurrentHashMap<>();

    public AdminAuthService() {
    }

    public AdminAuthService(String adminUsername, String adminPassword) {
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    @jakarta.annotation.PostConstruct
    public void init() {
        if (adminPassword == null || adminPassword.trim().isEmpty()) {
            log.warn("ADMIN_PASSWORD is not configured. Administrative login endpoints will safely refuse all authentication requests.");
        } else {
            log.info("AdminAuthService initialized with administrative user '{}'.", adminUsername);
        }
    }

    /**
     * Authenticates administrator credentials and issues a secure session token.
     * Fails safely if server-side administrative credentials are not configured.
     * Uses constant-time equality check and never logs passwords.
     */
    public AdminAuthDTO.AuthResponse login(String username, String password) {
        // Fail-safe check: Refuse login if server credentials are unconfigured or blank
        if (adminPassword == null || adminPassword.trim().isEmpty() ||
            adminUsername == null || adminUsername.trim().isEmpty()) {
            log.error("Administrator authentication refused: ADMIN_PASSWORD environment variable is not configured.");
            throw new UnauthorizedException("Administrative access is disabled on this server. Contact the administrator.");
        }

        if (username == null || password == null) {
            throw new UnauthorizedException("Username and password must not be null");
        }

        byte[] expectedUser = adminUsername.trim().getBytes(java.nio.charset.StandardCharsets.UTF_8);
        byte[] actualUser = username.trim().getBytes(java.nio.charset.StandardCharsets.UTF_8);
        byte[] expectedPass = adminPassword.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        byte[] actualPass = password.getBytes(java.nio.charset.StandardCharsets.UTF_8);

        boolean userMatch = java.security.MessageDigest.isEqual(expectedUser, actualUser);
        boolean passMatch = java.security.MessageDigest.isEqual(expectedPass, actualPass);

        if (!userMatch || !passMatch) {
            log.warn("Failed admin login attempt for username: '{}'", username);
            throw new UnauthorizedException("Invalid administrator credentials");
        }

        String token = "pl_adm_" + UUID.randomUUID().toString().replace("-", "");
        Instant expiresAt = Instant.now().plusSeconds(TOKEN_VALIDITY_SECONDS);
        activeTokens.put(token, expiresAt);

        log.info("Administrator '{}' successfully authenticated. Active session token generated.", username);
        return new AdminAuthDTO.AuthResponse(token, adminUsername, "ROLE_ADMIN", "Authentication successful");
    }

    /**
     * Validates whether a token is active and not expired.
     */
    public boolean validateToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            return false;
        }

        String cleanToken = token.trim();
        if (cleanToken.startsWith("Bearer ")) {
            cleanToken = cleanToken.substring(7).trim();
        }

        Instant expiresAt = activeTokens.get(cleanToken);
        if (expiresAt == null) {
            return false;
        }

        if (Instant.now().isAfter(expiresAt)) {
            activeTokens.remove(cleanToken);
            log.debug("Expired administrator session token invalidated and removed.");
            return false;
        }

        return true;
    }

    /**
     * Terminates an active administrator session.
     */
    public void logout(String token) {
        if (token != null) {
            String cleanToken = token.trim();
            if (cleanToken.startsWith("Bearer ")) {
                cleanToken = cleanToken.substring(7).trim();
            }
            activeTokens.remove(cleanToken);
            log.info("Administrator session invalidated.");
        }
    }

    public String getAdminUsername() {
        return adminUsername;
    }

    public void setAdminUsername(String adminUsername) {
        this.adminUsername = adminUsername;
    }
}
