package com.geer.snowboard_lesson_booking.mapper;

import com.geer.snowboard_lesson_booking.entity.InstructorSkill;
import com.geer.snowboard_lesson_booking.entity.SkillType;
import com.geer.snowboard_lesson_booking.vo.InstructorSkillVO;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface InstructorSkillMapper {
    /**
     * 批量插入教练的技能认证申请
     * @param skills 技能列表
     */
    void insertBatch(List<InstructorSkill> skills);
    void insert(InstructorSkill skill);
    List<InstructorSkillVO> findSkillsByInstructorId(Long instructorId);
    void deleteById(Long id);
}
