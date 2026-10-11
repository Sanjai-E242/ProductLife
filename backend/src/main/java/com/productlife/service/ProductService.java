package com.productlife.service;

import com.productlife.dto.ProductDetailDTO;
import com.productlife.dto.ProductSummaryDTO;

import java.util.List;

/**
 * Service interface defining business logic operations for Product passports.
 */
public interface ProductService {

    /**
     * Retrieve products matching search keyword and/or category filters.
     */
    List<ProductSummaryDTO> getProducts(String keyword, String category);

    /**
     * Retrieve full digital passport details for a product by its numeric database ID.
     */
    ProductDetailDTO getProductById(Long id);

    /**
     * Retrieve full digital passport details for a product by its public passport code.
     */
    ProductDetailDTO getProductByCode(String productCode);

    /**
     * Retrieve the list of all distinct product categories available in the system.
     */
    List<String> getCategories();

    /**
     * Generate official EU Digital Product Passport (DPP) compliance export payload.
     */
    com.productlife.dto.PassportComplianceExportDTO getComplianceExport(Long id);
}
