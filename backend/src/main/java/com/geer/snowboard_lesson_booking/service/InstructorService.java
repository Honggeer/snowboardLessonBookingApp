package com.geer.snowboard_lesson_booking.service;

import com.geer.snowboard_lesson_booking.dto.InstructorProfileUpdateDTO;
import com.geer.snowboard_lesson_booking.dto.InstructorQueryDTO;
import com.geer.snowboard_lesson_booking.dto.LocationUpdateDTO;
import com.geer.snowboard_lesson_booking.dto.SkillAddDTO;
import com.geer.snowboard_lesson_booking.entity.InstructorProfile;
import com.geer.snowboard_lesson_booking.result.PageResult;
import com.geer.snowboard_lesson_booking.vo.InstructorCardVO;
import com.geer.snowboard_lesson_booking.vo.InstructorProfileVO;
import com.geer.snowboard_lesson_booking.vo.InstructorSkillVO;

import java.util.List;

public interface InstructorService {
    public InstructorProfileVO getMyProfile();
    public void updateMyProfile(InstructorProfileUpdateDTO profileUpdateDTO);
    void addSkill(SkillAddDTO skillAddDTO);

    List<InstructorSkillVO> getMySkills();
    List<String> getMyLocations();
    void updateMyLocations(LocationUpdateDTO locationUpdateDTO);
    void deleteMySkillById(Long id);
    PageResult<InstructorCardVO> getInstructorList(InstructorQueryDTO instructorQueryDTO);
}
