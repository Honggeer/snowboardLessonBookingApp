package com.geer.snowboard_lesson_booking.exception;

import com.geer.snowboard_lesson_booking.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(LoginFailedException.class)
    public Result<Object> handleLoginFailedException(LoginFailedException ex){
          log.error("Login Failed:{}",ex.getMessage());
          return Result.error(ex.getMessage());
    }
    @ExceptionHandler(RegistrationFailedException.class)
    public Result<Object> handleRegistrationFailedException(RegistrationFailedException ex){
        log.error("Registration failed: {}",ex.getMessage());
        return Result.error(ex.getMessage());
    }
}
