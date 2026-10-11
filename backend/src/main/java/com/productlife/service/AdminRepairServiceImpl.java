package com.productlife.service;

import com.productlife.dto.RepairCreateDTO;
import com.productlife.dto.RepairHistoryDTO;
import com.productlife.dto.RepairUpdateDTO;
import com.productlife.entity.Product;
import com.productlife.entity.RepairHistory;
import com.productlife.exception.ResourceNotFoundException;
import com.productlife.repository.ProductRepository;
import com.productlife.repository.RepairHistoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for managing product repair and maintenance lifecycle records.
 */
@Service
public class AdminRepairServiceImpl implements AdminRepairService {

    private static final Logger log = LoggerFactory.getLogger(AdminRepairServiceImpl.class);

    private final ProductRepository productRepository;
    private final RepairHistoryRepository repairHistoryRepository;

    public AdminRepairServiceImpl(ProductRepository productRepository,
                                  RepairHistoryRepository repairHistoryRepository) {
        this.productRepository = productRepository;
        this.repairHistoryRepository = repairHistoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RepairHistoryDTO> getRepairsByProductId(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with ID: " + productId);
        }
        return repairHistoryRepository.findByProductIdOrderByRepairDateDesc(productId)
                .stream()
                .map(RepairHistoryDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RepairHistoryDTO getRepairById(Long productId, Long repairId) {
        RepairHistory repair = findRepairForProduct(productId, repairId);
        return new RepairHistoryDTO(repair);
    }

    @Override
    @Transactional
    public RepairHistoryDTO createRepair(Long productId, RepairCreateDTO createDTO) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        RepairHistory repair = new RepairHistory(
                createDTO.getRepairDate(),
                createDTO.getServiceCenter().trim(),
                createDTO.getDescription().trim(),
                createDTO.getPartsReplaced() != null ? createDTO.getPartsReplaced().trim() : null,
                createDTO.getTechnicianNotes() != null ? createDTO.getTechnicianNotes().trim() : null
        );

        repair.setProduct(product);
        RepairHistory saved = repairHistoryRepository.save(repair);

        log.info("Logged new maintenance record ID {} for product ID {} ({})",
                saved.getId(), product.getId(), product.getProductCode());
        return new RepairHistoryDTO(saved);
    }

    @Override
    @Transactional
    public RepairHistoryDTO updateRepair(Long productId, Long repairId, RepairUpdateDTO updateDTO) {
        RepairHistory repair = findRepairForProduct(productId, repairId);

        repair.setRepairDate(updateDTO.getRepairDate());
        repair.setServiceCenter(updateDTO.getServiceCenter().trim());
        repair.setDescription(updateDTO.getDescription().trim());
        repair.setPartsReplaced(updateDTO.getPartsReplaced() != null ? updateDTO.getPartsReplaced().trim() : null);
        repair.setTechnicianNotes(updateDTO.getTechnicianNotes() != null ? updateDTO.getTechnicianNotes().trim() : null);

        RepairHistory updated = repairHistoryRepository.save(repair);
        log.info("Updated maintenance record ID {} for product ID {}", repairId, productId);
        return new RepairHistoryDTO(updated);
    }

    @Override
    @Transactional
    public void deleteRepair(Long productId, Long repairId) {
        RepairHistory repair = findRepairForProduct(productId, repairId);
        repairHistoryRepository.delete(repair);
        log.info("Deleted maintenance record ID {} for product ID {}", repairId, productId);
    }

    private RepairHistory findRepairForProduct(Long productId, Long repairId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with ID: " + productId);
        }

        RepairHistory repair = repairHistoryRepository.findById(repairId)
                .orElseThrow(() -> new ResourceNotFoundException("Repair record not found with ID: " + repairId));

        if (!repair.getProduct().getId().equals(productId)) {
            throw new ResourceNotFoundException("Repair record ID " + repairId + " does not belong to product ID " + productId);
        }

        return repair;
    }
}
