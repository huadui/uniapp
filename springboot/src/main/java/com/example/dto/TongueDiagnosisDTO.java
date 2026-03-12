package com.example.dto;

import lombok.Data;

@Data
public class TongueDiagnosisDTO {
    private String imageUrl;      // 图片访问地址
    private String tongueBody;    // 舌质
    private String tongueCoating; // 舌苔
    private String diagnosis;     // 辨证结果
    private String advice;        // 调理建议
    private Boolean valid = true; // 图片是否有效（是否为舌象）
    private String message;       // 错误提示信息
}
