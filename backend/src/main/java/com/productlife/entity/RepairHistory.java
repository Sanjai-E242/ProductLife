package com.productlife.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * RepairHistory Entity
 * 
 * Tracks authorized maintenance events, component replacements, and service logs
 * for a specific physical product. Mapped to the 'repair_history' table in MySQL.
 */
@Entity
@Table(name = "repair_history")
public class RepairHistory {

    /**
     * Primary Key for the repair record.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Repair date is required")
    @Column(name = "repair_date", nullable = false)
    private LocalDate repairDate;

    @NotBlank(message = "Service center / facility name is required")
    @Column(name = "service_center", nullable = false, length = 150)
    private String serviceCenter;

    @NotBlank(message = "Repair description is required")
    @Column(name = "description", nullable = false, length = 1000)
    private String description;

    @Column(name = "parts_replaced", length = 500)
    private String partsReplaced;

    @Column(name = "technician_notes", length = 1000)
    private String technicianNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Foreign Key Relationship:
     * Many repair entries belong to One Product.
     * Maps to the 'product_id' foreign key column in MySQL.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, foreignKey = @ForeignKey(name = "fk_repair_product"))
    @JsonBackReference
    private Product product;

    public RepairHistory() {
    }

    public RepairHistory(LocalDate repairDate, String serviceCenter, String description,
                         String partsReplaced, String technicianNotes) {
        this.repairDate = repairDate;
        this.serviceCenter = serviceCenter;
        this.description = description;
        this.partsReplaced = partsReplaced;
        this.technicianNotes = technicianNotes;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
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

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
