package com.geer.snowboard_lesson_booking.entity;

import com.geer.snowboard_lesson_booking.enums.LessonStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LessonTemplate {
    private Long id;
    private Long instructorId;
    private String title;
    private String description;
    private LessonStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
