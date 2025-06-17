package com.geer.snowboard_lesson_booking.controller;

import com.geer.snowboard_lesson_booking.entity.Location;
import com.geer.snowboard_lesson_booking.result.Result;
import com.geer.snowboard_lesson_booking.service.LocationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api")
public class LocationController {
    @Autowired
    private LocationService locationService;
    @GetMapping("/locations")
    Result<List<Location>> getLocations(){
        log.info("Getting all locations.");
        return Result.success(locationService.getLocations());
    }
}
