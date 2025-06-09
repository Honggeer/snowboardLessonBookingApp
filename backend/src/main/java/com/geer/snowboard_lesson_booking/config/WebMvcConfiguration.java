package com.geer.snowboard_lesson_booking.config;

import com.geer.snowboard_lesson_booking.interceptor.JwtTokenInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {
    @Autowired
    private JwtTokenInterceptor jwtTokenInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtTokenInterceptor)
                //interceptor rules
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/users/login")
                .excludePathPatterns("/api/users/register/**")
                .excludePathPatterns("/api/users/verify");
    }
}
