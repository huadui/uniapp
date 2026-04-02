package com.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.entity.TongueDiagnosisRecord;
import com.example.mapper.TongueDiagnosisRecordMapper;
import com.example.service.TongueDiagnosisRecordService;
import org.springframework.stereotype.Service;

@Service
public class TongueDiagnosisRecordServiceImpl extends ServiceImpl<TongueDiagnosisRecordMapper, TongueDiagnosisRecord> implements TongueDiagnosisRecordService {
}
