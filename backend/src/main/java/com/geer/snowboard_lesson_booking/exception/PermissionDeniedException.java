package com.geer.snowboard_lesson_booking.exception;

public class PermissionDeniedException extends RuntimeException {
    public PermissionDeniedException(){

    }
    public PermissionDeniedException(String s) {
        super(s);
    }
}
