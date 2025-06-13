package com.geer.snowboard_lesson_booking.controller;

import com.geer.snowboard_lesson_booking.dto.InstructorProfileUpdateDTO;
import com.geer.snowboard_lesson_booking.result.Result;
import com.geer.snowboard_lesson_booking.service.InstructorService;
import com.geer.snowboard_lesson_booking.vo.InstructorProfileVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/instructors")
@Slf4j
public class InstructorController {
    @Autowired
    private InstructorService instructorService;
    @GetMapping("/me/profile")
    public Result<InstructorProfileVO> getMyProfile(){
        log.info("Getting current instructor profile.");
        InstructorProfileVO instructorProfileVO = instructorService.getMyProfile();
        return Result.success(instructorProfileVO);
    }
    @PutMapping
    public Result updateMyProfile(@RequestBody InstructorProfileUpdateDTO profileUpdateDTO){
        log.info("Updating current instructor profile.");
        instructorService.updateMyProfile(profileUpdateDTO);
        return Result.success();
    }
}
