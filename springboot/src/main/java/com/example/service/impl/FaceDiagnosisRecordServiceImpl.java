package com.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.entity.FaceDiagnosisRecord;
import com.example.mapper.FaceDiagnosisRecordMapper;
import com.example.service.FaceDiagnosisRecordService;
import org.springframework.stereotype.Service;

@Service
public class FaceDiagnosisRecordServiceImpl extends ServiceImpl<FaceDiagnosisRecordMapper, FaceDiagnosisRecord> implements FaceDiagnosisRecordService {
}
