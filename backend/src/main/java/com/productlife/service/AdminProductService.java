package com.productlife.service;

import com.productlife.dto.*;

/**
 * Service interface for administrative operations on product passports.
 */
public interface AdminProductService {

    /**
     * Compute system-wide metrics and statistics for the admin dashboard.
     */
    AdminStatsDTO getDashboardStats();

    /**
     * Retrieve paginated products with optional search, category, and status filters.
     */
    PagedResponseDTO<ProductSummaryDTO> getProductsPaged(
            String keyword, String category, String status, int page, int size, String sortBy, String sortDir);

    /**
     * Retrieve single product passport details by ID.
     */
    ProductDetailDTO getProductById(Long id);

    /**
     * Create a new product passport, validating unique code and field constraints.
     */
    ProductDetailDTO createProduct(ProductCreateDTO createDTO);

    /**
     * Update an existing product passport.
     */
    ProductDetailDTO updateProduct(Long id, ProductUpdateDTO updateDTO);

    /**
     * Remove a product passport and its associated lifecycle records.
     */
    void deleteProduct(Long id);
}
