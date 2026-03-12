package com.example.dto;

import lombok.Data;

@Data
public class TongueDiagnosisRequestDTO {
    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 图片Base64字符串 (不包含 data:image/jpg;base64, 前缀，或者包含均可，后端处理)
     */
    private String imageBase64;
}
