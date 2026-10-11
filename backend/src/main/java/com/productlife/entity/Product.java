package com.productlife.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Product Entity
 * 
 * Represents the primary physical item for which a Digital Product Passport is created.
 * Mapped to the 'products' table in MySQL.
 */
@Entity
@Table(name = "products", uniqueConstraints = {
    @UniqueConstraint(name = "uk_product_code", columnNames = "product_code")
})
public class Product {

    /**
     * Database Primary Key: Unique surrogate numerical identifier auto-incremented by MySQL.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Unique Public Passport Identifier (e.g. "PL-ECO-001").
     * Used in public QR code URLs.
     */
    @NotBlank(message = "Product code is required")
    @Column(name = "product_code", nullable = false, unique = true, length = 64)
    private String productCode;

    @NotBlank(message = "Product name is required")
    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @NotBlank(message = "Brand is required")
    @Column(name = "brand", nullable = false, length = 100)
    private String brand;

    @NotBlank(message = "Category is required")
    @Column(name = "category", nullable = false, length = 80)
    private String category;

    @Column(name = "model", length = 100)
    private String model;

    @NotBlank(message = "Manufacturer is required")
    @Column(name = "manufacturer", nullable = false, length = 150)
    private String manufacturer;

    @NotBlank(message = "Country of origin is required")
    @Column(name = "country_of_origin", nullable = false, length = 100)
    private String countryOfOrigin;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "materials", length = 1500)
    private String materials;

    @NotNull(message = "Manufacturing date is required")
    @Column(name = "mfg_date", nullable = false)
    private LocalDate mfgDate;

    @Column(name = "care_instructions", length = 2000)
    private String careInstructions;

    @Column(name = "recycling_instructions", length = 2000)
    private String recyclingInstructions;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "status", length = 30)
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * One-to-Many Relationship:
     * One Product can have multiple RepairHistory log entries.
     * CascadeType.ALL ensures deleting a product automatically removes its child repair records.
     */
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<RepairHistory> repairHistoryList = new ArrayList<>();

    public Product() {
    }

    public Product(String productCode, String name, String brand, String category, String model,
                   String manufacturer, String countryOfOrigin, String description, String materials,
                   LocalDate mfgDate, String careInstructions, String recyclingInstructions, String imageUrl) {
        this.productCode = productCode;
        this.name = name;
        this.brand = brand;
        this.category = category;
        this.model = model;
        this.manufacturer = manufacturer;
        this.countryOfOrigin = countryOfOrigin;
        this.description = description;
        this.materials = materials;
        this.mfgDate = mfgDate;
        this.careInstructions = careInstructions;
        this.recyclingInstructions = recyclingInstructions;
        this.imageUrl = imageUrl;
        this.status = "ACTIVE";
    }

    @PrePersist
    protected void onCreate() {
        if (this.status == null || this.status.trim().isEmpty()) {
            this.status = "ACTIVE";
        }
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Helper method to maintain bidirectional relationship integrity
    public void addRepairRecord(RepairHistory repairHistory) {
        repairHistoryList.add(repairHistory);
        repairHistory.setProduct(this);
    }

    public void removeRepairRecord(RepairHistory repairHistory) {
        repairHistoryList.remove(repairHistory);
        repairHistory.setProduct(null);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getCountryOfOrigin() {
        return countryOfOrigin;
    }

    public void setCountryOfOrigin(String countryOfOrigin) {
        this.countryOfOrigin = countryOfOrigin;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMaterials() {
        return materials;
    }

    public void setMaterials(String materials) {
        this.materials = materials;
    }

    public LocalDate getMfgDate() {
        return mfgDate;
    }

    public void setMfgDate(LocalDate mfgDate) {
        this.mfgDate = mfgDate;
    }

    public String getCareInstructions() {
        return careInstructions;
    }

    public void setCareInstructions(String careInstructions) {
        this.careInstructions = careInstructions;
    }

    public String getRecyclingInstructions() {
        return recyclingInstructions;
    }

    public void setRecyclingInstructions(String recyclingInstructions) {
        this.recyclingInstructions = recyclingInstructions;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<RepairHistory> getRepairHistoryList() {
        return repairHistoryList;
    }

    public void setRepairHistoryList(List<RepairHistory> repairHistoryList) {
        this.repairHistoryList = repairHistoryList;
    }

    public String getStatus() {
        return (status != null && !status.trim().isEmpty()) ? status : "ACTIVE";
    }

    public void setStatus(String status) {
        this.status = (status != null && !status.trim().isEmpty()) ? status.trim().toUpperCase() : "ACTIVE";
    }
}
