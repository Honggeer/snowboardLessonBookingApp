package com.geer.snowboard_lesson_booking.dto;

import lombok.Data;

import java.util.List;

@Data
public class InstructorProfileUpdateDTO {
    private String userName;
    private String phoneNumber;
    private String avatarUrl;
    private Integer experienceYears;
    private String bio;
    private String teachingContent;
}

