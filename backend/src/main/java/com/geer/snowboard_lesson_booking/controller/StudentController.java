package com.geer.snowboard_lesson_booking.controller;

import com.geer.snowboard_lesson_booking.dto.InstructorQueryDTO;
import com.geer.snowboard_lesson_booking.result.PageResult;
import com.geer.snowboard_lesson_booking.result.Result;
import com.geer.snowboard_lesson_booking.service.InstructorService;
import com.geer.snowboard_lesson_booking.vo.InstructorCardVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
