package com.geer.snowboard_lesson_booking.exception;

public class OperationFailedException extends RuntimeException{
    public OperationFailedException(){

    }
    public OperationFailedException(String s){
        super(s);
    }
}
