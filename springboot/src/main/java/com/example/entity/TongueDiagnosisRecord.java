package com.example.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("tongue_diagnosis_records")
public class TongueDiagnosisRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String imageUrl;
    private String diagnosis; // 辨证结果
    private String advice;    // 建议
    private String fullResultJson; // 完整结果JSON
    private LocalDateTime createdAt;
}
