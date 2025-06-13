package com.geer.snowboard_lesson_booking.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstructorLocation {
    private Long instructorId;
    private Integer resortId;
}
