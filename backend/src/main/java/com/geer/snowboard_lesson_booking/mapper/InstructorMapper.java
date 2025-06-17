package com.geer.snowboard_lesson_booking.mapper;

import com.geer.snowboard_lesson_booking.dto.InstructorQueryDTO;
import com.geer.snowboard_lesson_booking.vo.InstructorCardVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface InstructorMapper {
    List<InstructorCardVO> findInstructorsByCriteria(InstructorQueryDTO queryDTO);
}
