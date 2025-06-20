package com.geer.snowboard_lesson_booking.dto;

import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class AvailabilitiesCreateDTO {
    private LocalDate startDate;        // 开始日期, e.g., "2025-12-01"
    private LocalDate endDate;          // 结束日期, e.g., "2025-12-31"
    private List<DayOfWeek> daysOfWeek; // 周几可用, e.g., [MONDAY, TUESDAY, WEDNESDAY]

    // 用于描述时间段的通用字段
    private LocalTime startTime;        // 开始时间, e.g., "10:00"
    private LocalTime endTime;          // 结束时间, e.g., "16:00"
    private Integer resortId;           // 关联的雪场ID
    private String notes;
}
