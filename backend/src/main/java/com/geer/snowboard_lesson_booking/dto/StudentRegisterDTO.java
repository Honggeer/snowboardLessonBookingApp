package com.geer.snowboard_lesson_booking.dto;

import com.geer.snowboard_lesson_booking.enums.AbilityLevel;
import com.geer.snowboard_lesson_booking.enums.Gender;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class StudentRegisterDTO {
    String email;
    String password;
    String userName;
    String phoneNumber;
    Date dateOfBirth;
    Gender gender;
    int heightCm;
    double weightKg;
    AbilityLevel abilityLevel;
}
