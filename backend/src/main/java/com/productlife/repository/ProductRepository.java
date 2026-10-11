package com.productlife.repository;

import com.productlife.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Product Repository
 * 
 * Provides automated CRUD and query execution against the 'products' table.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Find a product by its unique public passport code (e.g., "PL-ECO-001").
     */
    Optional<Product> findByProductCode(String productCode);

    /**
     * Check if a product code already exists (used during validation before creation).
     */
    boolean existsByProductCode(String productCode);

    /**
     * Check if a product code already exists for any record other than the specified product ID.
     */
    boolean existsByProductCodeAndIdNot(String productCode, Long id);

    /**
     * Find distinct product categories in alphabetical order.
     */
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL ORDER BY p.category ASC")
    List<String> findDistinctCategories();

    /**
     * Search products by keyword across name, brand, or category.
     */
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.productCode) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchProducts(@Param("keyword") String keyword);

    /**
     * Filter products by category.
     */
    List<Product> findByCategoryIgnoreCase(String category);

    /**
     * Combined search and category filtering for public explorer.
     */
    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR :category = '' OR LOWER(p.category) = LOWER(:category)) AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           " LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.productCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.materials) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Product> findFilteredProducts(@Param("keyword") String keyword, @Param("category") String category);

    /**
     * Paginated combined filtering for Admin Panel with keyword, category, and status.
     */
    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR :category = '' OR LOWER(p.category) = LOWER(:category)) AND " +
           "(:status IS NULL OR :status = '' OR LOWER(p.status) = LOWER(:status)) AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           " LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.productCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.materials) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> findFilteredProductsPaged(
            @Param("keyword") String keyword,
            @Param("category") String category,
            @Param("status") String status,
            Pageable pageable);

    /**
     * Count active products (treating NULL as ACTIVE for backward compatibility).
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.status IS NULL OR LOWER(p.status) = 'active'")
    long countActiveProducts();

    /**
     * Count products by lifecycle status (ACTIVE, DRAFT, DISCONTINUED, RECALLED).
     */
    long countByStatusIgnoreCase(String status);

    /**
     * Count products by category.
     */
    long countByCategoryIgnoreCase(String category);

    /**
     * Retrieve the 5 most recently updated product passports for admin dashboard overview.
     */
    List<Product> findTop5ByOrderByUpdatedAtDesc();
}
