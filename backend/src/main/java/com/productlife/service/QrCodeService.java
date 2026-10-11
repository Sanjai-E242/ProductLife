package com.productlife.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for generating standardized QR code graphics for Digital Product Passports.
 */
@Service
public class QrCodeService {

    private static final Logger log = LoggerFactory.getLogger(QrCodeService.class);

    // Deep forest green primary color (#064E3B) matching the ProductLife brand design system
    private static final int BRAND_PRIMARY_COLOR = 0xFF064E3B;
    // Clean crisp white background (#FFFFFF)
    private static final int BACKGROUND_COLOR = 0xFFFFFFFF;

    @Value("${productlife.passport.public-base-url:}")
    private String configuredPublicBaseUrl;

    @Value("${productlife.passport.default-base-url:http://localhost:5174/products}")
    private String defaultBaseUrl = "http://localhost:5174/products";

    @Value("${productlife.passport.lan-host:}")
    private String configuredLanHost;

    public QrCodeService() {
    }

    public QrCodeService(String configuredPublicBaseUrl, String defaultBaseUrl, String configuredLanHost) {
        this.configuredPublicBaseUrl = configuredPublicBaseUrl;
        this.defaultBaseUrl = defaultBaseUrl;
        this.configuredLanHost = configuredLanHost;
    }

    public String getConfiguredPublicBaseUrl() {
        return configuredPublicBaseUrl;
    }

    public void setConfiguredPublicBaseUrl(String configuredPublicBaseUrl) {
        this.configuredPublicBaseUrl = configuredPublicBaseUrl;
    }

    public String getDefaultBaseUrl() {
        return defaultBaseUrl;
    }

    public void setDefaultBaseUrl(String defaultBaseUrl) {
        this.defaultBaseUrl = defaultBaseUrl;
    }

    public String getConfiguredLanHost() {
        return configuredLanHost;
    }

    public void setConfiguredLanHost(String configuredLanHost) {
        this.configuredLanHost = configuredLanHost;
    }

    /**
     * Normalizes a base URL to end with "/products" without duplicated paths or trailing slashes.
     */
    public String normalizeBaseUrl(String baseUrl) {
        if (baseUrl == null || baseUrl.trim().isEmpty()) {
            return (defaultBaseUrl != null && !defaultBaseUrl.trim().isEmpty())
                    ? defaultBaseUrl.trim()
                    : "http://localhost:5174/products";
        }
        String clean = baseUrl.trim();
        while (clean.endsWith("/")) {
            clean = clean.substring(0, clean.length() - 1);
        }
        if (!clean.endsWith("/products")) {
            clean = clean + "/products";
        }
        return clean;
    }

    /**
     * Resolves the canonical public passport URL for a given product ID.
     */
    public String buildPassportUrl(Long productId) {
        return buildPassportUrl(productId, null, null, null);
    }

    /**
     * Backwards compatible overload for boolean LAN flag.
     */
    public String buildPassportUrl(Long productId, boolean useLan) {
        if (useLan && configuredLanHost != null && !configuredLanHost.trim().isEmpty()) {
            return buildPassportUrl(productId, null, configuredLanHost, null);
        }
        return buildPassportUrl(productId, null, null, null);
    }

    /**
     * Resolves the passport URL according to priority:
     * 1. customBaseUrl (if explicitly specified)
     * 2. customHost with optional port (if explicitly specified)
     * 3. configuredPublicBaseUrl (e.g. PRODUCTLIFE_PUBLIC_BASE_URL env var)
     * 4. configuredLanHost (e.g. PRODUCTLIFE_LAN_HOST env var)
     * 5. defaultBaseUrl (defaults to http://localhost:5174/products)
     */
    public String buildPassportUrl(Long productId, String customBaseUrl, String customHost, Integer customPort) {
        String base = resolveBaseUrl(customBaseUrl, customHost, customPort);
        return String.format("%s/%d", base, productId);
    }

    /**
     * Resolves the canonical public passport URL for a given public product code.
     */
    public String buildPassportUrlForCode(String productCode) {
        return buildPassportUrlForCode(productCode, null, null, null);
    }

    public String buildPassportUrlForCode(String productCode, String customBaseUrl, String customHost, Integer customPort) {
        String base = resolveBaseUrl(customBaseUrl, customHost, customPort);
        return String.format("%s/%s", base, productCode);
    }

    /**
     * Determines the effective base URL according to configuration priority.
     */
    public String resolveBaseUrl(String customBaseUrl, String customHost, Integer customPort) {
        if (customBaseUrl != null && !customBaseUrl.trim().isEmpty()) {
            return normalizeBaseUrl(customBaseUrl);
        }

        if (customHost != null && !customHost.trim().isEmpty()) {
            String host = customHost.trim();
            if (!host.startsWith("http://") && !host.startsWith("https://")) {
                int port = (customPort != null && customPort > 0) ? customPort : 5174;
                if (host.contains(":")) {
                    host = "http://" + host;
                } else {
                    host = "http://" + host + ":" + port;
                }
            }
            return normalizeBaseUrl(host);
        }

        if (configuredPublicBaseUrl != null && !configuredPublicBaseUrl.trim().isEmpty()) {
            return normalizeBaseUrl(configuredPublicBaseUrl);
        }

        if (configuredLanHost != null && !configuredLanHost.trim().isEmpty()) {
            String host = configuredLanHost.trim();
            if (!host.startsWith("http://") && !host.startsWith("https://")) {
                int port = (customPort != null && customPort > 0) ? customPort : 5174;
                if (host.contains(":")) {
                    host = "http://" + host;
                } else {
                    host = "http://" + host + ":" + port;
                }
            }
            return normalizeBaseUrl(host);
        }

        return normalizeBaseUrl(defaultBaseUrl);
    }

    /**
     * Checks if a resolved URL contains 'localhost' or loopback IP.
     */
    public static boolean containsLocalhost(String url) {
        if (url == null) return false;
        String lower = url.toLowerCase();
        return lower.contains("localhost") || lower.contains("127.0.0.1") || lower.contains("[::1]");
    }

    /**
     * Generates a PNG byte array for a QR code representing the supplied content.
     *
     * @param content Text or URL to encode in the QR code
     * @param width   Image width in pixels (e.g. 300)
     * @param height  Image height in pixels (e.g. 300)
     * @return Raw PNG image bytes
     */
    public byte[] generateQrCodePng(String content, int width, int height) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("QR code content cannot be null or empty");
        }

        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, StandardCharsets.UTF_8.name());
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M);
            hints.put(EncodeHintType.MARGIN, 2); // Clean 2-module quiet zone

            BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, width, height, hints);

            // Render with ProductLife brand theme palette
            MatrixToImageConfig config = new MatrixToImageConfig(BRAND_PRIMARY_COLOR, BACKGROUND_COLOR);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream, config);

            return outputStream.toByteArray();
        } catch (Exception ex) {
            log.error("Failed to generate QR code for content: {}", content, ex);
            throw new RuntimeException("Error generating QR code graphic: " + ex.getMessage(), ex);
        }
    }

    /**
     * Generates a Base64-encoded Data URL string (e.g., "data:image/png;base64,...").
     */
    public String generateQrCodeDataUrl(String content, int width, int height) {
        byte[] pngBytes = generateQrCodePng(content, width, height);
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(pngBytes);
    }
}
