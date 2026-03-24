package com.example.controller;

import com.example.common.Result;
import com.example.dto.ConstitutionResultDTO;
import com.example.dto.ConstitutionTestRequestDTO;
import com.example.service.ConstitutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/constitution")
public class ConstitutionController {

    @Autowired
    private ConstitutionService constitutionService;

    @PostMapping("/test")
    public Result<ConstitutionResultDTO> submitTest(@RequestBody ConstitutionTestRequestDTO request) {
        if (request.getAnswers() == null || request.getAnswers().isEmpty()) {
            return Result.error("400", "请填写问卷");
        }
        try {
            ConstitutionResultDTO result = constitutionService.calculate(request.getUserId(), request.getAnswers());
            return Result.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("500", e.getMessage());
        }
    }
}
