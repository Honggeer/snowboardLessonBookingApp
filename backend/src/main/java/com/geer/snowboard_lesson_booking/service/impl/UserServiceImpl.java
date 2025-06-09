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
import com.geer.snowboard_lesson_booking.utils.JwtUtil;
import com.geer.snowboard_lesson_booking.vo.UserLoginVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private StudentProfileMapper studentProfileMapper;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Override
    public User getUserById(Long id) {
        return userMapper.findById(id);
    }

    @Override
    public UserLoginVO getUserByEmail(UserLoginDTO userLoginDTO) {
        String email = userLoginDTO.getEmail();
        String password = userLoginDTO.getPassword();
        User user = userMapper.findByEmail(email);
        if(user == null||!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new LoginFailedException("用户名或密码错误");
        }
        if(user.getStatus() == AccountStatus.SUSPENDED){
            throw new LoginFailedException("用户已被停用");
        }
        if (user.getStatus() == AccountStatus.UNVERIFIED) {
            user.setVerificationToken(UUID.randomUUID().toString());//if the user is unverified, send a verification email
            user.setTokenExpiry(LocalDateTime.now().plusHours(24));
            if(emailService!=null){
                emailService.sendVerificationEmail(user.getEmail(),user.getVerificationToken());
            }
            throw new LoginFailedException("您的账户尚未验证，请检查您的邮箱");
        }
        // TODO: this is a fake token
        Map<String,Object> claims = new HashMap<>();
        claims.put("UserId",user.getId());
        String token = jwtUtil.generateToken(claims);
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
        //encoded password
        String encodedPassword = passwordEncoder.encode(studentRegisterDTO.getPassword());
        user.setPasswordHash(encodedPassword);//this does not do encode

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
