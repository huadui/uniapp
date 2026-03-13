package com.example.dto;

import lombok.Data;

@Data
public class FaceDiagnosisRequestDTO {
    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 图片Base64字符串
     */
    private String imageBase64;
}
