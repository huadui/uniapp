package com.example.dto;

import lombok.Data;
import java.util.Map;

@Data
public class ConstitutionResultDTO {
    // 主要体质
    private String mainConstitution;
    // 倾向体质
    private String tendencyConstitution;
    
    // 各体质得分
    private Map<String, Double> scores;
    
    // 结果描述/建议
    private String advice;
}
