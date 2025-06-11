package com.geer.snowboard_lesson_booking.service.impl;

import com.geer.snowboard_lesson_booking.utils.AwsS3Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class StorageService {
    @Autowired
    private AwsS3Util awsS3Util; // 注入AwsS3Util

    /**
     * 【修改】保存文件到AWS S3并返回URL
     * @param file
     * @return 文件的公开访问URL
     * @throws IOException
     */
    public String store(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("无法存储空文件。");
        }
        // 直接调用工具类完成上传
        return awsS3Util.upload(file);
    }
}
