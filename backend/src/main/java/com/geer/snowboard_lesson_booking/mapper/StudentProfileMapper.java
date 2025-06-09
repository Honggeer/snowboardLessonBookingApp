package com.geer.snowboard_lesson_booking.mapper;

import com.geer.snowboard_lesson_booking.dto.StudentRegisterDTO;
import com.geer.snowboard_lesson_booking.entity.StudentProfile;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StudentProfileMapper {
    void insert(StudentProfile studentProfile);
}
