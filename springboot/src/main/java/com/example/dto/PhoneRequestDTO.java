package com.example.dto;

import lombok.Data;

@Data
public class PhoneRequestDTO {
    private Long userId;
    private String encryptedData;
    private String iv;
}
