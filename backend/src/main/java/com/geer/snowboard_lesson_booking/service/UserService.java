package com.geer.snowboard_lesson_booking.service;

import com.geer.snowboard_lesson_booking.dto.InstructorRegisterDTO;
import com.geer.snowboard_lesson_booking.dto.StudentRegisterDTO;
import com.geer.snowboard_lesson_booking.dto.UserLoginDTO;
import com.geer.snowboard_lesson_booking.entity.SkillType;
import com.geer.snowboard_lesson_booking.entity.User;
import com.geer.snowboard_lesson_booking.result.Result;
import com.geer.snowboard_lesson_booking.vo.UserLoginVO;

import java.util.List;

public interface UserService {
    User getUserById(Long id);
    UserLoginVO getUserByEmail(UserLoginDTO userLoginDTO);
    void registerStudent(StudentRegisterDTO studentRegisterDTO);
    User verifyUser(String token);

    void registerInstructor(InstructorRegisterDTO instructorRegisterDTO);
    List<SkillType> getSkills();
}
