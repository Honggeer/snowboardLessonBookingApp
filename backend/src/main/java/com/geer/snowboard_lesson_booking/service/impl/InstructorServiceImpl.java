package com.geer.snowboard_lesson_booking.service.impl;

import com.geer.snowboard_lesson_booking.dto.InstructorProfileUpdateDTO;
import com.geer.snowboard_lesson_booking.dto.LocationUpdateDTO;
import com.geer.snowboard_lesson_booking.dto.SkillAddDTO;
import com.geer.snowboard_lesson_booking.entity.*;
import com.geer.snowboard_lesson_booking.exception.RegistrationFailedException;
import com.geer.snowboard_lesson_booking.mapper.*;
import com.geer.snowboard_lesson_booking.service.InstructorService;
import com.geer.snowboard_lesson_booking.utils.BaseContext;
import com.geer.snowboard_lesson_booking.vo.InstructorProfileVO;
import com.geer.snowboard_lesson_booking.vo.InstructorSkillVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InstructorServiceImpl implements InstructorService {
    @Autowired
    private InstructorProfileMapper instructorProfileMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private SkillTypeMapper skillTypeMapper;
    @Autowired
    private InstructorSkillMapper instructorSkillMapper;
    @Autowired
    private InstructorLocationMapper instructorLocationMapper;

    @Override
    public InstructorProfileVO getMyProfile() {
        Long currentUserId = BaseContext.getCurrentId();
        User user = userMapper.findById(currentUserId);
        InstructorProfile instructorProfile = instructorProfileMapper.findByUserId(currentUserId);
        List<InstructorSkillVO> skills = instructorSkillMapper.findSkillsByInstructorId(currentUserId);
        InstructorProfileVO instructorProfileVO = new InstructorProfileVO();
        BeanUtils.copyProperties(user,instructorProfileVO);
        if(instructorProfile!=null){
            BeanUtils.copyProperties(instructorProfile,instructorProfileVO);
        }
        List<String> locations = instructorLocationMapper.findLocationNamesByInstructorId(currentUserId);
        instructorProfileVO.setSkills(skills);
        instructorProfileVO.setLocations(locations);
        return instructorProfileVO;
    }
    @Transactional
    @Override
    public void updateMyProfile(InstructorProfileUpdateDTO profileUpdateDTO) {
        Long currentId = BaseContext.getCurrentId();
        User uptodateUser = new User();
        BeanUtils.copyProperties(profileUpdateDTO,uptodateUser);
        uptodateUser.setId(currentId);
        userMapper.update(uptodateUser);
        InstructorProfile profileToUpdate = new InstructorProfile();

        BeanUtils.copyProperties(profileUpdateDTO, profileToUpdate);
        profileToUpdate.setUserId(currentId);
        instructorProfileMapper.update(profileToUpdate);
    }
    @Transactional
    @Override
    public void addSkill(SkillAddDTO skillAddDTO) {
        Long currentId = BaseContext.getCurrentId();
        SkillType skillType = skillTypeMapper.findByName(skillAddDTO.getSkillName());
        if(skillType == null){
            throw new RegistrationFailedException("无效的技能： " + skillAddDTO);
        }
        InstructorSkill newSkill = new InstructorSkill();
        newSkill.setInstructorId(currentId);
        newSkill.setSkillTypeId(skillType.getId());
        newSkill.setCertificateUrl(skillAddDTO.getCertificateUrl());
        instructorSkillMapper.insert(newSkill);
    }

    @Override
    public List<InstructorSkillVO> getMySkills() {
        Long id = BaseContext.getCurrentId();
        return instructorSkillMapper.findSkillsByInstructorId(id);

    }

    @Override
    public void updateMyLocations(LocationUpdateDTO locationUpdateDTO) {
        Long currentId = BaseContext.getCurrentId();
        // 1. 先删除该教练所有已存在的地点关联
        instructorLocationMapper.deleteByInstructorId(currentId);
        List<Integer> resortIds = locationUpdateDTO.getResortIds();
        // 2. 如果前端传来了新的地点列表，则批量插入
        if(resortIds != null && !resortIds.isEmpty()){
            List<InstructorLocation> locationsToInsert = resortIds.stream()
                    .map(resortId -> new InstructorLocation(currentId, resortId))
                    .collect(Collectors.toList());

            instructorLocationMapper.insertBatch(locationsToInsert);
        }
    }
}
