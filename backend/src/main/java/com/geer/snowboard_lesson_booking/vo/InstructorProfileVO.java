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
    private Double rating;
    // 来自 instructor_profiles 表
    private String avatarUrl;
    private Integer experienceYears;
    private String bio;
    private String teachingContent;
    private List<InstructorSkillVO> skills;

    private List<InstructorLocationVO> locations;
}
