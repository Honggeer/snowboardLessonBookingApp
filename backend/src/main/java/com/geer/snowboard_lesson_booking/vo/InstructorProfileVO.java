package com.geer.snowboard_lesson_booking.vo;

import com.geer.snowboard_lesson_booking.entity.SkillType;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class InstructorProfileVO implements Serializable {
    // 来自 users 表
    private Long id;
    private String email;
    private String phoneNumber;
    private String userName;

    // 来自 instructor_profiles 表
    private String avatarUrl;
    private Integer experienceYears;
    private String bio;
    private String teachingContent;

    // 来自 instructor_skills 和 skill_types 表 (未来组合查询)
    private List<InstructorSkillVO> skills;

    // 来自 instructor_locations 和 ski_resorts 表 (未来组合查询)
    private List<String> locations;
}
