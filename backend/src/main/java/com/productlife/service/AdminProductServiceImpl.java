package com.productlife.service;

import com.productlife.dto.*;
import com.productlife.entity.Product;
import com.productlife.exception.DuplicateResourceException;
import com.productlife.exception.ResourceNotFoundException;
import com.productlife.repository.ProductRepository;
import com.productlife.repository.RepairHistoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementation of AdminProductService for administrator product management.
 */
@Service
@Transactional
public class AdminProductServiceImpl implements AdminProductService {

    private static final Logger log = LoggerFactory.getLogger(AdminProductServiceImpl.class);

    private final ProductRepository productRepository;
    private final RepairHistoryRepository repairHistoryRepository;
    private final QrCodeService qrCodeService;

    public AdminProductServiceImpl(
            ProductRepository productRepository,
            RepairHistoryRepository repairHistoryRepository,
            QrCodeService qrCodeService) {
        this.productRepository = productRepository;
        this.repairHistoryRepository = repairHistoryRepository;
        this.qrCodeService = qrCodeService;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminStatsDTO getDashboardStats() {
        log.info("Computing administrator dashboard statistics");
        AdminStatsDTO stats = new AdminStatsDTO();

        stats.setTotalProducts(productRepository.count());
        stats.setActiveProducts(productRepository.countActiveProducts());
        stats.setDraftProducts(productRepository.countByStatusIgnoreCase("DRAFT"));
        stats.setDiscontinuedProducts(
                productRepository.countByStatusIgnoreCase("DISCONTINUED") +
                productRepository.countByStatusIgnoreCase("RECALLED")
        );

        List<String> categories = productRepository.findDistinctCategories();
        stats.setTotalCategories(categories.size());
        stats.setTotalRepairs(repairHistoryRepository.count());

        Map<String, Long> categoryBreakdown = new HashMap<>();
        for (String cat : categories) {
            categoryBreakdown.put(cat, productRepository.countByCategoryIgnoreCase(cat));
        }
        stats.setCategoryBreakdown(categoryBreakdown);

        Map<String, Long> statusBreakdown = new HashMap<>();
        statusBreakdown.put("ACTIVE", stats.getActiveProducts());
        statusBreakdown.put("DRAFT", stats.getDraftProducts());
        statusBreakdown.put("DISCONTINUED", productRepository.countByStatusIgnoreCase("DISCONTINUED"));
        statusBreakdown.put("RECALLED", productRepository.countByStatusIgnoreCase("RECALLED"));
        stats.setStatusBreakdown(statusBreakdown);

        List<ProductSummaryDTO> recent = productRepository.findTop5ByOrderByUpdatedAtDesc().stream()
                .map(ProductSummaryDTO::new)
                .collect(Collectors.toList());
        stats.setRecentProducts(recent);

        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponseDTO<ProductSummaryDTO> getProductsPaged(
            String keyword, String category, String status, int page, int size, String sortBy, String sortDir) {
        int pageIndex = Math.max(0, page);
        int pageSize = Math.max(1, Math.min(100, size));

        String sortField = (sortBy != null && !sortBy.trim().isEmpty()) ? sortBy.trim() : "updatedAt";
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortField);

        Pageable pageable = PageRequest.of(pageIndex, pageSize, sort);

        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String cleanCategory = (category != null && !category.trim().equalsIgnoreCase("All") && !category.trim().isEmpty())
                ? category.trim() : null;
        String cleanStatus = (status != null && !status.trim().equalsIgnoreCase("All") && !status.trim().isEmpty())
                ? status.trim() : null;

        log.info("Admin querying products paged - page: {}, size: {}, keyword: '{}', category: '{}', status: '{}'",
                pageIndex, pageSize, cleanKeyword, cleanCategory, cleanStatus);

        Page<Product> productPage = productRepository.findFilteredProductsPaged(
                cleanKeyword, cleanCategory, cleanStatus, pageable);

        List<ProductSummaryDTO> content = productPage.getContent().stream()
                .map(ProductSummaryDTO::new)
                .collect(Collectors.toList());

        return new PagedResponseDTO<>(
                content,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages(),
                productPage.isFirst(),
                productPage.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailDTO getProductById(Long id) {
        log.info("Admin fetching product details for ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        String passportUrl = qrCodeService.buildPassportUrl(product.getId());
        return new ProductDetailDTO(product, passportUrl);
    }

    @Override
    public ProductDetailDTO createProduct(ProductCreateDTO createDTO) {
        String cleanCode = createDTO.getProductCode().trim().toUpperCase();
        log.info("Admin creating new product passport with code: {}", cleanCode);

        // Enforce unique product code constraint before persistence
        if (productRepository.existsByProductCode(cleanCode)) {
            log.warn("Attempted to create product with existing code: '{}'", cleanCode);
            throw new DuplicateResourceException("Product", "productCode", cleanCode);
        }

        Product product = new Product(
                cleanCode,
                createDTO.getName().trim(),
                createDTO.getBrand().trim(),
                createDTO.getCategory().trim(),
                (createDTO.getModel() != null) ? createDTO.getModel().trim() : null,
                createDTO.getManufacturer().trim(),
                createDTO.getCountryOfOrigin().trim(),
                createDTO.getDescription(),
                createDTO.getMaterials(),
                createDTO.getMfgDate(),
                createDTO.getCareInstructions(),
                createDTO.getRecyclingInstructions(),
                createDTO.getImageUrl()
        );

        if (createDTO.getStatus() != null && !createDTO.getStatus().trim().isEmpty()) {
            product.setStatus(createDTO.getStatus().trim().toUpperCase());
        }

        Product saved = productRepository.save(product);
        log.info("Product passport created successfully. Assigned ID: {}", saved.getId());

        String passportUrl = qrCodeService.buildPassportUrl(saved.getId());
        return new ProductDetailDTO(saved, passportUrl);
    }

    @Override
    public ProductDetailDTO updateProduct(Long id, ProductUpdateDTO updateDTO) {
        log.info("Admin updating product passport ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        product.setName(updateDTO.getName().trim());
        product.setBrand(updateDTO.getBrand().trim());
        product.setCategory(updateDTO.getCategory().trim());
        product.setModel((updateDTO.getModel() != null) ? updateDTO.getModel().trim() : null);
        product.setManufacturer(updateDTO.getManufacturer().trim());
        product.setCountryOfOrigin(updateDTO.getCountryOfOrigin().trim());
        product.setDescription(updateDTO.getDescription());
        product.setMaterials(updateDTO.getMaterials());
        product.setMfgDate(updateDTO.getMfgDate());
        product.setCareInstructions(updateDTO.getCareInstructions());
        product.setRecyclingInstructions(updateDTO.getRecyclingInstructions());
        product.setImageUrl(updateDTO.getImageUrl());

        if (updateDTO.getStatus() != null && !updateDTO.getStatus().trim().isEmpty()) {
            product.setStatus(updateDTO.getStatus().trim().toUpperCase());
        }

        product.setUpdatedAt(LocalDateTime.now());

        Product saved = productRepository.save(product);
        log.info("Product passport ID {} updated successfully", saved.getId());

        String passportUrl = qrCodeService.buildPassportUrl(saved.getId());
        return new ProductDetailDTO(saved, passportUrl);
    }

    @Override
    public void deleteProduct(Long id) {
        log.info("Admin deleting product passport ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        productRepository.delete(product);
        log.info("Product passport ID {} deleted successfully", id);
    }
}
