package com.geer.snowboard_lesson_booking.service.impl;

import com.geer.snowboard_lesson_booking.dto.InstructorRegisterDTO;
import com.geer.snowboard_lesson_booking.dto.StudentRegisterDTO;
import com.geer.snowboard_lesson_booking.dto.UserLoginDTO;
import com.geer.snowboard_lesson_booking.entity.*;
import com.geer.snowboard_lesson_booking.enums.AccountStatus;
import com.geer.snowboard_lesson_booking.enums.Role;
import com.geer.snowboard_lesson_booking.exception.LoginFailedException;
import com.geer.snowboard_lesson_booking.exception.RegistrationFailedException;
import com.geer.snowboard_lesson_booking.mapper.*;
import com.geer.snowboard_lesson_booking.service.UserService;
import com.geer.snowboard_lesson_booking.utils.JwtUtil;
import com.geer.snowboard_lesson_booking.vo.UserLoginVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private InstructorProfileMapper instructorProfileMapper;
    @Autowired
    private StudentProfileMapper studentProfileMapper;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private SkillTypeMapper skillTypeMapper;
    @Autowired
    private InstructorSkillMapper instructorSkillMapper;
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
            userMapper.updateStatus(user);
            if(emailService!=null){
                emailService.sendVerificationEmail(user.getEmail(),user.getVerificationToken());
            }
            throw new LoginFailedException("您的账户尚未验证，请检查您的邮箱");
        }
        if(user.getStatus() == AccountStatus.PENDING_APPROVAL){
            throw new LoginFailedException("您的信息正在审核中，请等待邮件通知");
        }
        Map<String,Object> claims = new HashMap<>();
        claims.put("userId",user.getId());
        String token = jwtUtil.generateToken(claims);
        UserLoginVO userLoginVO = UserLoginVO.builder()
                .id(user.getId())
                .userName(user.getUserName())
                .role(user.getRole())
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
    public User verifyUser(String token) {
        User user = userMapper.findByVerificationToken(token);
        if(user==null || user.getTokenExpiry().isBefore(LocalDateTime.now())){
            return null;
        }
        if (user.getRole() == Role.STUDENT)
            user.setStatus(AccountStatus.ACTIVE);
        if(user.getRole() == Role.INSTRUCTOR)
            user.setStatus(AccountStatus.PENDING_APPROVAL);
        user.setTokenExpiry(null);
        user.setVerificationToken(null);
        userMapper.updateStatus(user);
        return user;
    }
    @Transactional
    @Override
    public void registerInstructor(InstructorRegisterDTO instructorRegisterDTO) {
        if (userMapper.findByEmail(instructorRegisterDTO.getEmail()) != null) {
            throw new RegistrationFailedException("该邮箱已被注册");
        }

        // 1. 插入用户基础信息到 users 表
        User user = new User();
        BeanUtils.copyProperties(instructorRegisterDTO,user);
        user.setRole(Role.INSTRUCTOR);
        user.setStatus(AccountStatus.UNVERIFIED);
        user.setPasswordHash(passwordEncoder.encode(instructorRegisterDTO.getPassword()));
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setTokenExpiry(LocalDateTime.now().plusHours(24));//don't forget add token...
        userMapper.insert(user);
        Long newInstructorId = user.getId();

        // 2. 插入一个“部分为空”的教练档案到 instructor_profiles 表
        InstructorProfile instructorProfile = new InstructorProfile();
        instructorProfile.setUserId(newInstructorId);
        instructorProfile.setIdCardUrl(instructorRegisterDTO.getIdCardUrl());
        instructorProfile.setExperienceYears(0);// 只设置ID卡URL
        // 其他字段如bio, avatarUrl等都将为null，等待用户之后再编辑
        instructorProfileMapper.insert(instructorProfile);

        List<InstructorRegisterDTO.SkillSubmissionDTO> skillSubmissions = instructorRegisterDTO.getSkills();
        if (skillSubmissions == null || skillSubmissions.isEmpty()) {
            throw new RegistrationFailedException("至少需要提交一项技能认证");
        }

        List<InstructorSkill> skillsToInsert = new ArrayList<>();
        for (InstructorRegisterDTO.SkillSubmissionDTO submission : skillSubmissions) {
            SkillType skillType = skillTypeMapper.findByName(submission.getSkillName());
            if (skillType == null) {
                throw new RegistrationFailedException("提交了无效的技能类型: " + submission.getSkillName());
            }

            InstructorSkill newSkill = new InstructorSkill();
            newSkill.setInstructorId(newInstructorId);
            newSkill.setSkillTypeId(skillType.getId());
            newSkill.setCertificateUrl(submission.getCertificateUrl());
            newSkill.setSubmittedAt(LocalDateTime.now());
            skillsToInsert.add(newSkill);
        }

        // 4. 批量插入所有技能认证记录
        if (!skillsToInsert.isEmpty()) {
            instructorSkillMapper.insertBatch(skillsToInsert);
        }
        if(emailService!=null){
            emailService.sendVerificationEmail(user.getEmail(),user.getVerificationToken());
        }
    }

    @Override
    public List<SkillType> getSkills() {
        return skillTypeMapper.findAll();
    }

}
