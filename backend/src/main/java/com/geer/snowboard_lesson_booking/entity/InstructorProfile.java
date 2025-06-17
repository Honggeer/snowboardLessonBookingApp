package com.geer.snowboard_lesson_booking.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstructorProfile implements Serializable {
    private Long userId;
    private String avatarUrl;
    private String idCardUrl;
    private Integer experienceYears;
    private String bio;
    private String teachingContent;
    private Double rating;
}
