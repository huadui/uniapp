package com.example.dto;

import lombok.Data;
import java.util.Map;

@Data
public class FaceDiagnosisDTO {
    private String imageUrl;      // 图片访问地址
    private String faceColor;     // 面色
    private String gloss;         // 光泽
    private String spirit;        // 神态
    private String diagnosis;     // 综合诊断
    private String diagnosisDesc; // 诊断描述
    
    private String advice;        // 养生建议
    private Boolean valid = true; // 图片是否有效
    private String message;       // 错误提示信息
}
