package com.geer.snowboard_lesson_booking.dto;

import lombok.Data;

import java.io.Serializable;
@Data
public class UserLoginDTO implements Serializable {
    private String email;
    private String password;

}
