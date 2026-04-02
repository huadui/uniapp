package com.example.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class HistoryDTO {
    private Long id;
    private String type; // "tongue", "face", "constitution", "inquiry"
    private String title;
    private String summary; // diagnosis result
    private String imageUrl; // for tongue/face
    private String tags; // e.g. constitution type
    private LocalDateTime createTime;
    private Object fullData; // Complete record data for detail view
}
