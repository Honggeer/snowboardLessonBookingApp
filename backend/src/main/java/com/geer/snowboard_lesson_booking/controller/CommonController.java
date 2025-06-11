package com.geer.snowboard_lesson_booking.controller;

import com.geer.snowboard_lesson_booking.result.Result;
import com.geer.snowboard_lesson_booking.service.impl.StorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@Slf4j
@RequestMapping("/api/common")
public class CommonController {
    @Autowired
    private StorageService storageService;
    @PostMapping("/upload")
    public Result<String> upload(@RequestParam("file") MultipartFile file) {
        log.info("接收到文件上传请求: {}", file.getOriginalFilename());

        try {
            // 调用StorageService，它内部会再调用AwsS3Util将文件上传到S3
            String fileUrl = storageService.store(file);

            // 上传成功，将文件的公开访问URL返回给前端
            return Result.success(fileUrl);

        } catch (IOException e) {
            log.error("文件上传失败", e);
            // 如果上传过程中出现任何错误，返回一个统一的错误信息
            return Result.error("文件上传失败，请稍后再试。");
        }
    }
}
