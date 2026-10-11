package com.productlife.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Health Check REST Controller
 * 
 * Provides an endpoint to verify that the Spring Boot server is active,
 * responsive, and that MySQL database connectivity is operational.
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * HTTP GET /api/health
     * Returns a JSON payload with server status, database connectivity, and metadata.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealthStatus() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("message", "ProductLife Spring Boot Backend is active and running");
        response.put("service", "ProductLife Digital Product Passport Platform");
        response.put("version", "1.0.0");
        response.put("port", 8081);

        // Verify live database connectivity through connection pool
        try (Connection connection = dataSource.getConnection()) {
            boolean isValid = connection.isValid(2);
            response.put("database", isValid ? "CONNECTED" : "UNREACHABLE");
            response.put("databaseProduct", connection.getMetaData().getDatabaseProductName());
        } catch (Exception ex) {
            response.put("database", "DISCONNECTED: " + ex.getMessage());
            response.put("status", "DEGRADED");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }

        response.put("javaVersion", System.getProperty("java.version"));
        response.put("timestamp", Instant.now().toString());

        return ResponseEntity.ok(response);
    }
}
