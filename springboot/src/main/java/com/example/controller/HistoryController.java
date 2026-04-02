package com.example.controller;

import com.example.common.Result;
import com.example.dto.HistoryDTO;
import com.example.entity.ConstitutionRecord;
import com.example.entity.FaceDiagnosisRecord;
import com.example.entity.InquiryRecord;
import com.example.entity.TongueDiagnosisRecord;
import com.example.service.ConstitutionRecordService;
import com.example.service.FaceDiagnosisRecordService;
import com.example.service.InquiryRecordService;
import com.example.service.TongueDiagnosisRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/history")
public class HistoryController {

    @Autowired
    private TongueDiagnosisRecordService tongueService;

    @Autowired
    private FaceDiagnosisRecordService faceService;

    @Autowired
    private ConstitutionRecordService constitutionService;

    @Autowired
    private InquiryRecordService inquiryService;

    @GetMapping("/list")
    public Result<List<HistoryDTO>> getHistory(@RequestParam Long userId) {
        List<HistoryDTO> list = new ArrayList<>();

        // 1. Tongue Records
        List<TongueDiagnosisRecord> tongueRecords = tongueService.lambdaQuery()
                .eq(TongueDiagnosisRecord::getUserId, userId)
                .orderByDesc(TongueDiagnosisRecord::getCreatedAt)
                .list();
        for (TongueDiagnosisRecord r : tongueRecords) {
            HistoryDTO dto = new HistoryDTO();
            dto.setId(r.getId());
            dto.setType("tongue");
            dto.setTitle("智能舌诊");
            dto.setSummary(r.getDiagnosis());
            dto.setImageUrl(r.getImageUrl());
            dto.setCreateTime(r.getCreatedAt());
            dto.setFullData(r);
            list.add(dto);
        }

        // 2. Face Records
        List<FaceDiagnosisRecord> faceRecords = faceService.lambdaQuery()
                .eq(FaceDiagnosisRecord::getUserId, userId)
                .orderByDesc(FaceDiagnosisRecord::getCreatedAt)
                .list();
        for (FaceDiagnosisRecord r : faceRecords) {
            HistoryDTO dto = new HistoryDTO();
            dto.setId(r.getId());
            dto.setType("face");
            dto.setTitle("智能面诊");
            dto.setSummary(r.getDiagnosis());
            dto.setImageUrl(r.getImageUrl());
            dto.setCreateTime(r.getCreatedAt());
            dto.setFullData(r);
            list.add(dto);
        }

        // 3. Constitution Records
        List<ConstitutionRecord> constitutionRecords = constitutionService.lambdaQuery()
                .eq(ConstitutionRecord::getUserId, userId)
                .orderByDesc(ConstitutionRecord::getCreatedAt)
                .list();
        for (ConstitutionRecord r : constitutionRecords) {
            HistoryDTO dto = new HistoryDTO();
            dto.setId(r.getId());
            dto.setType("constitution");
            dto.setTitle("体质辨识");
            dto.setSummary(r.getMainConstitution());
            dto.setTags(r.getTendencyConstitution());
            dto.setCreateTime(r.getCreatedAt());
            dto.setFullData(r);
            list.add(dto);
        }

        // 4. Inquiry Records
        List<InquiryRecord> inquiryRecords = inquiryService.lambdaQuery()
                .eq(InquiryRecord::getUserId, userId)
                .orderByDesc(InquiryRecord::getCreatedAt)
                .list();
        for (InquiryRecord r : inquiryRecords) {
            HistoryDTO dto = new HistoryDTO();
            dto.setId(r.getId());
            dto.setType("inquiry");
            dto.setTitle("智能问诊");
            dto.setSummary(r.getDiagnosis() != null ? r.getDiagnosis() : r.getMainSymptom());
            dto.setCreateTime(r.getCreatedAt());
            dto.setFullData(r);
            list.add(dto);
        }

        // Sort by createTime desc
        list.sort((a, b) -> b.getCreateTime().compareTo(a.getCreateTime()));

        return Result.success(list);
    }
}
