package com.geer.snowboard_lesson_booking.service.impl;

import com.geer.snowboard_lesson_booking.dto.StudentRegisterDTO;
import com.geer.snowboard_lesson_booking.dto.UserLoginDTO;
import com.geer.snowboard_lesson_booking.entity.StudentProfile;
import com.geer.snowboard_lesson_booking.entity.User;
import com.geer.snowboard_lesson_booking.enums.AccountStatus;
import com.geer.snowboard_lesson_booking.enums.Role;
import com.geer.snowboard_lesson_booking.exception.LoginFailedException;
import com.geer.snowboard_lesson_booking.exception.RegistrationFailedException;
import com.geer.snowboard_lesson_booking.mapper.StudentProfileMapper;
import com.geer.snowboard_lesson_booking.mapper.UserMapper;
import com.geer.snowboard_lesson_booking.service.UserService;
import com.geer.snowboard_lesson_booking.vo.UserLoginVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private StudentProfileMapper studentProfileMapper;
    @Autowired
    private EmailService emailService;
    @Override
    public User getUserById(Long id) {
        return userMapper.findById(id);
    }

    @Override
    public UserLoginVO getUserByEmail(UserLoginDTO userLoginDTO) {
        String email = userLoginDTO.getEmail();
        String password = userLoginDTO.getPassword();
        User user = userMapper.findByEmail(email);
        // TODO: this is a fake password
        if(user == null||!password.equals(user.getPasswordHash())) {
            throw new LoginFailedException("用户名或密码错误");
        }
        if (user.getStatus() != AccountStatus.ACTIVE) {
            // TODO: 2025-06-08 send a link to user
            throw new LoginFailedException("您的账户尚未验证，请检查您的邮箱");
        }
        // TODO: this is a fake token
        String token = "a_fake_jwt_token_for_now";
        UserLoginVO userLoginVO = UserLoginVO.builder()
                .id(user.getId())
                .userName(user.getUserName())
                .token(token)
                .build();
        return userLoginVO;

    }

    @Transactional
    @Override
    public void registerStudent(StudentRegisterDTO studentRegisterDTO) {
        if(userMapper.findByEmail(studentRegisterDTO.getEmail())!=null){
            throw new RegistrationFailedException("用户名已被注册");
        }
        if(!studentRegisterDTO.getPassword().equals(studentRegisterDTO.getConfirmPassword())){
            throw new RegistrationFailedException("请保证两次输入的密码一致");
        }
        User user = new User();
        BeanUtils.copyProperties(studentRegisterDTO,user);
        user.setRole(Role.STUDENT);
        user.setStatus(AccountStatus.UNVERIFIED);
        // TODO: 2025-06-08 passcode encoding here
        //user.setPasswordHash(passwordEncoder.encode(studentRegisterDTO.getPassword()));
        user.setPasswordHash(studentRegisterDTO.getPassword());//this does not do encode

        user.setVerificationToken(UUID.randomUUID().toString());
        user.setTokenExpiry(LocalDateTime.now().plusHours(24));
        userMapper.insert(user);
        //Mybatis generate id for user
        StudentProfile studentProfile = new StudentProfile();
        BeanUtils.copyProperties(studentRegisterDTO,studentProfile);
        studentProfile.setUserId(user.getId());
        studentProfileMapper.insert(studentProfile);
        if(emailService!=null){
            emailService.sendVerificationEmail(user.getEmail(),user.getVerificationToken());
        }
    }

    @Transactional
    @Override
    public boolean verifyUser(String token) {
        User user = userMapper.findByVerificationToken(token);
        if(user==null || user.getTokenExpiry().isBefore(LocalDateTime.now())){
            return false;
        }
        user.setStatus(AccountStatus.ACTIVE);
        user.setTokenExpiry(null);
        user.setVerificationToken(null);
        userMapper.updateStatus(user);
        return true;
    }
}
