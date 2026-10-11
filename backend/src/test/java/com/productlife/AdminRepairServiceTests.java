package com.productlife;

import com.productlife.dto.RepairCreateDTO;
import com.productlife.dto.RepairHistoryDTO;
import com.productlife.dto.RepairUpdateDTO;
import com.productlife.entity.Product;
import com.productlife.entity.RepairHistory;
import com.productlife.exception.ResourceNotFoundException;
import com.productlife.repository.ProductRepository;
import com.productlife.repository.RepairHistoryRepository;
import com.productlife.service.AdminRepairServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminRepairServiceTests {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private RepairHistoryRepository repairHistoryRepository;

    private AdminRepairServiceImpl adminRepairService;

    private Product testProduct;
    private RepairHistory testRepair;

    @BeforeEach
    void setUp() {
        adminRepairService = new AdminRepairServiceImpl(productRepository, repairHistoryRepository);

        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setProductCode("PL-ECO-001");
        testProduct.setName("HydroPure Flask");

        testRepair = new RepairHistory(
                LocalDate.of(2024, 6, 15),
                "Stockholm Service Hub",
                "Replaced silicone seal gasket",
                "Gasket-GK750",
                "Vacuum seal verified optimal"
        );
        testRepair.setId(10L);
        testRepair.setProduct(testProduct);
    }

    @Test
    void testGetRepairsForValidProduct() {
        when(productRepository.existsById(1L)).thenReturn(true);
        when(repairHistoryRepository.findByProductIdOrderByRepairDateDesc(1L))
                .thenReturn(List.of(testRepair));

        List<RepairHistoryDTO> list = adminRepairService.getRepairsByProductId(1L);
        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("Stockholm Service Hub", list.get(0).getServiceCenter());
    }

    @Test
    void testGetRepairsForNonexistentProductThrows404() {
        when(productRepository.existsById(999L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> {
            adminRepairService.getRepairsByProductId(999L);
        });
    }

    @Test
    void testCreateRepairSuccess() {
        RepairCreateDTO dto = new RepairCreateDTO(
                LocalDate.of(2024, 7, 1),
                "Oslo Eco Tech Lab",
                "Preventative valve check",
                "Valve-V1",
                "Passed pressure test"
        );

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(repairHistoryRepository.save(any(RepairHistory.class))).thenAnswer(invocation -> {
            RepairHistory r = invocation.getArgument(0);
            r.setId(20L);
            return r;
        });

        RepairHistoryDTO result = adminRepairService.createRepair(1L, dto);
        assertNotNull(result);
        assertEquals(20L, result.getId());
        assertEquals("Oslo Eco Tech Lab", result.getServiceCenter());
        assertEquals("Valve-V1", result.getPartsReplaced());
        verify(repairHistoryRepository, times(1)).save(any(RepairHistory.class));
    }

    @Test
    void testCreateRepairProductNotFoundThrows404() {
        RepairCreateDTO dto = new RepairCreateDTO(
                LocalDate.of(2024, 7, 1),
                "Oslo Eco Tech Lab",
                "Valve check",
                null, null
        );

        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            adminRepairService.createRepair(999L, dto);
        });
        verify(repairHistoryRepository, never()).save(any());
    }

    @Test
    void testUpdateRepairSuccess() {
        RepairUpdateDTO updateDTO = new RepairUpdateDTO(
                LocalDate.of(2024, 6, 20),
                "Stockholm Service Hub - Central",
                "Updated description: Gasket and seal replacement",
                "Gasket-GK750-V2",
                "Updated technician note"
        );

        when(productRepository.existsById(1L)).thenReturn(true);
        when(repairHistoryRepository.findById(10L)).thenReturn(Optional.of(testRepair));
        when(repairHistoryRepository.save(any(RepairHistory.class))).thenReturn(testRepair);

        RepairHistoryDTO updated = adminRepairService.updateRepair(1L, 10L, updateDTO);
        assertNotNull(updated);
        assertEquals("Stockholm Service Hub - Central", updated.getServiceCenter());
        assertEquals("Gasket-GK750-V2", updated.getPartsReplaced());
        verify(repairHistoryRepository, times(1)).save(testRepair);
    }

    @Test
    void testUpdateRepairMismatchProductThrows404() {
        RepairUpdateDTO updateDTO = new RepairUpdateDTO(
                LocalDate.of(2024, 6, 20),
                "Center", "Desc", null, null
        );

        // testRepair belongs to product 1L, but user queries with productId 2L
        when(productRepository.existsById(2L)).thenReturn(true);
        when(repairHistoryRepository.findById(10L)).thenReturn(Optional.of(testRepair));

        assertThrows(ResourceNotFoundException.class, () -> {
            adminRepairService.updateRepair(2L, 10L, updateDTO);
        });
        verify(repairHistoryRepository, never()).save(any());
    }

    @Test
    void testDeleteRepairSuccess() {
        when(productRepository.existsById(1L)).thenReturn(true);
        when(repairHistoryRepository.findById(10L)).thenReturn(Optional.of(testRepair));

        adminRepairService.deleteRepair(1L, 10L);
        verify(repairHistoryRepository, times(1)).delete(testRepair);
    }
}
