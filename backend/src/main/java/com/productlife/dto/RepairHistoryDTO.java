package com.productlife.dto;

import com.productlife.entity.RepairHistory;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for RepairHistory entity.
 */
public class RepairHistoryDTO {

    private Long id;
    private LocalDate repairDate;
    private String serviceCenter;
    private String description;
    private String partsReplaced;
    private String technicianNotes;
    private LocalDateTime createdAt;

    public RepairHistoryDTO() {
    }

    public RepairHistoryDTO(RepairHistory repairHistory) {
        if (repairHistory != null) {
            this.id = repairHistory.getId();
            this.repairDate = repairHistory.getRepairDate();
            this.serviceCenter = repairHistory.getServiceCenter();
            this.description = repairHistory.getDescription();
            this.partsReplaced = repairHistory.getPartsReplaced();
            this.technicianNotes = repairHistory.getTechnicianNotes();
            this.createdAt = repairHistory.getCreatedAt();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getRepairDate() {
        return repairDate;
    }

    public void setRepairDate(LocalDate repairDate) {
        this.repairDate = repairDate;
    }

    public String getServiceCenter() {
        return serviceCenter;
    }

    public void setServiceCenter(String serviceCenter) {
        this.serviceCenter = serviceCenter;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPartsReplaced() {
        return partsReplaced;
    }

    public void setPartsReplaced(String partsReplaced) {
        this.partsReplaced = partsReplaced;
    }

    public String getTechnicianNotes() {
        return technicianNotes;
    }

    public void setTechnicianNotes(String technicianNotes) {
        this.technicianNotes = technicianNotes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
