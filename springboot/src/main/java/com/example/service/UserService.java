package com.example.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.dto.LoginDTO;
import com.example.entity.User;
import com.example.common.Result;

public interface UserService extends IService<User> {
    Result login(LoginDTO loginDTO);
}
