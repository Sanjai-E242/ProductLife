package com.productlife.dto;

import com.productlife.entity.Product;

import java.time.LocalDate;

/**
 * Data Transfer Object for Product catalog listing in Product Explorer.
 */
public class ProductSummaryDTO {

    private Long id;
    private String productCode;
    private String name;
    private String brand;
    private String category;
    private String model;
    private String countryOfOrigin;
    private LocalDate mfgDate;
    private String description;
    private String materials;
    private String imageUrl;
    private String status;
    private int repairCount;

    public ProductSummaryDTO() {
    }

    public ProductSummaryDTO(Product product) {
        if (product != null) {
            this.id = product.getId();
            this.productCode = product.getProductCode();
            this.name = product.getName();
            this.brand = product.getBrand();
            this.category = product.getCategory();
            this.model = product.getModel();
            this.countryOfOrigin = product.getCountryOfOrigin();
            this.mfgDate = product.getMfgDate();
            this.description = product.getDescription();
            this.materials = product.getMaterials();
            this.imageUrl = product.getImageUrl();
            this.status = product.getStatus();
            this.repairCount = (product.getRepairHistoryList() != null) ? product.getRepairHistoryList().size() : 0;
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

    public String getCountryOfOrigin() {
        return countryOfOrigin;
    }

    public void setCountryOfOrigin(String countryOfOrigin) {
        this.countryOfOrigin = countryOfOrigin;
    }

    public LocalDate getMfgDate() {
        return mfgDate;
    }

    public void setMfgDate(LocalDate mfgDate) {
        this.mfgDate = mfgDate;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public int getRepairCount() {
        return repairCount;
    }

    public void setRepairCount(int repairCount) {
        this.repairCount = repairCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
