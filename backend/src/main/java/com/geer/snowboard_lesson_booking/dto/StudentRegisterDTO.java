package com.geer.snowboard_lesson_booking.dto;

import com.geer.snowboard_lesson_booking.enums.AbilityLevel;
import com.geer.snowboard_lesson_booking.enums.Gender;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StudentRegisterDTO {
    String email;
    String password;
    String confirmPassword;
    String userName;
    String phoneNumber;
    LocalDateTime dateOfBirth;
    Gender gender;
    int heightCm;
    double weightKg;
    AbilityLevel abilityLevel;
}
