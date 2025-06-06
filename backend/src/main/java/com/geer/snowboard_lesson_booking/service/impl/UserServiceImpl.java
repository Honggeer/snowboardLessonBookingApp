package com.geer.snowboard_lesson_booking.service.impl;

import com.geer.snowboard_lesson_booking.entity.User;
import com.geer.snowboard_lesson_booking.mapper.UserMapper;
import com.geer.snowboard_lesson_booking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper user;
    @Override
    public User getUserById(Long id) {
        return user.findById(id);
    }
}
