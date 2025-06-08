package com.geer.snowboard_lesson_booking.exception;

public class LoginFailedException extends RuntimeException{
    public LoginFailedException(){}
    public LoginFailedException(String msg){
        super(msg);
    }
}
