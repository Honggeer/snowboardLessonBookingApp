package com.geer.snowboard_lesson_booking.vo;

import lombok.Data;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Data
public class InstructorCardVO {
    private Long userId;
    private String userName;
    private Double rating;
    // 来自 instructor_profiles 表
    private String avatarUrl;
    private Integer experienceYears;
    private String bio;
    //private Double rating; todo: rating system
    private String teachingContent;
    private List<InstructorSkillVO> skills;
    private List<InstructorLocationVO> locations;

}

