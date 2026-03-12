package com.example.service;

import com.example.dto.TongueDiagnosisDTO;
import org.springframework.web.multipart.MultipartFile;

public interface DiagnosisService {
    /**
     * 分析舌象（Base64）
     * @param userId 用户ID
     * @param imageBase64 舌象图片Base64
     * @return 诊断结果
     */
    TongueDiagnosisDTO analyzeTongue(Long userId, String imageBase64);
}
