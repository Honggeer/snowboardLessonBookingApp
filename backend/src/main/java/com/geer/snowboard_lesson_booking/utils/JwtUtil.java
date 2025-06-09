package com.geer.snowboard_lesson_booking.utils;

import com.geer.snowboard_lesson_booking.properties.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {
    @Autowired
    private JwtProperties jwtProperties;
    /**
     * 生成JWT令牌
     */
    private SecretKey getSigningKey() {
        try {
            String secretString = jwtProperties.getSecretKey();
            // 使用SHA-256对密钥字符串进行哈希，确保结果总是256位（32字节）
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(secretString.getBytes(StandardCharsets.UTF_8));
            // 使用哈希后的字节数组作为密钥，这保证了密钥的强度
            return Keys.hmacShaKeyFor(hash);
        } catch (NoSuchAlgorithmException e) {
            // "SHA-256"是Java标准库的一部分，这个异常理论上永远不会发生
            throw new RuntimeException("无法找到SHA-256算法", e);
        }
    }

    /**
     * 生成JWT令牌
     */
    public String generateToken(Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .signWith(getSigningKey())
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getTtl()))
                .compact();
    }

    /**
     * 解析JWT令牌
     */
    public Claims parseToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            // 如果解析失败（如过期、伪造等），返回null
            return null;
        }
    }
}
