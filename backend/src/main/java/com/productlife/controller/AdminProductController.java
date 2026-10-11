package com.productlife.controller;

import com.productlife.dto.*;
import com.productlife.service.AdminProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

/**
 * Controller exposing protected administrative APIs for Digital Product Passport lifecycle management.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminProductController {

    private final AdminProductService adminProductService;

    public AdminProductController(AdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    /**
     * HTTP GET /api/admin/dashboard/stats
     * Retrieves aggregated system metrics and passport distribution for the admin overview dashboard.
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<AdminStatsDTO> getDashboardStats() {
        AdminStatsDTO stats = adminProductService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * HTTP GET /api/admin/products
     * Retrieves paginated products with optional keyword, category, and status filtering.
     */
    @GetMapping("/products")
    public ResponseEntity<PagedResponseDTO<ProductSummaryDTO>> getProductsPaged(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "updatedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponseDTO<ProductSummaryDTO> response = adminProductService.getProductsPaged(
                keyword, category, status, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    /**
     * HTTP GET /api/admin/products/{id}
     * Retrieves complete product passport details for editing.
     */
    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDetailDTO> getProductById(@PathVariable Long id) {
        ProductDetailDTO product = adminProductService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    /**
     * HTTP POST /api/admin/products
     * Registers a new Digital Product Passport. Validates required fields and code uniqueness.
     */
    @PostMapping("/products")
    public ResponseEntity<ProductDetailDTO> createProduct(@Valid @RequestBody ProductCreateDTO createDTO) {
        ProductDetailDTO created = adminProductService.createProduct(createDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * HTTP PUT /api/admin/products/{id}
     * Updates an existing Digital Product Passport.
     */
    @PutMapping("/products/{id}")
    public ResponseEntity<ProductDetailDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateDTO updateDTO) {
        ProductDetailDTO updated = adminProductService.updateProduct(id, updateDTO);
        return ResponseEntity.ok(updated);
    }

    /**
     * HTTP DELETE /api/admin/products/{id}
     * Deletes a product passport and its associated maintenance records.
     */
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        adminProductService.deleteProduct(id);
        return ResponseEntity.ok(Collections.singletonMap("message", "Product passport deleted successfully"));
    }
}
