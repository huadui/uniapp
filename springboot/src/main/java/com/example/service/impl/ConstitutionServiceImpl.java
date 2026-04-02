package com.example.service.impl;

import com.example.dto.ConstitutionResultDTO;
import com.example.service.ConstitutionService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ConstitutionServiceImpl implements ConstitutionService {

    @org.springframework.beans.factory.annotation.Autowired
    private com.example.service.ConstitutionRecordService constitutionRecordService;

    @Override
    public ConstitutionResultDTO calculate(Long userId, Map<Integer, Integer> answers) {
        // 1. 初始化各体质题目ID映射
        Map<String, List<Integer>> typeToQuestions = getTypeToQuestionsMap();
        
        // 2. 计算各体质原始分和转化分
        Map<String, Double> scores = new HashMap<>();
        
        for (Map.Entry<String, List<Integer>> entry : typeToQuestions.entrySet()) {
            String type = entry.getKey();
            List<Integer> qIds = entry.getValue();
            
            int rawScore = 0;
            for (Integer qId : qIds) {
                Integer score = answers.get(qId);
                if (score == null) score = 1; // 默认给1分，防止空指针，实际应该校验
                
                // 处理平和质的反向计分题目
                if ("平和质".equals(type)) {
                    // 平和质中，60, 65 是正向；61, 62, 63, 64, 66, 67 是反向
                    // 题目ID: 60, 61, 62, 63, 64, 65, 66, 67
                    // 正向: 60, 65
                    // 反向: 61, 62, 63, 64, 66, 67
                    if (qId != 60 && qId != 65) {
                        // 反向计分: 1->5, 2->4, 3->3, 4->2, 5->1
                        // 公式: 6 - score
                        score = 6 - score;
                    }
                }
                rawScore += score;
            }
            
            // 转化分 = [(原始分 - 条目数) / (条目数 * 4)] * 100
            int questionCount = qIds.size();
            double conversionScore = ((double)(rawScore - questionCount) / (questionCount * 4)) * 100;
            scores.put(type, conversionScore);
        }
        
        // 3. 判定体质
        ConstitutionResultDTO result = determineConstitution(scores);

        // 4. 保存记录到数据库
        if (userId != null) {
            try {
                com.example.entity.ConstitutionRecord record = new com.example.entity.ConstitutionRecord();
                record.setUserId(userId);
                record.setMainConstitution(result.getMainConstitution());
                record.setTendencyConstitution(result.getTendencyConstitution());
                record.setScoresJson(cn.hutool.json.JSONUtil.toJsonStr(result.getScores()));
                record.setAdvice(result.getAdvice());
                record.setCreatedAt(java.time.LocalDateTime.now());
                constitutionRecordService.save(record);
            } catch (Exception e) {
                e.printStackTrace();
                System.err.println("Failed to save constitution record: " + e.getMessage());
            }
        }

        return result;
    }
    
    private ConstitutionResultDTO determineConstitution(Map<String, Double> scores) {
        ConstitutionResultDTO result = new ConstitutionResultDTO();
        result.setScores(scores);
        
        double pingheScore = scores.getOrDefault("平和质", 0.0);
        
        List<String> mainList = new ArrayList<>();
        List<String> tendencyList = new ArrayList<>();
        
        // 判定偏颇体质
        for (Map.Entry<String, Double> entry : scores.entrySet()) {
            String type = entry.getKey();
            if ("平和质".equals(type)) continue;
            
            Double score = entry.getValue();
            if (score >= 40) {
                mainList.add(type);
            } else if (score >= 30) {
                tendencyList.add(type);
            }
        }
        
        if (pingheScore >= 60 && mainList.isEmpty() && tendencyList.isEmpty()) {
            // 平和质：转化分 >= 60，且其他体质转化分均 < 30
            result.setMainConstitution("平和质");
            result.setTendencyConstitution("");
        } else if (pingheScore >= 60 && mainList.isEmpty() && !tendencyList.isEmpty()) {
             // 基本是平和质：转化分 >= 60，且其他体质转化分均 < 40 (即 mainList 为空)
            result.setMainConstitution("基本平和质");
            result.setTendencyConstitution(String.join(",", tendencyList));
        } else {
            if (mainList.isEmpty()) {
                // 如果没有主判定体质，但也不满足平和质条件，通常取分数最高的作为倾向或主要
                // 这里简单处理：若没有 >=40 的，取最高的几个作为倾向
                result.setMainConstitution("未呈现明显偏颇");
            } else {
                result.setMainConstitution(String.join(",", mainList));
            }
            result.setTendencyConstitution(String.join(",", tendencyList));
        }
        
        // 生成建议
        result.setAdvice(generateAdvice(result.getMainConstitution(), result.getTendencyConstitution()));
        
        return result;
    }
    
    private String generateAdvice(String main, String tendency) {
        StringBuilder advice = new StringBuilder();
        if (main != null && !main.isEmpty()) {
            advice.append("您的主体质为：").append(main).append("。\n");
            // 这里可以根据不同体质追加详细建议，实际项目中可查库
            if (main.contains("气虚")) advice.append("建议：补气养气，规律作息，适度运动。\n");
            if (main.contains("阳虚")) advice.append("建议：温补阳气，少吃生冷，注意保暖。\n");
            if (main.contains("阴虚")) advice.append("建议：滋阴降火，多吃甘凉滋润食物，避免熬夜。\n");
            if (main.contains("痰湿")) advice.append("建议：健脾利湿，饮食清淡，控制体重。\n");
            if (main.contains("湿热")) advice.append("建议：清热利湿，少烟酒，忌辛辣。\n");
            if (main.contains("血瘀")) advice.append("建议：活血化瘀，适度运动，保持心情舒畅。\n");
            if (main.contains("气郁")) advice.append("建议：疏肝解郁，多参加社交活动，保持乐观。\n");
            if (main.contains("特禀")) advice.append("建议：益气固表，避免过敏原，增强免疫力。\n");
            if (main.contains("平和")) advice.append("建议：继续保持良好的生活习惯。\n");
        }
        return advice.toString();
    }

    private Map<String, List<Integer>> getTypeToQuestionsMap() {
        Map<String, List<Integer>> map = new HashMap<>();
        
        map.put("气虚质", List.of(1, 2, 3, 4, 5, 6, 7, 8));
        map.put("阳虚质", List.of(9, 10, 11, 12, 13, 14, 15));
        map.put("阴虚质", List.of(16, 17, 18, 19, 20, 21, 22, 23));
        map.put("痰湿质", List.of(24, 25, 26, 27, 28, 29, 30, 31));
        map.put("湿热质", List.of(32, 33, 34, 35, 36, 37, 38));
        map.put("血瘀质", List.of(39, 40, 41, 42, 43, 44, 45));
        map.put("气郁质", List.of(46, 47, 48, 49, 50, 51, 52));
        map.put("特禀质", List.of(53, 54, 55, 56, 57, 58, 59));
        map.put("平和质", List.of(60, 61, 62, 63, 64, 65, 66, 67));
        
        return map;
    }
}
