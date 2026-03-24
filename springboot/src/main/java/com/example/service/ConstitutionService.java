package com.example.service;

import com.example.dto.ConstitutionResultDTO;
import java.util.Map;

public interface ConstitutionService {
    ConstitutionResultDTO calculate(Long userId, Map<Integer, Integer> answers);
}
