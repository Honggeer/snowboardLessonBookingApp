package com.geer.snowboard_lesson_booking.interceptor;

import com.geer.snowboard_lesson_booking.utils.BaseContext;
import com.geer.snowboard_lesson_booking.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@Slf4j
public class JwtTokenInterceptor implements HandlerInterceptor {
    @Autowired
    private JwtUtil jwtUtil;
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1. 从请求头中获取令牌
        String token = request.getHeader("Authorization");

        // 2. 校验令牌
        if (token == null || !token.startsWith("Bearer ")) {
            log.warn("Request does not have a token.");
            response.setStatus(401); // 设置HTTP状态码为“未授权”
            return false;
        }

        token = token.substring(7); // 去掉 "Bearer " 前缀

        try {
            Claims claims = jwtUtil.parseToken(token);
            if (claims == null) {
                throw new Exception("Token parsing failed");
            }
            // 3. 解析成功，获取用户ID
            Long userId = claims.get("userId", Long.class);
            log.info("Current user id: {}", userId);

            BaseContext.setCurrentId(userId);

            return true;
        } catch (Exception ex) {
            log.error("Token verification failed: {}", ex.getMessage());
            response.setStatus(401);
            return false;
        }
    }
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        BaseContext.removeCurrentId();
    }

}
