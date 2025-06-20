package com.geer.snowboard_lesson_booking.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BookingMapper {
    /**
     * 根据 availabilityId 查询预订记录的数量。
     * @param availabilityId 可用时间段的ID
     * @return 匹配的预订记录数量
     */
    int countByAvailabilityId(Long availabilityId);
}
