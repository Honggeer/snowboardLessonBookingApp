package com.geer.snowboard_lesson_booking.controller;

import com.geer.snowboard_lesson_booking.dto.InstructorProfileUpdateDTO;
import com.geer.snowboard_lesson_booking.dto.LocationUpdateDTO;
import com.geer.snowboard_lesson_booking.dto.SkillAddDTO;
import com.geer.snowboard_lesson_booking.result.Result;
import com.geer.snowboard_lesson_booking.service.InstructorService;
import com.geer.snowboard_lesson_booking.vo.InstructorProfileVO;
import com.geer.snowboard_lesson_booking.vo.InstructorSkillVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructors/me")
@Slf4j
public class InstructorController {
    @Autowired
    private InstructorService instructorService;
    @GetMapping("/profile")
    public Result<InstructorProfileVO> getMyProfile(){
        log.info("Getting current instructor profile.");
        InstructorProfileVO instructorProfileVO = instructorService.getMyProfile();
        return Result.success(instructorProfileVO);
    }
    @PutMapping("/profile")
    public Result<String> updateMyProfile(@RequestBody InstructorProfileUpdateDTO profileUpdateDTO){
        log.info("Updating current instructor profile.");
        instructorService.updateMyProfile(profileUpdateDTO);
        return Result.success();
    }
    @GetMapping("/skills")
    public Result<List<InstructorSkillVO>> getMySkills(){
        log.info("Getting current instructor skills.");
        List<InstructorSkillVO> skills = instructorService.getMySkills();
        return Result.success(skills);
    }
    @PostMapping("/skills")
    public  Result<String> addSkills(@RequestBody SkillAddDTO skillAddDTO){
        log.info("Current instructor added skills: {}", skillAddDTO.getSkillName());
        instructorService.addSkill(skillAddDTO);
        return Result.success("技能认证申请已提交，请等待审核。");
    }
    @GetMapping("/locations")
    public Result<List<String>> getMyLocations(){
        log.info("Getting current instructor locations.");
        List<String> locations = instructorService.getMyLocations();
        return Result.success(locations);
    }
    @PutMapping("/locations")
    public  Result addLocations(@RequestBody LocationUpdateDTO locationUpdateDTO){
        log.info("Current instructor added locations: {}", locationUpdateDTO.getResortIds());
        instructorService.updateMyLocations(locationUpdateDTO);
        return Result.success("授课地点更新成功");
    }
}
