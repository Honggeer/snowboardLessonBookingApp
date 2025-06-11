package com.geer.snowboard_lesson_booking.controller;

import com.geer.snowboard_lesson_booking.entity.SkillType;
import com.geer.snowboard_lesson_booking.result.Result;
import com.geer.snowboard_lesson_booking.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api")
public class SkillController {
    @Autowired
    UserService userService;
    @GetMapping("/skills")
    public Result<List<SkillType>> getSkills(){
        log.info("Getting all the skills");
        List<SkillType> sklls = userService.getSkills();
        return Result.success(sklls);
    }
}
