package com.geer.snowboard_lesson_booking.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "snowboard.jwt")
@Data
public class JwtProperties {
    /**
     * JWT 签名密钥
     */
    private String secretKey;
    /**
     * JWT 有效期（单位：毫秒）
     */
    private long ttl;
}
