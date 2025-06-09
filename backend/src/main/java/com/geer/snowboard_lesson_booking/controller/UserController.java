package com.geer.snowboard_lesson_booking.controller;

import com.geer.snowboard_lesson_booking.dto.StudentRegisterDTO;
import com.geer.snowboard_lesson_booking.dto.UserLoginDTO;
import com.geer.snowboard_lesson_booking.entity.User;
import com.geer.snowboard_lesson_booking.result.Result;
import com.geer.snowboard_lesson_booking.service.UserService;
import com.geer.snowboard_lesson_booking.vo.UserLoginVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    UserService userService ;
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id){
        User user = userService.getUserById(id);
        return user;
    }

    @PostMapping("/login")
    public Result<UserLoginVO> login(@RequestBody UserLoginDTO userLoginDTO){
        UserLoginVO userLoginVo = userService.getUserByEmail(userLoginDTO);
        return Result.success(userLoginVo);
    }
    @GetMapping("/verify")
    public String verifyAccount(@RequestParam("token") String token){
        log.info("Email verify: {}",token);
        boolean isVerified = userService.verifyUser(token);
        if(isVerified){
            // TODO: 2025-06-08 return a info page
            return "<h1>账户验证成功!</h1><p>恭喜您，您的账户已成功激活，现在可以登录了。</p>";
        }
        else
            return "<h1>链接无效或已过期</h1><p>验证链接无效或已过期，请尝试重新注册或联系客服。</p>";
    }
    @PostMapping("/register/student")
    public Result<String> registerStudent(@RequestBody StudentRegisterDTO studentRegisterDTO){
        log.info("New Student registration: {}", studentRegisterDTO.getEmail());
        userService.registerStudent(studentRegisterDTO);
        return Result.success("注册成功，请检查您的邮箱以完成验证。");
    }

}
