package com.productlife.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * DTO for creating a new Digital Product Passport.
 * Enforces mandatory identity, manufacturing, and circularity disclosures.
 */
public class ProductCreateDTO {

    @NotBlank(message = "Product passport code is required")
    @Size(min = 3, max = 64, message = "Product code must be between 3 and 64 characters")
    @Pattern(regexp = "^[A-Za-z0-9_-]+$", message = "Product code may only contain alphanumeric characters, hyphens, and underscores")
    private String productCode;

    @NotBlank(message = "Product name is required")
    @Size(max = 150, message = "Product name must not exceed 150 characters")
    private String name;

    @NotBlank(message = "Brand is required")
    @Size(max = 100, message = "Brand must not exceed 100 characters")
    private String brand;

    @NotBlank(message = "Category is required")
    @Size(max = 80, message = "Category must not exceed 80 characters")
    private String category;

    @Size(max = 100, message = "Model must not exceed 100 characters")
    private String model;

    @NotBlank(message = "Manufacturer is required")
    @Size(max = 150, message = "Manufacturer must not exceed 150 characters")
    private String manufacturer;

    @NotBlank(message = "Country of origin is required")
    @Size(max = 100, message = "Country of origin must not exceed 100 characters")
    private String countryOfOrigin;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @Size(max = 1500, message = "Materials specification must not exceed 1500 characters")
    private String materials;

    @NotNull(message = "Manufacturing date is required")
    private LocalDate mfgDate;

    @Size(max = 2000, message = "Care instructions must not exceed 2000 characters")
    private String careInstructions;

    @Size(max = 2000, message = "Recycling instructions must not exceed 2000 characters")
    private String recyclingInstructions;

    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;

    private String status = "ACTIVE";

    public ProductCreateDTO() {
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

    public String getStatus() {
        return (status != null && !status.trim().isEmpty()) ? status.trim().toUpperCase() : "ACTIVE";
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
