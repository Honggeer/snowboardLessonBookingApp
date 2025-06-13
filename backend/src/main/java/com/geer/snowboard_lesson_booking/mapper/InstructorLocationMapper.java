package com.geer.snowboard_lesson_booking.mapper;

import com.geer.snowboard_lesson_booking.entity.InstructorLocation;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
@Mapper
public interface InstructorLocationMapper {
    void deleteByInstructorId(Long instructorId);//every time delete before insertion


    void insertBatch(List<InstructorLocation> locations);
    List<String> findLocationNamesByInstructorId(Long instructorId);
}
