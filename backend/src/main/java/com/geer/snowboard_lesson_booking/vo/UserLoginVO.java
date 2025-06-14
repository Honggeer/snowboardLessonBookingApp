package com.geer.snowboard_lesson_booking.vo;

import com.geer.snowboard_lesson_booking.enums.AccountStatus;
import com.geer.snowboard_lesson_booking.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginVO implements Serializable {
    private Long id;
    private String userName;
    private String token;
    private Role role;
}
