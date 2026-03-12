package com.example.controller;

import com.example.common.Result;
import com.example.dto.LoginDTO;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class LoginController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Result login(@RequestBody LoginDTO loginDTO) {
        if (loginDTO.getCode() == null || loginDTO.getCode().isEmpty()) {
            return Result.error("400", "Code cannot be empty");
        }
        return userService.login(loginDTO);
    }
}
