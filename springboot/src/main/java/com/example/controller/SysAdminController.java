package com.example.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.common.Result;
import com.example.entity.SysAdmin;
import com.example.service.SysAdminService;
import cn.hutool.crypto.SecureUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/admin/sysAdmin")
public class SysAdminController {

    @Autowired
    private SysAdminService sysAdminService;

    // Helper method to check Super Admin permission
    private boolean isSuperAdmin(String role) {
        if (role == null || role.isEmpty()) {
            return false;
        }
        try {
            role = URLDecoder.decode(role, StandardCharsets.UTF_8.name());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "超级管理员".equals(role);
    }

    // Login
    @PostMapping("/login")
    public Result login(@RequestBody SysAdmin sysAdmin) {
        return sysAdminService.login(sysAdmin);
    }

    // Add Admin
    @PostMapping
    public Result add(@RequestHeader(value = "Admin-Role", required = false) String adminRole, @RequestBody SysAdmin sysAdmin) {
        if (!isSuperAdmin(adminRole)) {
            return Result.error("403", "只有超级管理员才可以新增账号");
        }

        if (sysAdmin.getUsername() == null || sysAdmin.getPassword() == null) {
            return Result.error("400", "账号和密码不能为空");
        }
        
        SysAdmin exist = sysAdminService.getOne(new QueryWrapper<SysAdmin>().eq("username", sysAdmin.getUsername()));
        if (exist != null) {
            return Result.error("400", "账号已存在");
        }

        // Encrypt password
        sysAdmin.setPassword(SecureUtil.md5(sysAdmin.getPassword()));
        
        if (sysAdmin.getRole() == null) {
            sysAdmin.setRole("普通管理员");
        }
        if (sysAdmin.getStatus() == null) {
            sysAdmin.setStatus(1);
        }
        
        sysAdminService.save(sysAdmin);
        return Result.success("新增成功");
    }

    // Update Admin
    @PutMapping("/update")
    public Result update(@RequestHeader(value = "Admin-Role", required = false) String adminRole, @RequestBody SysAdmin sysAdmin) {
        if (!isSuperAdmin(adminRole)) {
            return Result.error("403", "只有超级管理员才可以编辑账号");
        }

        if (sysAdmin.getId() == null) {
            return Result.error("400", "ID不能为空");
        }
        
        // If password is provided, re-encrypt it
        if (sysAdmin.getPassword() != null && !sysAdmin.getPassword().isEmpty()) {
            sysAdmin.setPassword(SecureUtil.md5(sysAdmin.getPassword()));
        } else {
            // Don't update password if empty
            sysAdmin.setPassword(null); 
        }

        sysAdminService.updateById(sysAdmin);
        return Result.success("修改成功");
    }

    // Delete Admin
    @DeleteMapping("/{id}")
    public Result delete(@RequestHeader(value = "Admin-Role", required = false) String adminRole, @PathVariable Long id) {
        if (!isSuperAdmin(adminRole)) {
            return Result.error("403", "只有超级管理员才可以删除账号");
        }
        sysAdminService.removeById(id);
        return Result.success("删除成功");
    }

    // Pagination query
    @GetMapping("/page")
    public Result page(@RequestHeader(value = "Admin-Role", required = false) String adminRole,
                       @RequestParam(defaultValue = "1") Integer pageNum,
                       @RequestParam(defaultValue = "10") Integer pageSize,
                       @RequestParam(required = false) String username) {
        if (!isSuperAdmin(adminRole)) {
            return Result.error("403", "无权限查看管理员列表");
        }

        Page<SysAdmin> pageInfo = new Page<>(pageNum, pageSize);
        QueryWrapper<SysAdmin> queryWrapper = new QueryWrapper<>();
        
        if (username != null && !username.isEmpty()) {
            queryWrapper.like("username", username);
        }
        
        queryWrapper.orderByDesc("created_at");
        Page<SysAdmin> result = sysAdminService.page(pageInfo, queryWrapper);
        
        // Hide passwords
        result.getRecords().forEach(admin -> admin.setPassword(null));
        
        return Result.success(result);
    }
}
