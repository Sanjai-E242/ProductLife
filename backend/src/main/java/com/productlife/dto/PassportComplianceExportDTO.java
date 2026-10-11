package com.productlife.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Compliance Export Data Transfer Object for EU Digital Product Passport (DPP) standards.
 * Provides machine-readable circularity disclosures, material information, and complete lifecycle logs.
 */
public class PassportComplianceExportDTO {

    private PassportHeader header;
    private ProductDetails product;
    private CircularityDisclosures circularity;
    private MaintenanceLog lifecycle;

    public PassportComplianceExportDTO() {
    }

    public PassportComplianceExportDTO(PassportHeader header, ProductDetails product,
                                       CircularityDisclosures circularity, MaintenanceLog lifecycle) {
        this.header = header;
        this.product = product;
        this.circularity = circularity;
        this.lifecycle = lifecycle;
    }

    public PassportHeader getHeader() {
        return header;
    }

    public void setHeader(PassportHeader header) {
        this.header = header;
    }

    public ProductDetails getProduct() {
        return product;
    }

    public void setProduct(ProductDetails product) {
        this.product = product;
    }

    public CircularityDisclosures getCircularity() {
        return circularity;
    }

    public void setCircularity(CircularityDisclosures circularity) {
        this.circularity = circularity;
    }

    public MaintenanceLog getLifecycle() {
        return lifecycle;
    }

    public void setLifecycle(MaintenanceLog lifecycle) {
        this.lifecycle = lifecycle;
    }

    public static class PassportHeader {
        private String standardVersion = "EU-DPP-1.0-ALIGNED";
        private String registryPlatform = "ProductLife Digital Product Passport Platform";
        private String verificationStatus = "VERIFIED";
        private LocalDateTime exportTimestamp = LocalDateTime.now();
        private String publicVerificationUrl;

        public PassportHeader() {}

        public PassportHeader(String publicVerificationUrl) {
            this.publicVerificationUrl = publicVerificationUrl;
        }

        public String getStandardVersion() { return standardVersion; }
        public void setStandardVersion(String standardVersion) { this.standardVersion = standardVersion; }

        public String getRegistryPlatform() { return registryPlatform; }
        public void setRegistryPlatform(String registryPlatform) { this.registryPlatform = registryPlatform; }

        public String getVerificationStatus() { return verificationStatus; }
        public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

        public LocalDateTime getExportTimestamp() { return exportTimestamp; }
        public void setExportTimestamp(LocalDateTime exportTimestamp) { this.exportTimestamp = exportTimestamp; }

        public String getPublicVerificationUrl() { return publicVerificationUrl; }
        public void setPublicVerificationUrl(String publicVerificationUrl) { this.publicVerificationUrl = publicVerificationUrl; }
    }

    public static class ProductDetails {
        private Long id;
        private String productCode;
        private String name;
        private String brand;
        private String category;
        private String model;
        private String manufacturer;
        private String countryOfOrigin;
        private LocalDate mfgDate;
        private String status;

        public ProductDetails() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getProductCode() { return productCode; }
        public void setProductCode(String productCode) { this.productCode = productCode; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getBrand() { return brand; }
        public void setBrand(String brand) { this.brand = brand; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }

        public String getManufacturer() { return manufacturer; }
        public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }

        public String getCountryOfOrigin() { return countryOfOrigin; }
        public void setCountryOfOrigin(String countryOfOrigin) { this.countryOfOrigin = countryOfOrigin; }

        public LocalDate getMfgDate() { return mfgDate; }
        public void setMfgDate(LocalDate mfgDate) { this.mfgDate = mfgDate; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class CircularityDisclosures {
        private String description;
        private String materials;
        private String careInstructions;
        private String recyclingInstructions;

        public CircularityDisclosures() {}

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getMaterials() { return materials; }
        public void setMaterials(String materials) { this.materials = materials; }

        public String getCareInstructions() { return careInstructions; }
        public void setCareInstructions(String careInstructions) { this.careInstructions = careInstructions; }

        public String getRecyclingInstructions() { return recyclingInstructions; }
        public void setRecyclingInstructions(String recyclingInstructions) { this.recyclingInstructions = recyclingInstructions; }
    }

    public static class MaintenanceLog {
        private int totalServiceInterventions;
        private long activeServiceMonths;
        private String circularityHealthRating;
        private List<RepairHistoryDTO> serviceRecords;

        public MaintenanceLog() {}

        public int getTotalServiceInterventions() { return totalServiceInterventions; }
        public void setTotalServiceInterventions(int totalServiceInterventions) { this.totalServiceInterventions = totalServiceInterventions; }

        public long getActiveServiceMonths() { return activeServiceMonths; }
        public void setActiveServiceMonths(long activeServiceMonths) { this.activeServiceMonths = activeServiceMonths; }

        public String getCircularityHealthRating() { return circularityHealthRating; }
        public void setCircularityHealthRating(String circularityHealthRating) { this.circularityHealthRating = circularityHealthRating; }

        public List<RepairHistoryDTO> getServiceRecords() { return serviceRecords; }
        public void setServiceRecords(List<RepairHistoryDTO> serviceRecords) { this.serviceRecords = serviceRecords; }
    }
}
