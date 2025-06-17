package com.geer.snowboard_lesson_booking.dto;

import lombok.Data;

@Data
public class InstructorQueryDTO {
    private String searchTerm;

    private Long locationId;
    private Long certificationId;


    private Integer page = 1;
    private Integer pageSize = 10;

    // 排序参数
    private String sortBy = "rating";
    private String order = "desc";
}
