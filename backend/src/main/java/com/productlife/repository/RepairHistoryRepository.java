package com.productlife.repository;

import com.productlife.entity.RepairHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * RepairHistory Repository
 * 
 * Provides automated CRUD and query execution against the 'repair_history' table.
 */
@Repository
public interface RepairHistoryRepository extends JpaRepository<RepairHistory, Long> {

    /**
     * Retrieve all repair records for a specific product, ordered with most recent first.
     */
    List<RepairHistory> findByProductIdOrderByRepairDateDesc(Long productId);

    /**
     * Retrieve all repair records using the product's public code.
     */
    List<RepairHistory> findByProductProductCodeOrderByRepairDateDesc(String productCode);
}
