package com.geer.snowboard_lesson_booking.dto;

import lombok.Data;

import java.util.List;

@Data
public class LocationUpdateDTO {
    private List<Integer> resortIds; // 要关联的雪山ID列表
}