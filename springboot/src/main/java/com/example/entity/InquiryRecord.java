package com.example.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("inquiry_records")
public class InquiryRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String mainSymptom;    // 主诉
    private String diagnosis;      // 诊断/辨证
    private String advice;         // 建议
    private String chatLogJson;    // 对话记录JSON
    private LocalDateTime createdAt;
}
