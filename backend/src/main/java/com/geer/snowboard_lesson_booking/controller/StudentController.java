package com.geer.snowboard_lesson_booking.controller;

import com.geer.snowboard_lesson_booking.dto.InstructorQueryDTO;
import com.geer.snowboard_lesson_booking.result.PageResult;
import com.geer.snowboard_lesson_booking.result.Result;
import com.geer.snowboard_lesson_booking.service.InstructorService;
import com.geer.snowboard_lesson_booking.vo.DailyAvailabilityVO;
import com.geer.snowboard_lesson_booking.vo.InstructorCardVO;
import com.geer.snowboard_lesson_booking.vo.InstructorProfileVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@RestController
@RequestMapping("/api/student")
@Slf4j
public class StudentController {
    @Autowired
    private InstructorService instructorService;
    @GetMapping("/instructors")
    public Result<PageResult<InstructorCardVO>> listInstructors(InstructorQueryDTO instructorQueryDTO){
        log.info("Getting instructor list.");
        return Result.success(instructorService.getInstructorList(instructorQueryDTO));
    }
    @GetMapping("/instructor/{id}")
    public Result<InstructorProfileVO> getInstructorById(@PathVariable Long id){
        log.info("Getting instructor detail by id: {}.",id);
        return Result.success(instructorService.getInstructorDetailById(id));
    }
    @GetMapping("/instructor/{id}/availabilities")
    public Result<DailyAvailabilityVO> getAvailabilities(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        log.info("Getting instructor availabilities.");
        DailyAvailabilityVO availability = instructorService.getDailyAvailability(id, date);
        return Result.success(availability);
    }
}
