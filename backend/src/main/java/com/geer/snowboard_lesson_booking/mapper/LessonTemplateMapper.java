package com.geer.snowboard_lesson_booking.mapper;

import com.geer.snowboard_lesson_booking.entity.LessonTemplate;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface LessonTemplateMapper {
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(LessonTemplate lessonTemplate);
}
