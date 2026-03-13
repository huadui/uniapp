package com.example.service;

import com.example.dto.FaceDiagnosisDTO;
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

    /**
     * 分析面相（Base64）
     * @param userId 用户ID
     * @param imageBase64 面相图片Base64
     * @return 诊断结果
     */
    FaceDiagnosisDTO analyzeFace(Long userId, String imageBase64);
}
