package com.example.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("face_diagnosis_records")
public class FaceDiagnosisRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String imageUrl;
    private String diagnosis; // 综合诊断
    private String advice;    // 建议
    private String fullResultJson; // 完整结果JSON
    private LocalDateTime createdAt;
}
