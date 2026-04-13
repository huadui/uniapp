package com.example.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.common.Result;
import com.example.dto.DashboardDTO;
import com.example.entity.*;
import com.example.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/dashboard")
public class DashboardController {

    @Autowired
    private UserService userService;
    @Autowired
    private TongueDiagnosisRecordService tongueService;
    @Autowired
    private FaceDiagnosisRecordService faceService;
    @Autowired
    private ConstitutionRecordService constitutionService;
    @Autowired
    private InquiryRecordService inquiryService;

    @GetMapping("/stats")
    public Result<DashboardDTO> getStats() {
        DashboardDTO dto = new DashboardDTO();
        
        // 1. 基础数量统计
        dto.setTotalUsers(userService.count());
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        dto.setTodayNewUsers(userService.count(new QueryWrapper<User>().ge("created_at", todayStart)));
        
        dto.setTotalTongue(tongueService.count());
        dto.setTotalFace(faceService.count());
        dto.setTotalConstitution(constitutionService.count());
        dto.setTotalInquiry(inquiryService.count());

        // 2. 体质分布饼图数据
        List<ConstitutionRecord> allConst = constitutionService.list();
        Map<String, Long> constCount = allConst.stream()
                .filter(r -> r.getMainConstitution() != null && !r.getMainConstitution().trim().isEmpty())
                .collect(Collectors.groupingBy(ConstitutionRecord::getMainConstitution, Collectors.counting()));
        
        List<DashboardDTO.PieData> pieDataList = new ArrayList<>();
        constCount.forEach((k, v) -> pieDataList.add(new DashboardDTO.PieData(k, v)));
        if (pieDataList.isEmpty()) {
            // 如果没有数据，填充一点示例数据避免图表难看
            pieDataList.add(new DashboardDTO.PieData("平和质", 0));
        }
        dto.setConstitutionPie(pieDataList);

        // 3. 近7日折线图趋势
        List<String> dates = new ArrayList<>();
        List<Long> tongueTrend = new ArrayList<>();
        List<Long> faceTrend = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd");

        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.plusDays(1).atStartOfDay();
            
            dates.add(date.format(formatter));
            tongueTrend.add(tongueService.count(new QueryWrapper<TongueDiagnosisRecord>()
                    .ge("created_at", start).lt("created_at", end)));
            faceTrend.add(faceService.count(new QueryWrapper<FaceDiagnosisRecord>()
                    .ge("created_at", start).lt("created_at", end)));
        }
        dto.setTrendDates(dates);
        dto.setTrendTongue(tongueTrend);
        dto.setTrendFace(faceTrend);

        return Result.success(dto);
    }
}
