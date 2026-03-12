package com.example.dto;

import lombok.Data;

@Data
public class LoginDTO {
    private String code;
    private String nickname;
    private String avatarUrl;
    private Integer gender;
}
