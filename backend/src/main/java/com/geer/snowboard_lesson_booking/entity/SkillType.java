package com.geer.snowboard_lesson_booking.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillType implements Serializable {
    private Integer id;
    private String skillName;
    private String displayName;
    private String description;
}
