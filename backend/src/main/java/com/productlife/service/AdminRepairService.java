package com.productlife.service;

import com.productlife.dto.RepairCreateDTO;
import com.productlife.dto.RepairHistoryDTO;
import com.productlife.dto.RepairUpdateDTO;

import java.util.List;

/**
 * Service interface for administrative repair history management.
 */
public interface AdminRepairService {

    /**
     * Retrieve all repair records for a specific product ID, ordered with most recent first.
     */
    List<RepairHistoryDTO> getRepairsByProductId(Long productId);

    /**
     * Retrieve an individual repair record by product ID and repair ID.
     */
    RepairHistoryDTO getRepairById(Long productId, Long repairId);

    /**
     * Log a new maintenance/repair event for a product.
     */
    RepairHistoryDTO createRepair(Long productId, RepairCreateDTO createDTO);

    /**
     * Update an existing repair record.
     */
    RepairHistoryDTO updateRepair(Long productId, Long repairId, RepairUpdateDTO updateDTO);

    /**
     * Delete an existing repair record.
     */
    void deleteRepair(Long productId, Long repairId);
}
