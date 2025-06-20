package com.geer.snowboard_lesson_booking.mapper;

import com.geer.snowboard_lesson_booking.entity.Availability;
import com.geer.snowboard_lesson_booking.vo.AvailabilityInfoVO;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Mapper
public interface AvailabilityMapper {
    List<AvailabilityInfoVO> findByInstructorIdAndDate(Long instructorId, LocalDateTime startOfDay, LocalDateTime endOfDay);
    void insertBatch(List<Availability> availabilities);
    void deleteById(Long id);
    Availability findById(Long id);

    void deleteBatchByIds(List<Long> idsToDelete);
}
