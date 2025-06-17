package com.geer.snowboard_lesson_booking.mapper;

import com.geer.snowboard_lesson_booking.entity.Location;
import com.geer.snowboard_lesson_booking.entity.SkillType;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface LocationMapper {
    @Select("SELECT * FROM ski_resorts WHERE id = #{id}")
    Location findById(int id);
    @Select("SELECT * FROM ski_resorts")
    List<Location> findAll();

}
