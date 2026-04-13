package com.example.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.entity.SysAdmin;
import com.example.common.Result;
import com.example.dto.LoginDTO; // or new AdminLoginDTO

public interface SysAdminService extends IService<SysAdmin> {
    Result login(SysAdmin loginDTO);
}
