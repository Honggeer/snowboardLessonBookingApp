package com.geer.snowboard_lesson_booking.mapper;

import com.geer.snowboard_lesson_booking.entity.InstructorProfile;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface InstructorProfileMapper {
    void insert(InstructorProfile instructorProfile);
}
