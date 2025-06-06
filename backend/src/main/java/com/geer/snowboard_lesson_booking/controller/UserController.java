package com.geer.snowboard_lesson_booking.controller;

import com.geer.snowboard_lesson_booking.entity.User;
import com.geer.snowboard_lesson_booking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
