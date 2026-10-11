package com.productlife;

import com.google.zxing.BinaryBitmap;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.Result;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import com.productlife.service.QrCodeService;
import org.junit.jupiter.api.Test;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit test verifying QR code generation, pixel formatting, and decoding round-trip.
 */
class ProductLifeApplicationTests {

    private final QrCodeService qrCodeService = new QrCodeService();

    @Test
    void testQrCodeGenerationAndDecodingRoundTrip() throws Exception {
        String testUrl = "http://localhost:5174/products/1";
        byte[] qrBytes = qrCodeService.generateQrCodePng(testUrl, 300, 300);
        assertNotNull(qrBytes);
        assertTrue(qrBytes.length > 0);

        // Decode the generated image bytes using ZXing reader
        ByteArrayInputStream inputStream = new ByteArrayInputStream(qrBytes);
        BufferedImage bufferedImage = ImageIO.read(inputStream);
        assertNotNull(bufferedImage, "Rendered image must be a valid readable graphic");

        BufferedImageLuminanceSource source = new BufferedImageLuminanceSource(bufferedImage);
        BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
        Result result = new MultiFormatReader().decode(bitmap);

        assertNotNull(result, "QR code decoding must succeed");
        assertEquals(testUrl, result.getText(), "Decoded text must match original encoded passport URL exactly");
    }

    @Test
    void testDecodePlEco001QrImageFile() throws Exception {
        File file = new File("pl_eco_001_qr.png");
        if (file.exists()) {
            BufferedImage bufferedImage = ImageIO.read(file);
            assertNotNull(bufferedImage);
            BufferedImageLuminanceSource source = new BufferedImageLuminanceSource(bufferedImage);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
            Result result = new MultiFormatReader().decode(bitmap);
            assertNotNull(result);
            System.out.println("DECODED_QR_CONTENT=" + result.getText());
        }
    }

    @Test
    void testDecodeLiveEndpointDefaultQrImageFile() throws Exception {
        File file = new File("test_default_qr.png");
        if (file.exists()) {
            BufferedImage bufferedImage = ImageIO.read(file);
            assertNotNull(bufferedImage);
            BufferedImageLuminanceSource source = new BufferedImageLuminanceSource(bufferedImage);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
            Result result = new MultiFormatReader().decode(bitmap);
            assertNotNull(result);
            System.out.println("DECODED_LIVE_DEFAULT_QR=" + result.getText());
            assertFalse(result.getText().contains("localhost"), "Default QR image must not contain localhost when public base URL is configured");
            assertEquals("http://192.168.1.6:5174/products/1", result.getText());
        }
    }

    @Test
    void testQrCodeDataUrlGeneration() {
        String testUrl = "http://localhost:5174/products/2";
        String dataUrl = qrCodeService.generateQrCodeDataUrl(testUrl, 200, 200);
        assertNotNull(dataUrl);
        assertTrue(dataUrl.startsWith("data:image/png;base64,"));
    }

    private String decodeQr(byte[] qrBytes) throws Exception {
        ByteArrayInputStream inputStream = new ByteArrayInputStream(qrBytes);
        BufferedImage bufferedImage = ImageIO.read(inputStream);
        assertNotNull(bufferedImage, "Rendered image must be a valid readable graphic");
        BufferedImageLuminanceSource source = new BufferedImageLuminanceSource(bufferedImage);
        BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
        Result result = new MultiFormatReader().decode(bitmap);
        assertNotNull(result, "QR code decoding must succeed");
        return result.getText();
    }

