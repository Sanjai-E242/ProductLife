package com.productlife.controller;

import com.productlife.dto.RepairCreateDTO;
import com.productlife.dto.RepairHistoryDTO;
import com.productlife.dto.RepairUpdateDTO;
import com.productlife.service.AdminRepairService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Controller managing administrative maintenance and repair event logs.
 * Protected by AdminAuthInterceptor under /api/admin/**.
 */
@RestController
@RequestMapping("/api/admin/products/{productId}/repairs")
public class AdminRepairController {

    private final AdminRepairService adminRepairService;

    public AdminRepairController(AdminRepairService adminRepairService) {
        this.adminRepairService = adminRepairService;
    }

    /**
     * HTTP GET /api/admin/products/{productId}/repairs
     * List all maintenance events logged for a specific product passport.
     */
    @GetMapping
    public ResponseEntity<List<RepairHistoryDTO>> getRepairs(@PathVariable Long productId) {
        List<RepairHistoryDTO> repairs = adminRepairService.getRepairsByProductId(productId);
        return ResponseEntity.ok(repairs);
    }

    /**
     * HTTP GET /api/admin/products/{productId}/repairs/{repairId}
     * Retrieve an individual repair record.
     */
    @GetMapping("/{repairId}")
    public ResponseEntity<RepairHistoryDTO> getRepairById(
            @PathVariable Long productId,
            @PathVariable Long repairId) {
        RepairHistoryDTO repair = adminRepairService.getRepairById(productId, repairId);
        return ResponseEntity.ok(repair);
    }

    /**
     * HTTP POST /api/admin/products/{productId}/repairs
     * Log a new maintenance or repair event for a product passport.
     */
    @PostMapping
    public ResponseEntity<RepairHistoryDTO> createRepair(
            @PathVariable Long productId,
            @Valid @RequestBody RepairCreateDTO createDTO) {
        RepairHistoryDTO created = adminRepairService.createRepair(productId, createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * HTTP PUT /api/admin/products/{productId}/repairs/{repairId}
     * Update an existing maintenance record.
     */
    @PutMapping("/{repairId}")
    public ResponseEntity<RepairHistoryDTO> updateRepair(
            @PathVariable Long productId,
            @PathVariable Long repairId,
            @Valid @RequestBody RepairUpdateDTO updateDTO) {
        RepairHistoryDTO updated = adminRepairService.updateRepair(productId, repairId, updateDTO);
        return ResponseEntity.ok(updated);
    }

    /**
     * HTTP DELETE /api/admin/products/{productId}/repairs/{repairId}
     * Remove a maintenance record.
     */
    @DeleteMapping("/{repairId}")
    public ResponseEntity<Map<String, String>> deleteRepair(
            @PathVariable Long productId,
            @PathVariable Long repairId) {
        adminRepairService.deleteRepair(productId, repairId);
        return ResponseEntity.ok(Collections.singletonMap("message", "Maintenance record deleted successfully"));
    }
}
