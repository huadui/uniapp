package com.example.service.impl;

import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.example.dto.ChatRequestDTO;
import com.example.service.ChatService;
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

    @Override
    public String chat(String message, List<ChatRequestDTO.HistoryMessage> history) {
        // Build request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("temperature", 0.7);

        List<Map<String, String>> messages = new ArrayList<>();
        
        // System prompt to set the persona
        Map<String, String> systemMsg = new HashMap<>();
        systemMsg.put("role", "system");
        systemMsg.put("content", "你是一位经验丰富的中医专家，精通《黄帝内经》、《伤寒杂病论》等经典。请通过望闻问切的逻辑，与用户进行问诊交流。你的回答应该包含：1. 对症状的分析（辨证）；2. 可能会涉及的体质；3. 给出具体的食疗建议和生活调养建议。回答风格应专业、温和，适当使用中医术语但要通俗易懂。请返回纯文本内容，不要使用Markdown格式。如果用户只说了一两个症状，可以追问更多细节。");
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