    @Test
    void testQrPayloadDoesNotContainLocalhostWhenPublicBaseUrlIsConfigured() throws Exception {
        QrCodeService publicQrService = new QrCodeService("http://192.168.1.100:5174", "http://localhost:5174/products", null);
        String resolvedUrl = publicQrService.buildPassportUrl(1L);

        // Verification 1: String payload does not contain localhost
        assertFalse(resolvedUrl.contains("localhost"), "URL must not contain localhost when public base URL is configured");
        assertFalse(QrCodeService.containsLocalhost(resolvedUrl), "containsLocalhost helper must return false");
        assertEquals("http://192.168.1.100:5174/products/1", resolvedUrl);

        // Verification 2: Encoded QR image decodes without localhost
        byte[] qrBytes = publicQrService.generateQrCodePng(resolvedUrl, 300, 300);
        String decodedText = decodeQr(qrBytes);
        assertFalse(decodedText.contains("localhost"), "Decoded QR must not contain localhost");
        assertEquals("http://192.168.1.100:5174/products/1", decodedText);
    }

    @Test
    void testQrPayloadDoesNotContainLocalhostWhenLanHostIsConfigured() throws Exception {
        QrCodeService lanQrService = new QrCodeService(null, "http://localhost:5174/products", "192.168.1.100");
        String resolvedUrl = lanQrService.buildPassportUrl(1L);

        // Verification 1: String payload does not contain localhost
        assertFalse(resolvedUrl.contains("localhost"), "URL must not contain localhost when LAN host is configured");
        assertFalse(QrCodeService.containsLocalhost(resolvedUrl), "containsLocalhost helper must return false");
        assertEquals("http://192.168.1.100:5174/products/1", resolvedUrl);

        // Verification 2: Encoded QR image decodes without localhost
        byte[] qrBytes = lanQrService.generateQrCodePng(resolvedUrl, 300, 300);
        String decodedText = decodeQr(qrBytes);
        assertFalse(decodedText.contains("localhost"), "Decoded QR must not contain localhost");
        assertEquals("http://192.168.1.100:5174/products/1", decodedText);
    }

    @Test
    void testCustomParametersOverrideLocalhost() throws Exception {
        // Test custom explicit baseUrl
        String customBaseUrl = "https://passports.productlife.com";
        String urlWithBase = qrCodeService.buildPassportUrl(1L, customBaseUrl, null, null);
        assertFalse(urlWithBase.contains("localhost"));
        assertEquals("https://passports.productlife.com/products/1", urlWithBase);

        // Test custom explicit host and port
        String urlWithHost = qrCodeService.buildPassportUrl(1L, null, "10.0.0.50", 5174);
        assertFalse(urlWithHost.contains("localhost"));
        assertEquals("http://10.0.0.50:5174/products/1", urlWithHost);

        // Verify decoded bytes for custom host
        byte[] qrBytes = qrCodeService.generateQrCodePng(urlWithHost, 300, 300);
        String decodedText = decodeQr(qrBytes);
        assertFalse(decodedText.contains("localhost"));
        assertEquals("http://10.0.0.50:5174/products/1", decodedText);
    }

    @Test
    void testBaseUrlNormalization() {
        assertEquals("http://192.168.1.50:5174/products", qrCodeService.normalizeBaseUrl("http://192.168.1.50:5174"));
        assertEquals("http://192.168.1.50:5174/products", qrCodeService.normalizeBaseUrl("http://192.168.1.50:5174/"));
        assertEquals("http://192.168.1.50:5174/products", qrCodeService.normalizeBaseUrl("http://192.168.1.50:5174/products"));
        assertEquals("http://192.168.1.50:5174/products", qrCodeService.normalizeBaseUrl("http://192.168.1.50:5174/products/"));
        assertEquals("https://passports.productlife.com/products", qrCodeService.normalizeBaseUrl("https://passports.productlife.com"));
    }

    @Test
    void testLocalhostDefaultWhenNoConfigProvided() {
        QrCodeService defaultQrService = new QrCodeService();
        String url = defaultQrService.buildPassportUrl(1L);
        assertEquals("http://localhost:5174/products/1", url);
        assertTrue(QrCodeService.containsLocalhost(url));
    }

    @Test
    void testInvalidInputThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> {
            qrCodeService.generateQrCodePng("", 300, 300);
        });
        assertThrows(IllegalArgumentException.class, () -> {
            qrCodeService.generateQrCodePng(null, 300, 300);
        });
    }
}
