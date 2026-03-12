package com.example.service.impl;

import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.common.Result;
import com.example.dto.LoginDTO;
import com.example.entity.User;
import com.example.mapper.UserMapper;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Value("${wechat.appid}")
    private String appid;

    @Value("${wechat.secret}")
    private String secret;

    @Override
    public Result login(LoginDTO loginDTO) {
        // 1. Get openid from WeChat API
        String url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appid +
                "&secret=" + secret + "&js_code=" + loginDTO.getCode() + "&grant_type=authorization_code";
        
        String response = HttpUtil.get(url);
        JSONObject jsonObject = JSONUtil.parseObj(response);
        String openid = jsonObject.getStr("openid");
        
        if (openid == null) {
            return Result.error("500", "Failed to get openid: " + jsonObject.getStr("errmsg"));
        }

        // 2. Check if user exists
        User user = this.getOne(new QueryWrapper<User>().eq("openid", openid));
        
        if (user == null) {
            // 3. Register new user
            user = new User();
            user.setOpenid(openid);
            user.setNickname(loginDTO.getNickname());
            user.setAvatarUrl(loginDTO.getAvatarUrl());
            user.setGender(loginDTO.getGender());
            user.setStatus(1); // Default normal status
            user.setLastLoginTime(LocalDateTime.now());
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            this.save(user);
        } else {
            // Update user info
            user.setNickname(loginDTO.getNickname());
            user.setAvatarUrl(loginDTO.getAvatarUrl());
            user.setGender(loginDTO.getGender());
            user.setLastLoginTime(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            this.updateById(user);
        }

        // 4. Return user info
        return Result.success(user);
    }
}
