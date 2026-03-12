package com.example.service.impl;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.example.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

@Service
public class AliOssServiceImpl implements FileStorageService {

    @Value("${aliyun.oss.endpoint}")
    private String endpoint;

    @Value("${aliyun.oss.access-key-id}")
    private String accessKeyId;

    @Value("${aliyun.oss.access-key-secret}")
    private String accessKeySecret;

    @Value("${aliyun.oss.bucket-name}")
    private String bucketName;

    @Override
    public String upload(MultipartFile file, String directory) {
        try {
            return upload(file.getBytes(), file.getOriginalFilename(), directory);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("OSS上传失败: " + e.getMessage());
        }
    }

    @Override
    public String upload(byte[] bytes, String originalFilename, String directory) {
        try {
            // 1. 生成文件名
            String suffix = FileUtil.getSuffix(originalFilename);
            if (suffix == null || suffix.isEmpty()) {
                suffix = "jpg"; // 默认jpg
            }
            String fileName = directory + "/" + IdUtil.simpleUUID() + "." + suffix;

            // 2. 创建OSSClient实例
            OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);

            try {
                // 3. 上传文件流
                InputStream inputStream = new ByteArrayInputStream(bytes);
                ossClient.putObject(bucketName, fileName, inputStream);
            } finally {
                // 4. 关闭OSSClient
                if (ossClient != null) {
                    ossClient.shutdown();
                }
            }

            // 5. 返回访问URL
            String protocol = "https://";
            String domainEndpoint = endpoint;
            if (endpoint.startsWith("http://")) {
                protocol = "http://";
                domainEndpoint = endpoint.substring(7);
            } else if (endpoint.startsWith("https://")) {
                protocol = "https://";
                domainEndpoint = endpoint.substring(8);
            }
            
            return protocol + bucketName + "." + domainEndpoint + "/" + fileName;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("OSS上传失败: " + e.getMessage());
        }
    }
}
