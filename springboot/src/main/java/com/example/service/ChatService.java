package com.example.service;

import com.example.dto.ChatRequestDTO;
import java.util.List;

public interface ChatService {
    String chat(Long userId, String message, List<ChatRequestDTO.HistoryMessage> history);
}
