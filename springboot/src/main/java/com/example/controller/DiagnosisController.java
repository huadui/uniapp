package com.example.controller;

import com.example.common.Result;
import com.example.dto.TongueDiagnosisDTO;
import com.example.service.DiagnosisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import com.example.dto.TongueDiagnosisRequestDTO;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/diagnosis")
public class DiagnosisController {

    @Autowired
    private DiagnosisService diagnosisService;

    @PostMapping("/tongue")
    public Result<TongueDiagnosisDTO> analyzeTongue(@RequestBody TongueDiagnosisRequestDTO request) {
        if (request.getImageBase64() == null || request.getImageBase64().isEmpty()) {
            return Result.error("400", "请上传图片数据");
        }
        try {
            TongueDiagnosisDTO result = diagnosisService.analyzeTongue(request.getUserId(), request.getImageBase64());
            return Result.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("500", e.getMessage());
        }
    }
}
