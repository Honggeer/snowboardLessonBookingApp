package com.geer.snowboard_lesson_booking.mapper;

import com.geer.snowboard_lesson_booking.entity.SkillType;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface SkillTypeMapper {
    @Select("SELECT * FROM skill_types WHERE skill_name = #{skillName}")
    SkillType findByName(String skillName);

    /**
     * 获取所有可用的技能类型
     * @return List<SkillType>
     */
    @Select("SELECT * FROM skill_types")
    List<SkillType> findAll();
}
