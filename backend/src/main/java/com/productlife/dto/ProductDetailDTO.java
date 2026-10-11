package com.productlife.dto;

import com.productlife.entity.Product;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Data Transfer Object for detailed Digital Product Passport views.
 * Contains complete specifications, circular economy instructions, and maintenance logs.
 */
public class ProductDetailDTO {

    private Long id;
    private String productCode;
    private String name;
    private String brand;
    private String category;
    private String model;
    private String manufacturer;
    private String countryOfOrigin;
    private String description;
    private String materials;
    private LocalDate mfgDate;
    private String careInstructions;
    private String recyclingInstructions;
    private String imageUrl;
    private String status;
    private String passportUrl;
    private String qrCodeUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<RepairHistoryDTO> repairHistory = new ArrayList<>();

    public ProductDetailDTO() {
    }

    public ProductDetailDTO(Product product) {
        this(product, null);
    }

    public ProductDetailDTO(Product product, String passportUrl) {
        if (product != null) {
            this.id = product.getId();
            this.productCode = product.getProductCode();
            this.name = product.getName();
            this.brand = product.getBrand();
            this.category = product.getCategory();
            this.model = product.getModel();
            this.manufacturer = product.getManufacturer();
            this.countryOfOrigin = product.getCountryOfOrigin();
            this.description = product.getDescription();
            this.materials = product.getMaterials();
            this.mfgDate = product.getMfgDate();
            this.careInstructions = product.getCareInstructions();
            this.recyclingInstructions = product.getRecyclingInstructions();
            this.imageUrl = product.getImageUrl();
            this.status = product.getStatus();
            this.passportUrl = passportUrl;
            this.qrCodeUrl = "/api/products/" + product.getId() + "/qrcode";
            this.createdAt = product.getCreatedAt();
            this.updatedAt = product.getUpdatedAt();

            if (product.getRepairHistoryList() != null) {
                this.repairHistory = product.getRepairHistoryList().stream()
                        .map(RepairHistoryDTO::new)
                        .collect(Collectors.toList());
            }
        }
    }

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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getPassportUrl() {
        return passportUrl;
    }

    public void setPassportUrl(String passportUrl) {
        this.passportUrl = passportUrl;
    }

    public String getQrCodeUrl() {
        return qrCodeUrl;
    }

    public void setQrCodeUrl(String qrCodeUrl) {
        this.qrCodeUrl = qrCodeUrl;
    }

    public List<RepairHistoryDTO> getRepairHistory() {
        return repairHistory;
    }

    public void setRepairHistory(List<RepairHistoryDTO> repairHistory) {
        this.repairHistory = repairHistory;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
