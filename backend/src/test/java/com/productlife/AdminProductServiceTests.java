package com.productlife;

import com.productlife.dto.AdminAuthDTO;
import com.productlife.dto.AdminStatsDTO;
import com.productlife.dto.ProductCreateDTO;
import com.productlife.dto.ProductDetailDTO;
import com.productlife.entity.Product;
import com.productlife.exception.DuplicateResourceException;
import com.productlife.exception.UnauthorizedException;
import com.productlife.repository.ProductRepository;
import com.productlife.repository.RepairHistoryRepository;
import com.productlife.service.AdminAuthService;
import com.productlife.service.AdminProductServiceImpl;
import com.productlife.service.QrCodeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminProductServiceTests {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private RepairHistoryRepository repairHistoryRepository;

    @Mock
    private QrCodeService qrCodeService;

    private AdminProductServiceImpl adminProductService;
    private AdminAuthService adminAuthService;

    private static final String TEST_ADMIN_USER = "mockAdmin";
    private static final String TEST_ADMIN_PASS = "MockAdminSecretPass!456";

    @BeforeEach
    void setUp() {
        adminProductService = new AdminProductServiceImpl(productRepository, repairHistoryRepository, qrCodeService);
        adminAuthService = new AdminAuthService(TEST_ADMIN_USER, TEST_ADMIN_PASS);
    }

    @Test
    void testAdminAuthLoginSuccess() {
        AdminAuthDTO.AuthResponse response = adminAuthService.login(TEST_ADMIN_USER, TEST_ADMIN_PASS);
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertTrue(response.getToken().startsWith("pl_adm_"));
        assertEquals(TEST_ADMIN_USER, response.getUsername());
        assertEquals("ROLE_ADMIN", response.getRole());

        // Token should be valid
        assertTrue(adminAuthService.validateToken(response.getToken()));
        assertTrue(adminAuthService.validateToken("Bearer " + response.getToken()));
    }

    @Test
    void testAdminAuthLoginFailure() {
        assertThrows(UnauthorizedException.class, () -> {
            adminAuthService.login(TEST_ADMIN_USER, "wrong_password");
        });
        assertThrows(UnauthorizedException.class, () -> {
            adminAuthService.login("unknown_user", TEST_ADMIN_PASS);
        });
        assertThrows(UnauthorizedException.class, () -> {
            adminAuthService.login(null, TEST_ADMIN_PASS);
        });
    }

    @Test
    void testAdminAuthFailsSafelyWhenCredentialsUnconfigured() {
        // When password or username is blank or null, authentication must fail safely
        AdminAuthService unconfigured1 = new AdminAuthService("admin", "");
        assertThrows(UnauthorizedException.class, () -> unconfigured1.login("admin", ""));

        AdminAuthService unconfigured2 = new AdminAuthService("admin", null);
        assertThrows(UnauthorizedException.class, () -> unconfigured2.login("admin", "somePass"));

        AdminAuthService unconfigured3 = new AdminAuthService("", "somePass");
        assertThrows(UnauthorizedException.class, () -> unconfigured3.login("admin", "somePass"));
    }

    @Test
    void testAdminAuthLogout() {
        AdminAuthDTO.AuthResponse response = adminAuthService.login(TEST_ADMIN_USER, TEST_ADMIN_PASS);
        assertTrue(adminAuthService.validateToken(response.getToken()));

        adminAuthService.logout(response.getToken());
        assertFalse(adminAuthService.validateToken(response.getToken()));
    }

    @Test
    void testCreateProductDuplicateCodeThrowsConflict() {
        ProductCreateDTO dto = new ProductCreateDTO();
        dto.setProductCode("PL-ECO-001");
        dto.setName("Duplicate Flask");

        when(productRepository.existsByProductCode("PL-ECO-001")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> {
            adminProductService.createProduct(dto);
        });

        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testCreateProductSuccess() {
        ProductCreateDTO dto = new ProductCreateDTO();
        dto.setProductCode("PL-NEW-005");
        dto.setName("Eco Urban Jacket");
        dto.setBrand("Nordic Circular");
        dto.setCategory("Apparel");
        dto.setManufacturer("Nordic Mills");
        dto.setCountryOfOrigin("Norway");
        dto.setMfgDate(LocalDate.of(2024, 5, 1));
        dto.setDescription("Recycled softshell jacket");
        dto.setStatus("ACTIVE");

        when(productRepository.existsByProductCode("PL-NEW-005")).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product p = invocation.getArgument(0);
            p.setId(5L);
            return p;
        });
        when(qrCodeService.buildPassportUrl(5L)).thenReturn("http://192.168.1.6:5174/products/5");

        ProductDetailDTO result = adminProductService.createProduct(dto);

        assertNotNull(result);
        assertEquals(5L, result.getId());
        assertEquals("PL-NEW-005", result.getProductCode());
        assertEquals("ACTIVE", result.getStatus());
        assertEquals("http://192.168.1.6:5174/products/5", result.getPassportUrl());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void testDashboardStats() {
        when(productRepository.count()).thenReturn(4L);
        when(productRepository.countActiveProducts()).thenReturn(3L);
        when(productRepository.countByStatusIgnoreCase("DRAFT")).thenReturn(1L);
        when(productRepository.countByStatusIgnoreCase("DISCONTINUED")).thenReturn(0L);
        when(productRepository.countByStatusIgnoreCase("RECALLED")).thenReturn(0L);
        when(productRepository.findDistinctCategories()).thenReturn(List.of("Drinkware", "Footwear"));
        when(repairHistoryRepository.count()).thenReturn(3L);
        when(productRepository.findTop5ByOrderByUpdatedAtDesc()).thenReturn(Collections.emptyList());

        AdminStatsDTO stats = adminProductService.getDashboardStats();

        assertNotNull(stats);
        assertEquals(4L, stats.getTotalProducts());
        assertEquals(3L, stats.getActiveProducts());
        assertEquals(1L, stats.getDraftProducts());
        assertEquals(3L, stats.getTotalRepairs());
        assertEquals(2L, stats.getTotalCategories());
    }
}
