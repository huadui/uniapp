package com.example.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.common.Result;
import com.example.entity.SysAdmin;
import com.example.mapper.SysAdminMapper;
import com.example.service.SysAdminService;
import cn.hutool.crypto.SecureUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SysAdminServiceImpl extends ServiceImpl<SysAdminMapper, SysAdmin> implements SysAdminService {

    @Override
    public Result login(SysAdmin sysAdmin) {
        if (sysAdmin.getUsername() == null || sysAdmin.getPassword() == null) {
            return Result.error("400", "账号或密码不能为空");
        }

        SysAdmin dbAdmin = this.getOne(new QueryWrapper<SysAdmin>().eq("username", sysAdmin.getUsername()));
        if (dbAdmin == null) {
            return Result.error("401", "账号或密码错误");
        }

        // Validate password
        // The password should be encrypted, we'll use MD5 for simplicity in this project
        // Or we can use hutool's BCrypt if needed. Let's use simple MD5 here.
        String md5Password = SecureUtil.md5(sysAdmin.getPassword());
        if (!dbAdmin.getPassword().equals(md5Password)) {
            return Result.error("401", "账号或密码错误");
        }

        if (dbAdmin.getStatus() != null && dbAdmin.getStatus() == 0) {
            return Result.error("403", "该账号已被禁用");
        }

        // Update last login time
        dbAdmin.setLastLoginTime(LocalDateTime.now());
        this.updateById(dbAdmin);

        // Hide password in response
        dbAdmin.setPassword(null);

        // Return user info, in real app return a Token (JWT)
        return Result.success(dbAdmin);
    }
}
