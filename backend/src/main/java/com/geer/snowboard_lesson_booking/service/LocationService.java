package com.geer.snowboard_lesson_booking.service;

import com.geer.snowboard_lesson_booking.entity.Location;
import com.geer.snowboard_lesson_booking.mapper.LocationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

public interface LocationService {
    List<Location> getLocations();
    Location getLocationById(int id);
}
