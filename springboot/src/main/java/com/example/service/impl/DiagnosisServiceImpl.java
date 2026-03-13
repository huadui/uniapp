package com.example.service.impl;

import cn.hutool.core.codec.Base64;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.example.dto.FaceDiagnosisDTO;
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

        return callAiService(imageUrl, prompt, TongueDiagnosisDTO.class);
    }

    @Override
    public FaceDiagnosisDTO analyzeFace(Long userId, String imageBase64) {
        // 1. 处理Base64字符串
        if (imageBase64.contains(",")) {
            imageBase64 = imageBase64.split(",")[1];
        }
        byte[] imageBytes = Base64.decode(imageBase64);

        // 2. 上传图片到OSS (路径: face/userId/)
        String directory = "face/" + (userId != null ? userId : "visitor");
        String imageUrl = fileStorageService.upload(imageBytes, "face.jpg", directory);

        // 3. 构建AI请求
        String prompt = "你是一位中医专家。请先判断这张图片是否为清晰的**人类面部图片**（素颜为佳）。\n" +
                "1. 如果**不是**清晰的人类面部图片，请仅返回以下JSON：\n" +
                "{\"valid\": false, \"message\": \"未能识别到清晰的面部，请保持光线均匀，正对镜头重新拍摄。\"}\n" +
                "2. 如果**是**清晰的人类面部图片，请分析并返回以下JSON：\n" +
                "{\n" +
                "  \"valid\": true,\n" +
                "  \"faceColor\": \"描述面色（如红润、萎黄、苍白、发青、发黑等）\",\n" +
                "  \"gloss\": \"描述光泽（如荣润、少华、无华、油腻等）\",\n" +
                "  \"spirit\": \"描述神态（如精神饱满、神疲乏力、烦躁不安等）\",\n" +
                "  \"diagnosis\": \"综合诊断结果（如脾胃气虚、肝火旺盛等）\",\n" +
                "  \"diagnosisDesc\": \"详细的诊断描述\",\n" +
                "  \"advice\": \"具体的养生建议（饮食、作息、情志等）\"\n" +
                "}\n";

        return callAiService(imageUrl, prompt, FaceDiagnosisDTO.class);
    }

    private <T> T callAiService(String imageUrl, String prompt, Class<T> responseType) {
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
                        T dto = resultJson.toBean(responseType);
                        
                        // 由于 toBean 可能不会自动设置 imageUrl，我们需要手动设置
                        if (dto instanceof TongueDiagnosisDTO) {
                            ((TongueDiagnosisDTO) dto).setImageUrl(imageUrl);
                            // 确保 valid 字段正确
                            if (!resultJson.getBool("valid", true)) {
                                ((TongueDiagnosisDTO) dto).setValid(false);
                                ((TongueDiagnosisDTO) dto).setMessage(resultJson.getStr("message"));
                            }
                        } else if (dto instanceof FaceDiagnosisDTO) {
                            ((FaceDiagnosisDTO) dto).setImageUrl(imageUrl);
                            if (!resultJson.getBool("valid", true)) {
                                ((FaceDiagnosisDTO) dto).setValid(false);
                                ((FaceDiagnosisDTO) dto).setMessage(resultJson.getStr("message"));
                            }
                        }
                        
                        return dto;
                    } catch (Exception e) {
                        try {
                            T errorDto = responseType.newInstance();
                            if (errorDto instanceof TongueDiagnosisDTO) {
                                ((TongueDiagnosisDTO) errorDto).setImageUrl(imageUrl);
                                ((TongueDiagnosisDTO) errorDto).setDiagnosis("解析失败");
                                ((TongueDiagnosisDTO) errorDto).setAdvice(content);
                            } else if (errorDto instanceof FaceDiagnosisDTO) {
                                ((FaceDiagnosisDTO) errorDto).setImageUrl(imageUrl);
                                ((FaceDiagnosisDTO) errorDto).setDiagnosis("解析失败");
                                ((FaceDiagnosisDTO) errorDto).setAdvice(content);
                            }
                            return errorDto;
                        } catch (Exception ex) {
                            throw new RuntimeException("Error creating error DTO", ex);
                        }
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