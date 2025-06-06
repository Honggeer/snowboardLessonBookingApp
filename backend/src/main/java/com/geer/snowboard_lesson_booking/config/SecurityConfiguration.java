package com.geer.snowboard_lesson_booking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 禁用CSRF保护，对于无状态的REST API是常见做法
                .csrf(csrf -> csrf.disable())
                // 定义URL的授权规则
                .authorizeHttpRequests(auth -> auth
                        // 允许任何人访问所有以 /api/ 开头的URL
                        .requestMatchers("/api/**").permitAll()
                        // 其他任何请求都需要身份验证
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}