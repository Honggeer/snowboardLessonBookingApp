package com.geer.snowboard_lesson_booking.controller;

import com.geer.snowboard_lesson_booking.dto.UserLoginDTO;
import com.geer.snowboard_lesson_booking.entity.User;
import com.geer.snowboard_lesson_booking.result.Result;
import com.geer.snowboard_lesson_booking.service.UserService;
import com.geer.snowboard_lesson_booking.vo.UserLoginVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
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
}
