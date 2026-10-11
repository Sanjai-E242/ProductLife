package com.productlife.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Data Transfer Object for updating an existing maintenance record.
 */
public class RepairUpdateDTO {

    @NotNull(message = "Repair date is required")
    @PastOrPresent(message = "Repair date cannot be in the future")
    private LocalDate repairDate;

    @NotBlank(message = "Service center / facility name is required")
    @Size(max = 150, message = "Service center name cannot exceed 150 characters")
    private String serviceCenter;

    @NotBlank(message = "Repair description is required")
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @Size(max = 500, message = "Parts replaced cannot exceed 500 characters")
    private String partsReplaced;

    @Size(max = 1000, message = "Technician notes cannot exceed 1000 characters")
    private String technicianNotes;

    public RepairUpdateDTO() {
    }

    public RepairUpdateDTO(LocalDate repairDate, String serviceCenter, String description,
                           String partsReplaced, String technicianNotes) {
        this.repairDate = repairDate;
        this.serviceCenter = serviceCenter;
        this.description = description;
        this.partsReplaced = partsReplaced;
        this.technicianNotes = technicianNotes;
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
}
