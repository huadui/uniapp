package com.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.entity.ConstitutionRecord;
import com.example.mapper.ConstitutionRecordMapper;
import com.example.service.ConstitutionRecordService;
import org.springframework.stereotype.Service;

@Service
public class ConstitutionRecordServiceImpl extends ServiceImpl<ConstitutionRecordMapper, ConstitutionRecord> implements ConstitutionRecordService {
}
