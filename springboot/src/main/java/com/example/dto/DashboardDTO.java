package com.example.dto;

import lombok.Data;
import java.util.List;

@Data
public class DashboardDTO {
    private long totalUsers;
    private long todayNewUsers;
    private long totalTongue;
    private long totalFace;
    private long totalConstitution;
    private long totalInquiry;
    
    private List<PieData> constitutionPie;
    private List<String> trendDates;
    private List<Long> trendTongue;
    private List<Long> trendFace;

    @Data
    public static class PieData {
        private String name;
        private long value;
        
        public PieData(String name, long value) {
            this.name = name;
            this.value = value;
        }
    }
}
