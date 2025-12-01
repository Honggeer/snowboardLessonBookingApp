package com.geer.snowboard_lesson_booking.service.impl;

import com.geer.snowboard_lesson_booking.dto.*;
import com.geer.snowboard_lesson_booking.entity.*;
import com.geer.snowboard_lesson_booking.enums.LessonStatus;
import com.geer.snowboard_lesson_booking.exception.OperationFailedException;
import com.geer.snowboard_lesson_booking.exception.PermissionDeniedException;
import com.geer.snowboard_lesson_booking.exception.RegistrationFailedException;
import com.geer.snowboard_lesson_booking.mapper.*;
import com.geer.snowboard_lesson_booking.result.PageResult;
import com.geer.snowboard_lesson_booking.service.InstructorService;
import com.geer.snowboard_lesson_booking.utils.BaseContext;
import com.geer.snowboard_lesson_booking.vo.*;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
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
    @Autowired
    private InstructorMapper instructorMapper;
    @Autowired
    private AvailabilityMapper availabilityMapper;
    @Autowired
    private LocationMapper locationMapper;
    @Autowired
    private BookingMapper bookingMapper;
    @Autowired
    private LessonTemplateMapper lessonTemplateMapper;
    @Autowired
    private LessonPricingMapper lessonPricingMapper;
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
        List<InstructorLocationVO> locations = instructorLocationMapper.findLocationsByInstructorId(currentUserId);
        instructorProfileVO.setSkills(skills);
        instructorProfileVO.setLocations(locations);
        return instructorProfileVO;
    }
    @Transactional
    @Override
    public void updateMyProfile(InstructorProfileUpdateDTO profileUpdateDTO) {
        Long currentId = BaseContext.getCurrentId();
        if(hasUserUpdates(profileUpdateDTO)){
            User uptodateUser = new User();
            BeanUtils.copyProperties(profileUpdateDTO,uptodateUser);
            uptodateUser.setId(currentId);
            userMapper.update(uptodateUser);
            log.info("Updated user profile(ID:{})", currentId);
        }
        if(hasInstructorProfileUpdates(profileUpdateDTO)){
            InstructorProfile profileToUpdate = new InstructorProfile();
            BeanUtils.copyProperties(profileUpdateDTO, profileToUpdate);
            profileToUpdate.setUserId(currentId);
            instructorProfileMapper.update(profileToUpdate);
            log.info("Updated instructor profile(ID:{}).", currentId);
        }
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
    public List<String> getMyLocations() {
        Long id = BaseContext.getCurrentId();
        return instructorLocationMapper.findLocationNamesByInstructorId(id);
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

    @Override
    public void deleteMySkillById(Long id) {
        instructorSkillMapper.deleteById(id);
    }

    @Override
    public PageResult<InstructorCardVO> getInstructorList(InstructorQueryDTO instructorQueryDTO) {
        PageHelper.startPage(instructorQueryDTO.getPage(),instructorQueryDTO.getPageSize());
        List<InstructorCardVO> instructorCardVOS = instructorMapper.findInstructorsByCriteria(instructorQueryDTO);
        if (CollectionUtils.isEmpty(instructorCardVOS)) {
            return new PageResult<>(new ArrayList<>(), 0L, instructorQueryDTO.getPage(), instructorQueryDTO.getPageSize());
        }
        for (InstructorCardVO card : instructorCardVOS) {
            // 2a. 为每个教练查询其技能列表
            List<InstructorSkillVO> skills = instructorSkillMapper.findSkillsByInstructorId(card.getUserId());
            card.setSkills(skills != null ? skills : new ArrayList<>());

            // 2b. 为每个教练查询其地点列表
            List<InstructorLocationVO> locations = instructorLocationMapper.findLocationsByInstructorId(card.getUserId());
            card.setLocations(locations != null ? locations : new ArrayList<>());
        }
        PageInfo<InstructorCardVO> pageInfo = new PageInfo<>(instructorCardVOS);
        return new PageResult<>(
                pageInfo.getList(),
                pageInfo.getTotal(),
                pageInfo.getPageNum(),
                pageInfo.getPageSize()
        );
    }

    @Override
    public InstructorProfileVO getInstructorDetailById(Long id) {
        User user = userMapper.findById(id);
        InstructorProfile instructorProfile = instructorProfileMapper.findByUserId(id);
        List<InstructorSkillVO> skills = instructorSkillMapper.findApprovedSkillsByInstructorId(id);
        InstructorProfileVO instructorProfileVO = new InstructorProfileVO();
        BeanUtils.copyProperties(user,instructorProfileVO);
        if(instructorProfile!=null){
            BeanUtils.copyProperties(instructorProfile,instructorProfileVO);
        }
        List<InstructorLocationVO> locations = instructorLocationMapper.findLocationsByInstructorId(id);
        instructorProfileVO.setSkills(skills);
        instructorProfileVO.setLocations(locations);
        return instructorProfileVO;
    }
    public DailyAvailabilityVO getDailyAvailability(Long instructorId, LocalDate date) {


        // 1. 确定一天的开始和结束时间
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // 2. 调用修改后的Mapper方法，一次性获取所有时间段及其预订状态
        List<AvailabilityInfoVO> availabilityInfos = availabilityMapper.findByInstructorIdAndDate(instructorId, startOfDay, endOfDay);

        // 3. 寻找第一个被预订的时间段，以确定锁定的雪场
        DailyAvailabilityVO.LockedInResortInfo lockedInResort = availabilityInfos.stream()
                .filter(info -> info.getBookingId() != null && info.getResortId() != null) // 筛选出已被预订且有关联雪场的记录
                .findFirst() // 找到第一个
                .map(info -> {
                    // 根据 resortId 查询雪场名称
                    Location location = locationMapper.findById(info.getResortId());
                    return new DailyAvailabilityVO.LockedInResortInfo(location.getId(), location.getName());
                })
                .orElse(null); // 如果当天没有预订，则为 null

        // 4. 筛选出所有未被预订的时间段
        List<DailyAvailabilityVO.AvailabilitySlot> availableSlots = availabilityInfos.stream()
                .filter(info -> info.getBookingId() == null) // bookingId 为 null 的就是未预订的
                .map(info -> new DailyAvailabilityVO.AvailabilitySlot(
                        info.getId(),
                        info.getStartTime(),
                        info.getEndTime(),
                        info.getResortId()
                ))
                .collect(Collectors.toList());

        // 5. 组装最终的VO并返回
        return new DailyAvailabilityVO(lockedInResort, availableSlots);
    }
    @Override
    @Transactional
    public void createAvailabilities(AvailabilitiesCreateDTO dto) {
        validateSkiSeason(dto.getStartDate(), dto.getEndDate());
        Long instructorId = BaseContext.getCurrentId();

        // 1. 【核心改动】先删除，为覆盖做准备
        // 遍历指定的时间范围
        for (LocalDate date = dto.getStartDate(); !date.isAfter(dto.getEndDate()); date = date.plusDays(1)) {
            // 如果当天符合星期条件，则调用“按天删除”的逻辑，清空当天的旧安排
            deleteAvailabilityByDate(date);
        }


        List<Availability> availabilitiesToInsert = new ArrayList<>();
        final int DURATION_HOURS = 2;

        for (LocalDate date = dto.getStartDate(); !date.isAfter(dto.getEndDate()); date = date.plusDays(1)) {
            List<DayOfWeek> daysOfWeek = dto.getDaysOfWeek();
            if (daysOfWeek != null && !daysOfWeek.isEmpty() && !daysOfWeek.contains(date.getDayOfWeek())) {
                continue;
            }

            for (LocalTime time = dto.getStartTime(); time.isBefore(dto.getEndTime()); time = time.plusHours(DURATION_HOURS)) {
                LocalTime slotEndTime = time.plusHours(DURATION_HOURS);
                if (slotEndTime.isAfter(dto.getEndTime())) continue;

                Availability availability = new Availability();
                availability.setInstructorId(instructorId);
                availability.setResortId(dto.getResortId());
                availability.setStartTime(LocalDateTime.of(date, time));
                availability.setEndTime(LocalDateTime.of(date, slotEndTime));
                availability.setNotes(dto.getNotes());
                availabilitiesToInsert.add(availability);
            }
        }

        if (!availabilitiesToInsert.isEmpty()) {
            availabilityMapper.insertBatch(availabilitiesToInsert);
            log.info("为教练ID: {} 成功覆盖并创建了 {} 个新的可用时间段。", instructorId, availabilitiesToInsert.size());
        }
    }
    @Override
    public void deleteAvailability(Long availabilityId) {
        Long instructorId = BaseContext.getCurrentId();

        // 1. 安全检查：确认该时间段存在且属于当前登录的教练
        Availability availability = availabilityMapper.findById(availabilityId);
        if (availability == null || !Objects.equals(availability.getInstructorId(), instructorId)) {
            throw new PermissionDeniedException("无权操作或时间段不存在");
        }

        // 2. 安全检查：确认该时间段未被任何学员预订
        int bookingCount = bookingMapper.countByAvailabilityId(availabilityId);
        if (bookingCount > 0) {
            throw new OperationFailedException("无法删除，该时间段已被预订");
        }
        // 3. 执行删除
        availabilityMapper.deleteById(availabilityId);
        log.info("教练ID: {} 成功删除了可用时间段ID: {}", instructorId, availabilityId);
    }
    @Override
    public void deleteAllMyAvailabilities(){
        Long instructorId = BaseContext.getCurrentId();
        availabilityMapper.deleteAllUnbookedByInstructorId(instructorId);
    }


    @Override
    public void deleteAvailabilityByDate(LocalDate date){
        Long instructorId = BaseContext.getCurrentId();
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        List<AvailabilityInfoVO> availabilityInfos = availabilityMapper.findByInstructorIdAndDate(instructorId,startOfDay,endOfDay);
        List<Long> idsToDelete = availabilityInfos.stream()
                .filter(info -> info.getBookingId() == null) // bookingId 为 null 的就是未预订的
                .map(AvailabilityInfoVO::getId)
                .collect(Collectors.toList());
        if (!CollectionUtils.isEmpty(idsToDelete)) {
            availabilityMapper.deleteBatchByIds(idsToDelete);
            log.info("成功清空了教练ID: {} 在日期 {} 的 {} 个未预订时间段。", instructorId, date, idsToDelete.size());
        } else {
            log.info("教练ID: {} 在日期 {} 没有需要清空的未预订时间段。", instructorId, date);
        }
    }
    private boolean hasInstructorProfileUpdates(InstructorProfileUpdateDTO dto) {
        return StringUtils.hasText(dto.getAvatarUrl()) ||
                dto.getExperienceYears() != null ||
                StringUtils.hasText(dto.getBio()) ||
                StringUtils.hasText(dto.getTeachingContent());
    }
    private boolean hasUserUpdates(InstructorProfileUpdateDTO dto) {
        return StringUtils.hasText(dto.getUserName()) ||
                StringUtils.hasText(dto.getPhoneNumber());
    }
    private void validateSkiSeason(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new OperationFailedException("开始日期和结束日期不能为空。");
        }
        if(startDate.isAfter(endDate)){
            throw new OperationFailedException("结束日期不能早于开始日期。");
        }
        // 遍历所选范围内的每一个月，确保都在雪季内
        LocalDate cursor = startDate.withDayOfMonth(1);
        while (!cursor.isAfter(endDate)) {
            int month = cursor.getMonthValue();
            // 休雪季为 6月 (June) 到 10月 (October)
            if (month >= 6 && month <= 10) {
                throw new OperationFailedException("创建失败：时间范围不能包含休雪季（6月到10月），请重新选择。");
            }
            cursor = cursor.plusMonths(1);
        }
    }
    @Override
    public void createLesson(LessonCreateDTO lessonCreateDTO) {
        Long instructorId = BaseContext.getCurrentId();

        // 1. 创建并插入课程模板主体
        LessonTemplate lessonTemplate = new LessonTemplate();
        BeanUtils.copyProperties(lessonCreateDTO, lessonTemplate);
        lessonTemplate.setInstructorId(instructorId);
        lessonTemplateMapper.insert(lessonTemplate);

        // 2. 获取上一步操作中自动生成的主键ID
        Long lessonTemplateId = lessonTemplate.getId();
        log.info("Instructor id: {} created new lesson template，ID: {}", instructorId, lessonTemplateId);

        // 3. 准备并批量插入定价信息
        List<LessonCreateDTO.PricingDTO> pricingsDTO = lessonCreateDTO.getPricings();
        if (!CollectionUtils.isEmpty(pricingsDTO)) {
            List<LessonPricing> lessonPricings = pricingsDTO.stream().map(dto -> {
                LessonPricing pricing = new LessonPricing();
                BeanUtils.copyProperties(dto, pricing);
                // 关联到刚刚创建的课程模板ID
                pricing.setLessonTemplateId(lessonTemplateId);
                return pricing;
            }).collect(Collectors.toList());

            // 批量插入
            lessonPricingMapper.insertBatch(lessonPricings);
            log.info("Lesson template ID: {} inserted {} records。", lessonTemplateId, lessonPricings.size());
        }
    }

}
