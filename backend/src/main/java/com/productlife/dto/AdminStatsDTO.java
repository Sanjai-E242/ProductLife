package com.productlife.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * DTO for the administrator overview dashboard statistics.
 */
public class AdminStatsDTO {

    private long totalProducts;
    private long activeProducts;
    private long draftProducts;
    private long discontinuedProducts;
    private long totalCategories;
    private long totalRepairs;
    private Map<String, Long> categoryBreakdown = new HashMap<>();
    private Map<String, Long> statusBreakdown = new HashMap<>();
    private List<ProductSummaryDTO> recentProducts = new ArrayList<>();

    public AdminStatsDTO() {
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getActiveProducts() {
        return activeProducts;
    }

    public void setActiveProducts(long activeProducts) {
        this.activeProducts = activeProducts;
    }

    public long getDraftProducts() {
        return draftProducts;
    }

    public void setDraftProducts(long draftProducts) {
        this.draftProducts = draftProducts;
    }

    public long getDiscontinuedProducts() {
        return discontinuedProducts;
    }

    public void setDiscontinuedProducts(long discontinuedProducts) {
        this.discontinuedProducts = discontinuedProducts;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public long getTotalRepairs() {
        return totalRepairs;
    }

    public void setTotalRepairs(long totalRepairs) {
        this.totalRepairs = totalRepairs;
    }

    public Map<String, Long> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, Long> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public Map<String, Long> getStatusBreakdown() {
        return statusBreakdown;
    }

    public void setStatusBreakdown(Map<String, Long> statusBreakdown) {
        this.statusBreakdown = statusBreakdown;
    }

    public List<ProductSummaryDTO> getRecentProducts() {
        return recentProducts;
    }

    public void setRecentProducts(List<ProductSummaryDTO> recentProducts) {
        this.recentProducts = recentProducts;
    }
}
