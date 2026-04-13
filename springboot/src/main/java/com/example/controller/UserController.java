package com.example.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.example.common.Result;
import com.example.dto.PhoneRequestDTO;
import com.example.entity.User;
import com.example.service.FileStorageService;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/admin/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private FileStorageService fileStorageService;

    // 分页查询用户列表
    @GetMapping("/page")
    public Result<Page<User>> page(@RequestParam(defaultValue = "1") Integer pageNum,
                                   @RequestParam(defaultValue = "10") Integer pageSize,
                                   @RequestParam(required = false) String nickname) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        if (nickname != null && !nickname.isEmpty()) {
            wrapper.like(User::getNickname, nickname);
        }
        wrapper.orderByDesc(User::getCreatedAt);
        Page<User> page = userService.page(new Page<>(pageNum, pageSize), wrapper);
        return Result.success(page);
    }

    // 禁用/启用用户
    @PutMapping("/status/{id}")
    public Result<String> updateStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Integer status = body.get("status");
        if (status == null) {
            return Result.error("400", "Status is required");
        }
        
        User user = userService.getById(id);
        if (user == null) {
            return Result.error("404", "User not found");
        }
        
        user.setStatus(status);
        boolean success = userService.updateById(user);
        if (success) {
            return Result.success("Status updated successfully");
        } else {
            return Result.error("500", "Failed to update status");
        }
    }
    
    // 删除用户 (可选, 一般仅做软删除即禁用)
    @DeleteMapping("/{id}")
    public Result<String> deleteUser(@PathVariable Long id) {
        boolean success = userService.removeById(id);
        if (success) {
            return Result.success("User deleted successfully");
        } else {
            return Result.error("500", "Failed to delete user");
        }
    }

    @GetMapping("/{id}")
    public Result<User> getUserById(@PathVariable Long id) {
        User user = userService.getById(id);
        if (user != null) {
            return Result.success(user);
        }
        return Result.error("404", "User not found");
    }

    @PostMapping("/avatar")
    public Result<String> uploadAvatar(@RequestParam Long userId,
                                       @RequestParam("file") MultipartFile file) {
        if (userId == null || file == null || file.isEmpty()) {
            return Result.error("400", "Parameter missing");
        }
        User user = userService.getById(userId);
        if (user == null) {
            return Result.error("404", "User not found");
        }
        String url = fileStorageService.upload(file, "avatar");
        user.setAvatarUrl(url);
        user.setUpdatedAt(LocalDateTime.now());
        userService.updateById(user);
        return Result.success(url);
    }

    @PutMapping("/update")
    public Result<String> updateUser(@RequestBody User updateInfo) {
        if (updateInfo.getId() == null) {
            return Result.error("400", "User ID is required");
        }
        User user = userService.getById(updateInfo.getId());
        if (user == null) {
            return Result.error("404", "User not found");
        }
        
        if (updateInfo.getNickname() != null) {
            user.setNickname(updateInfo.getNickname());
        }
        if (updateInfo.getAvatarUrl() != null) {
            user.setAvatarUrl(updateInfo.getAvatarUrl());
        }
        if (updateInfo.getGender() != null) {
            user.setGender(updateInfo.getGender());
        }
        if (updateInfo.getPhoneNumber() != null) {
            user.setPhoneNumber(updateInfo.getPhoneNumber());
        }
        if (updateInfo.getStatus() != null) {
            user.setStatus(updateInfo.getStatus());
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        userService.updateById(user);
        return Result.success("Update successful");
    }

    @PostMapping
    public Result<String> addUser(@RequestBody User userInfo) {
        if (userInfo.getOpenid() == null || userInfo.getOpenid().isEmpty()) {
            userInfo.setOpenid("admin_" + System.currentTimeMillis());
        }
        userInfo.setCreatedAt(LocalDateTime.now());
        userInfo.setUpdatedAt(LocalDateTime.now());
        userService.save(userInfo);
        return Result.success("Add successful");
    }

    @PostMapping("/phone")
    public Result<String> bindPhone(@RequestBody PhoneRequestDTO request) {
        if (request == null || request.getUserId() == null || request.getEncryptedData() == null || request.getIv() == null) {
            return Result.error("400", "Missing parameters");
        }

        User user = userService.getById(request.getUserId());
        if (user == null) {
            return Result.error("404", "User not found");
        }

        String sessionKey = user.getSessionKey();
        if (sessionKey == null || sessionKey.trim().isEmpty()) {
            return Result.error("403", "Session key expired, please re-login");
        }

        try {
            String decrypted = decryptWeChatData(request.getEncryptedData(), request.getIv(), sessionKey);
            JSONObject data = JSONUtil.parseObj(decrypted);
            String phone = data.getStr("phoneNumber");
            if (phone == null || phone.isEmpty()) {
                return Result.error("500", "Failed to parse phone number");
            }
            user.setPhoneNumber(phone);
            user.setUpdatedAt(LocalDateTime.now());
            userService.updateById(user);
            return Result.success(phone);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("500", "Failed to decrypt phone number");
        }
    }

    private String decryptWeChatData(String encryptedData, String iv, String sessionKey) throws Exception {
        byte[] dataBytes = Base64.getDecoder().decode(encryptedData);
        byte[] keyBytes = Base64.getDecoder().decode(sessionKey);
        byte[] ivBytes = Base64.getDecoder().decode(iv);

        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
        IvParameterSpec ivSpec = new IvParameterSpec(ivBytes);
        cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
        byte[] resultBytes = cipher.doFinal(dataBytes);
        return new String(resultBytes, java.nio.charset.StandardCharsets.UTF_8).trim();
    }
}
