package com.geer.snowboard_lesson_booking.entity;

import com.geer.snowboard_lesson_booking.enums.AbilityLevel;
import com.geer.snowboard_lesson_booking.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfile {
    private Long userId;
    private LocalDateTime dateOfBirth;
    private Gender gender;
    private int heightCm;
    private double weightKg;
    private AbilityLevel abilityLevel;
}
