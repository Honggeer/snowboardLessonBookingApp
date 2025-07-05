package com.geer.snowboard_lesson_booking.mapper;

import com.geer.snowboard_lesson_booking.entity.LessonPricing;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LessonPricingMapper {
    void insertBatch(List<LessonPricing> pricings);
}
