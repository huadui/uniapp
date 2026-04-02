package com.example.controller;

import com.example.common.Result;
import com.example.entity.InquiryRecord;
import com.example.service.InquiryRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/inquiry")
public class InquiryController {

    @Autowired
    private InquiryRecordService inquiryRecordService;

    @PostMapping("/save")
    public Result<Long> saveRecord(@RequestBody InquiryRecord record) {
        if (record.getUserId() == null) {
            return Result.error("400", "User ID is required");
        }
        if (record.getId() == null) {
            record.setCreatedAt(LocalDateTime.now());
        }
        boolean saved = inquiryRecordService.saveOrUpdate(record);
        if (saved) {
            return Result.success(record.getId());
        } else {
            return Result.error("500", "Failed to save record");
        }
    }
}
