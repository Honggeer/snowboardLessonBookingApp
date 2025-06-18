package com.geer.snowboard_lesson_booking.vo;

import lombok.Data;

@Data
public class InstructorLocationVO {
    private Long id;
    // 如果需要，可以添加一个instructorId用于service层分组
    private Long instructorId;
    private String displayName;
    private String region;
    private String websiteUrl;
}
