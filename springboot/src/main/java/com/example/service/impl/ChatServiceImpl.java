package com.example.service.impl;

import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.example.dto.ChatRequestDTO;
import com.example.entity.FaceDiagnosisRecord;
import com.example.entity.TongueDiagnosisRecord;
import com.example.service.ChatService;
import com.example.service.FaceDiagnosisRecordService;
import com.example.service.TongueDiagnosisRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatServiceImpl implements ChatService {

    @Value("${deepseek.api-key}")
    private String apiKey;

    @Value("${deepseek.base-url}")
    private String baseUrl;

    @Value("${deepseek.model}")
    private String model;

    @Autowired
    private TongueDiagnosisRecordService tongueService;

    @Autowired
    private FaceDiagnosisRecordService faceService;

    @Override
    public String chat(Long userId, String message, List<ChatRequestDTO.HistoryMessage> history) {
        // Build request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("temperature", 0.7);

        List<Map<String, String>> messages = new ArrayList<>();
        
        // Build fusion context
        StringBuilder fusionContext = new StringBuilder();
        if (userId != null) {
            try {
                // Fetch latest tongue diagnosis
                TongueDiagnosisRecord tongue = tongueService.lambdaQuery()
                        .eq(TongueDiagnosisRecord::getUserId, userId)
                        .orderByDesc(TongueDiagnosisRecord::getCreatedAt)
                        .last("limit 1")
                        .one();
                if (tongue != null && tongue.getDiagnosis() != null) {
                    fusionContext.append("【最近一次舌诊结果】：").append(tongue.getDiagnosis());
                    if (tongue.getAdvice() != null) {
                        fusionContext.append("。建议：").append(tongue.getAdvice());
                    }
                    fusionContext.append("\n");
                }

                // Fetch latest face diagnosis
                FaceDiagnosisRecord face = faceService.lambdaQuery()
                        .eq(FaceDiagnosisRecord::getUserId, userId)
                        .orderByDesc(FaceDiagnosisRecord::getCreatedAt)
                        .last("limit 1")
                        .one();
                if (face != null && face.getDiagnosis() != null) {
                    fusionContext.append("【最近一次面诊结果】：").append(face.getDiagnosis());
                    if (face.getAdvice() != null) {
                        fusionContext.append("。建议：").append(face.getAdvice());
                    }
                    fusionContext.append("\n");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // System prompt to set the persona
        Map<String, String> systemMsg = new HashMap<>();
        systemMsg.put("role", "system");
        
        String baseSystemPrompt = "你是一位经验丰富的中医专家。请与用户进行问诊交流。你的回答应包含简要的症状分析、体质倾向及食疗建议。请返回纯文本内容，不要使用Markdown格式。请注意：回答务必简短精炼，直奔主题，每次回复请控制在100-150字左右，绝对不要长篇大论。如果用户提供的信息太少，请简短追问。";
        if (fusionContext.length() > 0) {
            baseSystemPrompt += "\n以下是用户近期的其他模态诊断信息，请在回复时综合参考（如果与当前症状有关）：\n" + fusionContext.toString();
        }
        
        systemMsg.put("content", baseSystemPrompt);
        messages.add(systemMsg);

        // Add history if present
        if (history != null && !history.isEmpty()) {
            for (ChatRequestDTO.HistoryMessage histMsg : history) {
                Map<String, String> msg = new HashMap<>();
                msg.put("role", histMsg.getRole());
                msg.put("content", histMsg.getContent());
                messages.add(msg);
            }
        }

        // User message
        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", message);
        messages.add(userMsg);

        requestBody.put("messages", messages);

        // Send request
        try {
            String jsonBody = JSONUtil.toJsonStr(requestBody);
            System.out.println("DeepSeek Request: " + jsonBody);
            System.out.println("DeepSeek URL: " + baseUrl);

            HttpResponse response = HttpRequest.post(baseUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .body(jsonBody)
                    .timeout(60000) // 60s timeout
                    .execute();

            String responseBody = response.body();
            System.out.println("DeepSeek Status: " + response.getStatus());
            System.out.println("DeepSeek Response: " + responseBody);

            if (response.isOk()) {
                JSONObject json = JSONUtil.parseObj(responseBody);
                JSONArray choices = json.getJSONArray("choices");
                if (choices != null && !choices.isEmpty()) {
                    JSONObject choice = choices.getJSONObject(0);
                    return choice.getJSONObject("message").getStr("content");
                }
            }
            return "API调用失败 (Status: " + response.getStatus() + "): " + responseBody;
        } catch (Exception e) {
            e.printStackTrace();
            return "系统错误: " + e.getMessage();
        }
    }
}
