package com.geer.snowboard_lesson_booking.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Booking {
    private Long id;
    private Long availabilityId;
    private Long studentId;
    private Long lessonTemplateId;
    private Integer pax;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
