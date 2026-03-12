package com.example.service.impl;

import cn.hutool.core.codec.Base64;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.example.dto.TongueDiagnosisDTO;
import com.example.service.DiagnosisService;
import com.example.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DiagnosisServiceImpl implements DiagnosisService {

    @Autowired
    private FileStorageService fileStorageService;

    @Value("${deepseek.api-key}")
    private String apiKey;

    @Value("${deepseek.base-url}")
    private String baseUrl;

    @Value("${deepseek.vl-model}")
    private String vlModel;

    @Override
    public TongueDiagnosisDTO analyzeTongue(Long userId, String imageBase64) {
        // 1. 处理Base64字符串
        if (imageBase64.contains(",")) {
            imageBase64 = imageBase64.split(",")[1];
        }
        byte[] imageBytes = Base64.decode(imageBase64);

        // 2. 上传图片到OSS (路径: tongue/userId/)
        String directory = "tongue/" + (userId != null ? userId : "visitor");
        String imageUrl = fileStorageService.upload(imageBytes, "tongue.jpg", directory);

        // 3. 构建AI请求
        // 提示词：要求返回JSON格式，增加非舌象检测
        String prompt = "你是一位中医专家。请先判断这张图片是否为清晰的**人类舌象图片**。\n" +
                "1. 如果**不是**舌象（或者是模糊不清、无法识别、非人类舌头），请仅返回以下JSON：\n" +
                "{\"valid\": false, \"message\": \"未能识别到清晰的舌象，请重新拍摄并上传。\"}\n" +
                "2. 如果**是**舌象，请分析并返回以下JSON：\n" +
                "{\n" +
                "  \"valid\": true,\n" +
                "  \"tongueBody\": \"描述舌质（如颜色、形状、齿痕等）\",\n" +
                "  \"tongueCoating\": \"描述舌苔（如颜色、厚薄、润燥等）\",\n" +
                "  \"diagnosis\": \"辨证结果（如脾虚湿盛）\",\n" +
                "  \"advice\": \"具体的食疗和生活调理建议\"\n" +
                "}";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", vlModel);
        
        List<Map<String, Object>> messages = new ArrayList<>();
        Map<String, Object> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        
        List<Map<String, Object>> contentList = new ArrayList<>();
        
        // 图片内容 (OSS URL)
        Map<String, Object> imageContent = new HashMap<>();
        imageContent.put("type", "image_url");
        Map<String, String> imageUrlMap = new HashMap<>();
        imageUrlMap.put("url", imageUrl);
        imageContent.put("image_url", imageUrlMap);
        contentList.add(imageContent);
        
        // 文本内容
        Map<String, Object> textContent = new HashMap<>();
        textContent.put("type", "text");
        textContent.put("text", prompt);
        contentList.add(textContent);

        userMessage.put("content", contentList);
        messages.add(userMessage);
        
        requestBody.put("messages", messages);

        // 4. 调用API
        try {
            HttpResponse response = HttpRequest.post(baseUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .body(JSONUtil.toJsonStr(requestBody))
                    .timeout(60000)
                    .execute();

            String responseBody = response.body();

            if (response.isOk()) {
                JSONObject json = JSONUtil.parseObj(responseBody);
                JSONArray choices = json.getJSONArray("choices");
                if (choices != null && !choices.isEmpty()) {
                    String content = choices.getJSONObject(0).getJSONObject("message").getStr("content");
                    
                    // 清理可能的Markdown代码块标记
                    content = content.replaceAll("```json", "").replaceAll("```", "").trim();
                    
                    try {
                        JSONObject resultJson = JSONUtil.parseObj(content);
                        TongueDiagnosisDTO dto = new TongueDiagnosisDTO();
                        dto.setImageUrl(imageUrl);
                        
                        // 检查是否有效
                        if (resultJson.containsKey("valid") && !resultJson.getBool("valid")) {
                            dto.setValid(false);
                            dto.setMessage(resultJson.getStr("message", "未能识别到舌象，请重新上传"));
                            return dto;
                        }

                        dto.setValid(true);
                        dto.setTongueBody(resultJson.getStr("tongueBody"));
                        dto.setTongueCoating(resultJson.getStr("tongueCoating"));
                        dto.setDiagnosis(resultJson.getStr("diagnosis"));
                        dto.setAdvice(resultJson.getStr("advice"));
                        
                        System.out.println("Final DTO: " + dto);
                        return dto;
                    } catch (Exception e) {
                        TongueDiagnosisDTO errorDto = new TongueDiagnosisDTO();
                        errorDto.setImageUrl(imageUrl);
                        errorDto.setDiagnosis("解析失败");
                        errorDto.setAdvice(content);
                        return errorDto;
                    }
                }
            }
            throw new RuntimeException("AI分析失败: " + response.getStatus() + " " + responseBody);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("系统繁忙，请稍后重试: " + e.getMessage());
        }
    }
}
