package com.example.dto;

import lombok.Data;

import java.util.List;

@Data
public class ChatRequestDTO {
    private String message;
    private List<HistoryMessage> history;

    @Data
    public static class HistoryMessage {
        private String role; // "user" or "assistant"
        private String content;
    }
}
