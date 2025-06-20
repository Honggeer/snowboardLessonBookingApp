package com.geer.snowboard_lesson_booking.vo;

import com.geer.snowboard_lesson_booking.entity.Availability;
import lombok.Data;

@Data
public class AvailabilityInfoVO extends Availability {
    private Long bookingId;
}
