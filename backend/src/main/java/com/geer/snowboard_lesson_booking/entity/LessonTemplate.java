package com.geer.snowboard_lesson_booking.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LessonTemplate {
    private Long id;
    private Long instructorId;
    private String title;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
