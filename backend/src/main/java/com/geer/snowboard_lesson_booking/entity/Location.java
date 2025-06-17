package com.geer.snowboard_lesson_booking.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    private Integer id;
    private String name;
    private String region;
    private String websiteUrl;
}
