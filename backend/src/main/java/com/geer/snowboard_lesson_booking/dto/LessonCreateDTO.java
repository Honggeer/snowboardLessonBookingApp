package com.geer.snowboard_lesson_booking.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class LessonCreateDTO {
    private String title;
    private String description;

    // 内嵌一个列表，用于接收多个定价信息
    private List<PricingDTO> pricings;

    /**
     * 内嵌的静态类，用于描述单个定价。
     */
    @Data
    public static class PricingDTO {
        private Integer pax; // 人数, e.g., 1, 2, 3
        private BigDecimal price; // 价格
    }
}
