package com.geer.snowboard_lesson_booking.service.impl;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    @Value("${custom.mail.sender}")
    private String sender;
    @Value("${custom.host-link}")
    private String hostLink;
    public void sendVerificationEmail(String to, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(sender); //
            message.setTo(to);
            message.setSubject("欢迎注册Geer滑雪约课App - 请验证您的邮箱");

            String verificationUrl = hostLink+"/api/users/verify?token=" + token;

            message.setText("感谢您的注册！请点击以下链接来完成邮箱验证：\n" + verificationUrl);

            mailSender.send(message);
            log.info("验证邮件已发送至: {}", to);
        } catch (Exception e) {
            log.error("发送验证邮件失败: {}", to, e);
            // TODO: 2025-06-08 resend
        }
    }

}
