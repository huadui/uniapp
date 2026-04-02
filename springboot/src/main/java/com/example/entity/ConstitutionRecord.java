package com.example.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("constitution_records")
public class ConstitutionRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String mainConstitution;     // 主体质
    private String tendencyConstitution; // 倾向体质
    private String scoresJson;           // 各体质得分JSON
    private String advice;               // 建议
    private LocalDateTime createdAt;
}
