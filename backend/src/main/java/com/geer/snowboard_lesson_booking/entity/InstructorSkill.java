package com.geer.snowboard_lesson_booking.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstructorSkill implements Serializable {
    private Long id;
    private Long instructorId;
    private Integer skillTypeId;
    private String certificateUrl;
    private String status; // 'PENDING', 'APPROVED', 'REJECTED'
    private LocalDateTime submittedAt;
    private LocalDateTime approvedAt;
}
