package com.geer.snowboard_lesson_booking.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyAvailabilityVO {
    // 如果当天已有预订，则返回被锁定的雪场信息；否则为 null
    private LockedInResortInfo lockedInResort;

    // 当天所有可用的时间段列表
    private List<AvailabilitySlot> availableSlots;
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LockedInResortInfo {
        private Integer id;
        private String name;


    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AvailabilitySlot {
        private Long availabilityId;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Integer resortId;
    }
}
