package com.example.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    /**
     * 上传文件
     * @param file 文件对象
     * @param directory 存储目录（如 "tongue", "avatar"）
     * @return 文件的访问URL
     */
    String upload(MultipartFile file, String directory);
    /**
     * 上传文件（字节数组）
     * @param bytes 文件内容
     * @param fileName 文件名
     * @param directory 存储目录
     * @return 文件的访问URL
     */
    String upload(byte[] bytes, String fileName, String directory);
}
