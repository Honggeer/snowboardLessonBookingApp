package com.geer.snowboard_lesson_booking.service.impl;

import com.geer.snowboard_lesson_booking.entity.Location;
import com.geer.snowboard_lesson_booking.mapper.LocationMapper;
import com.geer.snowboard_lesson_booking.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationServiceImpl implements LocationService {

    @Autowired
    private LocationMapper locationMapper;
    @Override
    public List<Location> getLocations() {
        return locationMapper.findAll();
    }

    @Override
    public Location getLocationById(int id) {
        return locationMapper.findById(id);
    }
}
