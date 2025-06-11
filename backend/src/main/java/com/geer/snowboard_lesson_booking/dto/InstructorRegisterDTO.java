package com.geer.snowboard_lesson_booking.dto;

import lombok.Data;

import java.util.List;
@Data
public class InstructorRegisterDTO {
    private String email;
    private String password;
    private String phoneNumber;
    private String userName;
    private String idCardUrl;

    // --- 技能认证信息 ---
    private List<SkillSubmissionDTO> skills;

    @Data
    public static class SkillSubmissionDTO {
        private String skillName; // 例如 "CASI_LEVEL_2"
        private String certificateUrl;
    }
}
