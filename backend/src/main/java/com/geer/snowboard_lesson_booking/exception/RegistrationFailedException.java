package com.geer.snowboard_lesson_booking.exception;

public class RegistrationFailedException extends RuntimeException{
    public RegistrationFailedException(){

    }
    public RegistrationFailedException(String msg){
        super(msg);
    }
}
