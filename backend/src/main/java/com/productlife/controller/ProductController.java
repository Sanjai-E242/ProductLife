package com.productlife.controller;

import com.productlife.dto.ProductDetailDTO;
import com.productlife.dto.ProductSummaryDTO;
import com.productlife.service.ProductService;
import com.productlife.service.QrCodeService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Product REST Controller
 * 
 * Exposes endpoints for browsing public product passports, retrieving
 * detailed specifications, and generating standardized QR code graphics.
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final QrCodeService qrCodeService;

    public ProductController(ProductService productService, QrCodeService qrCodeService) {
        this.productService = productService;
        this.qrCodeService = qrCodeService;
    }

    /**
     * HTTP GET /api/products
     * Retrieves all products, supporting optional search keyword and category filtering.
     */
    @GetMapping
    public ResponseEntity<List<ProductSummaryDTO>> getAllProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category) {
        List<ProductSummaryDTO> products = productService.getProducts(keyword, category);
        return ResponseEntity.ok(products);
    }

    /**
     * HTTP GET /api/products/categories
     * Returns a distinct list of all product categories currently available.
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = productService.getCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * HTTP GET /api/products/{id}
     * Retrieves complete digital product passport by numeric database ID.
     * Returns 404 Not Found if product does not exist.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> getProductById(@PathVariable Long id) {
        ProductDetailDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    /**
     * HTTP GET /api/products/code/{productCode}
     * Retrieves complete digital product passport by public passport code (e.g., "PL-ECO-001").
     * Returns 404 Not Found if code is invalid.
     */
    @GetMapping("/code/{productCode}")
    public ResponseEntity<ProductDetailDTO> getProductByCode(@PathVariable String productCode) {
        ProductDetailDTO product = productService.getProductByCode(productCode);
        return ResponseEntity.ok(product);
    }

    /**
     * Helper to resolve the effective host from request headers if LAN mode was requested
     * without providing an explicit host address.
     */
    private String resolveEffectiveHost(String host, Boolean lan, HttpServletRequest request) {
        if (host != null && !host.trim().isEmpty()) {
            return host.trim();
        }
        if (Boolean.TRUE.equals(lan) && request != null) {
            String reqHost = request.getHeader("X-Forwarded-Host");
            if (reqHost == null || reqHost.trim().isEmpty()) {
                reqHost = request.getHeader("Host");
            }
            if (reqHost != null && !reqHost.trim().isEmpty()) {
                String cleanHost = reqHost.split(":")[0].trim();
                if (!QrCodeService.containsLocalhost(cleanHost)) {
                    return cleanHost;
                }
            }
        }
        return null;
    }

    /**
     * HTTP GET /api/products/{id}/qrcode
     * Generates and returns a PNG QR code graphic encoding the product's stable passport URL.
     * Supports configurable public base URL or laptop LAN IP.
     *
     * @param id Product ID
     * @param size Pixel dimensions of the square QR graphic (default 300px)
     * @param baseUrl Optional explicit public base URL (e.g. http://192.168.1.15:5174)
     * @param host Optional explicit host or IP address (e.g. 192.168.1.15)
     * @param port Optional frontend port (default 5174)
     * @param lan Optional legacy boolean flag to enable LAN mode
     */
    @GetMapping(value = "/{id}/qrcode", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getProductQrCode(
            @PathVariable Long id,
            @RequestParam(defaultValue = "300") int size,
            @RequestParam(required = false) String baseUrl,
            @RequestParam(required = false) String host,
            @RequestParam(required = false) Integer port,
            @RequestParam(required = false) Boolean lan,
            HttpServletRequest request) {
        int validatedSize = Math.max(100, Math.min(size, 1000));

        // Verifies existence and throws 404 if product doesn't exist
        ProductDetailDTO product = productService.getProductById(id);
        String effectiveHost = resolveEffectiveHost(host, lan, request);
        String passportUrl = qrCodeService.buildPassportUrl(id, baseUrl, effectiveHost, port);

        byte[] qrImageBytes = qrCodeService.generateQrCodePng(passportUrl, validatedSize, validatedSize);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"passport-" + product.getProductCode() + "-qr.png\"")
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .contentType(MediaType.IMAGE_PNG)
                .body(qrImageBytes);
    }

    /**
     * HTTP GET /api/products/code/{productCode}/qrcode
     * Generates and returns a PNG QR code graphic by public passport code.
     */
    @GetMapping(value = "/code/{productCode}/qrcode", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getProductQrCodeByCode(
            @PathVariable String productCode,
            @RequestParam(defaultValue = "300") int size,
            @RequestParam(required = false) String baseUrl,
            @RequestParam(required = false) String host,
            @RequestParam(required = false) Integer port,
            @RequestParam(required = false) Boolean lan,
            HttpServletRequest request) {
        int validatedSize = Math.max(100, Math.min(size, 1000));

        ProductDetailDTO product = productService.getProductByCode(productCode);
        String effectiveHost = resolveEffectiveHost(host, lan, request);
        String passportUrl = qrCodeService.buildPassportUrlForCode(product.getProductCode(), baseUrl, effectiveHost, port);

        byte[] qrImageBytes = qrCodeService.generateQrCodePng(passportUrl, validatedSize, validatedSize);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"passport-" + product.getProductCode() + "-qr.png\"")
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .contentType(MediaType.IMAGE_PNG)
                .body(qrImageBytes);
    }

    /**
     * HTTP GET /api/products/{id}/qrcode/data-url
     * Returns Base64 Data URL string for direct inline embedding in HTML.
     */
    @GetMapping("/{id}/qrcode/data-url")
    public ResponseEntity<Map<String, String>> getProductQrCodeDataUrl(
            @PathVariable Long id,
            @RequestParam(defaultValue = "300") int size,
            @RequestParam(required = false) String baseUrl,
            @RequestParam(required = false) String host,
            @RequestParam(required = false) Integer port,
            @RequestParam(required = false) Boolean lan,
            HttpServletRequest request) {
        int validatedSize = Math.max(100, Math.min(size, 1000));
        ProductDetailDTO product = productService.getProductById(id);
        String effectiveHost = resolveEffectiveHost(host, lan, request);
        String passportUrl = qrCodeService.buildPassportUrl(id, baseUrl, effectiveHost, port);

        String dataUrl = qrCodeService.generateQrCodeDataUrl(passportUrl, validatedSize, validatedSize);
        return ResponseEntity.ok(Collections.singletonMap("qrCodeDataUrl", dataUrl));
    }

    /**
     * HTTP GET /api/products/{id}/export/json
     * Generates and returns standardized EU Digital Product Passport compliance export payload.
     */
    @GetMapping("/{id}/export/json")
    public ResponseEntity<com.productlife.dto.PassportComplianceExportDTO> getPassportComplianceExport(
            @PathVariable Long id) {
        com.productlife.dto.PassportComplianceExportDTO exportData = productService.getComplianceExport(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"dpp-compliance-" + id + ".json\"")
                .body(exportData);
    }
}
