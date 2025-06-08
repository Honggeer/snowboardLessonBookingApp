package com.geer.snowboard_lesson_booking.service.impl;

import com.geer.snowboard_lesson_booking.dto.UserLoginDTO;
import com.geer.snowboard_lesson_booking.entity.User;
import com.geer.snowboard_lesson_booking.exception.LoginFailedException;
import com.geer.snowboard_lesson_booking.mapper.UserMapper;
import com.geer.snowboard_lesson_booking.service.UserService;
import com.geer.snowboard_lesson_booking.vo.UserLoginVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;
    @Override
    public User getUserById(Long id) {
        return userMapper.findById(id);
    }

    @Override
    public UserLoginVO getUserByEmail(UserLoginDTO userLoginDTO) {
        String email = userLoginDTO.getEmail();
        String password = userLoginDTO.getPasswordHash();
        User user = userMapper.findByEmail(email);
        // TODO: this is a fake password
        if(user == null||!password.equals(user.getPasswordHash())) {
            throw new LoginFailedException("用户名或密码错误");
        }

        // TODO: this is a fake token
        String token = "a_fake_jwt_token_for_now";
        UserLoginVO userLoginVO = UserLoginVO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .token(token)
                .build();
        return userLoginVO;

    }
}
