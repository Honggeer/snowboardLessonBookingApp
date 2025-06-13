package com.geer.snowboard_lesson_booking.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InstructorSkillVO {
    private String displayName; // 例如 "CASI 2级"
    private String certificateUrl;
    private String status;
    private LocalDateTime submittedAt; //
    private LocalDateTime approvedAt;  //
}
