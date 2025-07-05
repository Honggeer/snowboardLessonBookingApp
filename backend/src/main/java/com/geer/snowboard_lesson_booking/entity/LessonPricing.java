package com.geer.snowboard_lesson_booking.entity;

import lombok.Data;

import java.math.BigDecimal;
@Data
public class LessonPricing {
    private Long id;
    private Long lessonTemplateId;
    private Integer pax;
    private BigDecimal price;
}
