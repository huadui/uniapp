package com.example.dto;

import lombok.Data;
import java.util.Map;

@Data
public class ConstitutionTestRequestDTO {
    private Long userId;
    // Key: Question ID, Value: Score (1-5)
    private Map<Integer, Integer> answers;
}
