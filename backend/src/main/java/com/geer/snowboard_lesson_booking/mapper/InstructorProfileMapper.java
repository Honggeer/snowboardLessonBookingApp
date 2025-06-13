package com.geer.snowboard_lesson_booking.mapper;

import com.geer.snowboard_lesson_booking.entity.InstructorProfile;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface InstructorProfileMapper {
    void insert(InstructorProfile instructorProfile);

    @Select("SELECT * FROM instructor_profiles WHERE user_id = #{userId}")
    InstructorProfile findByUserId(Long userId);

    void update(InstructorProfile instructorProfile);
}
