package com.productlife.config;

import com.productlife.exception.UnauthorizedException;
import com.productlife.service.AdminAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Interceptor that guards all `/api/admin/**` endpoints, requiring a valid
 * administrator session token in either the `Authorization` or `X-Admin-Token` header.
 */
@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    private final AdminAuthService adminAuthService;

    public AdminAuthInterceptor(AdminAuthService adminAuthService) {
        this.adminAuthService = adminAuthService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Allow CORS pre-flight OPTIONS requests through uninhibited
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;

        if (authHeader != null && authHeader.trim().startsWith("Bearer ")) {
            token = authHeader.substring(7).trim();
        } else {
            // Also accept custom X-Admin-Token header as fallback
            token = request.getHeader("X-Admin-Token");
        }

        if (token == null || !adminAuthService.validateToken(token)) {
            throw new UnauthorizedException("Administrative access required. Please log in with valid admin credentials.");
        }

        return true;
    }
}
