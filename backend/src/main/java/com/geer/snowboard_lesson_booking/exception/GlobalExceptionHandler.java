package com.geer.snowboard_lesson_booking.exception;

import com.geer.snowboard_lesson_booking.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MultipartException;

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
    @ExceptionHandler(MultipartException.class)
    public Result<Object> handleMultipartException(MultipartException ex) {
        log.error("File is larger than 5mb: {}", ex.getMessage());
        return Result.error("文件大小超出限制，请上传小于5MB的图片。");
    }
    @ExceptionHandler(PermissionDeniedException.class)
    public Result<Object> handlePermissionDeniedException(PermissionDeniedException ex){
        log.error("Permission denied: {}", ex.getMessage());
        return Result.error(ex.getMessage());

    }
    @ExceptionHandler(OperationFailedException.class)
    public Result<Object> handleOperationFailedExceptionException(OperationFailedException ex){
        log.error("Permission denied: {}", ex.getMessage());
        return Result.error(ex.getMessage());

    }
}
