package com.geer.snowboard_lesson_booking.service;

import com.geer.snowboard_lesson_booking.dto.*;
import com.geer.snowboard_lesson_booking.result.PageResult;
import com.geer.snowboard_lesson_booking.vo.DailyAvailabilityVO;
import com.geer.snowboard_lesson_booking.vo.InstructorCardVO;
import com.geer.snowboard_lesson_booking.vo.InstructorProfileVO;
import com.geer.snowboard_lesson_booking.vo.InstructorSkillVO;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    InstructorProfileVO getInstructorDetailById(Long id);
    public DailyAvailabilityVO getDailyAvailability(Long instructorId, LocalDate date);
    public void createAvailabilities(AvailabilitiesCreateDTO dto);
    public void deleteAvailability(Long availabilityId);

    void deleteAvailabilityByDate(LocalDate date);
    void deleteAllMyAvailabilities();
    void createLesson(LessonCreateDTO lessonCreateDTO);

}
