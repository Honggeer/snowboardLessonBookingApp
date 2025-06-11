package com.geer.snowboard_lesson_booking.entity;
import com.geer.snowboard_lesson_booking.enums.AccountStatus;
import com.geer.snowboard_lesson_booking.enums.Role;
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
public class User implements Serializable {
    private Long id;
    private String email;
    private String phoneNumber;
    private String passwordHash;
    private String userName;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private AccountStatus status;
    private String verificationToken;
    private LocalDateTime tokenExpiry;


}
