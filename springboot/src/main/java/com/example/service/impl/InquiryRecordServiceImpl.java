package com.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.entity.InquiryRecord;
import com.example.mapper.InquiryRecordMapper;
import com.example.service.InquiryRecordService;
import org.springframework.stereotype.Service;

@Service
public class InquiryRecordServiceImpl extends ServiceImpl<InquiryRecordMapper, InquiryRecord> implements InquiryRecordService {
}
