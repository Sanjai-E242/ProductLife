package com.productlife.service;

import com.productlife.dto.ProductDetailDTO;
import com.productlife.dto.ProductSummaryDTO;
import com.productlife.entity.Product;
import com.productlife.exception.ResourceNotFoundException;
import com.productlife.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of ProductService for handling product passport queries.
 */
@Service
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);

    private final ProductRepository productRepository;
    private final QrCodeService qrCodeService;

    public ProductServiceImpl(ProductRepository productRepository, QrCodeService qrCodeService) {
        this.productRepository = productRepository;
        this.qrCodeService = qrCodeService;
    }

    @Override
    public List<ProductSummaryDTO> getProducts(String keyword, String category) {
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String cleanCategory = (category != null && !category.trim().equalsIgnoreCase("All") && !category.trim().isEmpty())
                ? category.trim() : null;

        log.info("Fetching products with filter - keyword: '{}', category: '{}'", cleanKeyword, cleanCategory);

        List<Product> products = productRepository.findFilteredProducts(cleanKeyword, cleanCategory);
        return products.stream()
                .map(ProductSummaryDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDetailDTO getProductById(Long id) {
        log.info("Fetching product passport details for ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        String passportUrl = qrCodeService.buildPassportUrl(product.getId());
        return new ProductDetailDTO(product, passportUrl);
    }

    @Override
    public ProductDetailDTO getProductByCode(String productCode) {
        log.info("Fetching product passport details for code: {}", productCode);
        Product product = productRepository.findByProductCode(productCode)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productCode", productCode));
        String passportUrl = qrCodeService.buildPassportUrl(product.getId());
        return new ProductDetailDTO(product, passportUrl);
    }

    @Override
    public List<String> getCategories() {
        log.info("Fetching distinct product categories");
        return productRepository.findDistinctCategories();
    }

    @Override
    public com.productlife.dto.PassportComplianceExportDTO getComplianceExport(Long id) {
        log.info("Generating DPP compliance export payload for product ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        String passportUrl = qrCodeService.buildPassportUrl(product.getId());

        com.productlife.dto.PassportComplianceExportDTO.PassportHeader header =
                new com.productlife.dto.PassportComplianceExportDTO.PassportHeader(passportUrl);

        com.productlife.dto.PassportComplianceExportDTO.ProductDetails details =
                new com.productlife.dto.PassportComplianceExportDTO.ProductDetails();
        details.setId(product.getId());
        details.setProductCode(product.getProductCode());
        details.setName(product.getName());
        details.setBrand(product.getBrand());
        details.setCategory(product.getCategory());
        details.setModel(product.getModel());
        details.setManufacturer(product.getManufacturer());
        details.setCountryOfOrigin(product.getCountryOfOrigin());
        details.setMfgDate(product.getMfgDate());
        details.setStatus(product.getStatus() != null ? product.getStatus() : "ACTIVE");

        com.productlife.dto.PassportComplianceExportDTO.CircularityDisclosures circularity =
                new com.productlife.dto.PassportComplianceExportDTO.CircularityDisclosures();
        circularity.setDescription(product.getDescription());
        circularity.setMaterials(product.getMaterials());
        circularity.setCareInstructions(product.getCareInstructions());
        circularity.setRecyclingInstructions(product.getRecyclingInstructions());

        com.productlife.dto.PassportComplianceExportDTO.MaintenanceLog lifecycle =
                new com.productlife.dto.PassportComplianceExportDTO.MaintenanceLog();
        List<com.productlife.dto.RepairHistoryDTO> repairs = product.getRepairHistoryList() != null
                ? product.getRepairHistoryList().stream().map(com.productlife.dto.RepairHistoryDTO::new).collect(Collectors.toList())
                : java.util.Collections.emptyList();
        lifecycle.setServiceRecords(repairs);
        lifecycle.setTotalServiceInterventions(repairs.size());

        long months = 0;
        if (product.getMfgDate() != null) {
            months = java.time.temporal.ChronoUnit.MONTHS.between(product.getMfgDate(), java.time.LocalDate.now());
        }
        lifecycle.setActiveServiceMonths(Math.max(0, months));
        lifecycle.setCircularityHealthRating(repairs.isEmpty() ? "OPTIMAL_FACTORY" : "MAINTAINED_CIRCULAR");

        return new com.productlife.dto.PassportComplianceExportDTO(header, details, circularity, lifecycle);
    }
}
