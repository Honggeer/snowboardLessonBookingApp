package com.geer.snowboard_lesson_booking.mapper;

import com.geer.snowboard_lesson_booking.entity.User;
import com.geer.snowboard_lesson_booking.vo.UserLoginVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.springframework.web.bind.annotation.Mapping;

@Mapper
public interface UserMapper {
    /**
     * 根据ID查询用户
     * @param id 用户ID
     * @return 用户对象
     */
    User findById(Long id);
    User findByEmail(String email);
    @Options(useGeneratedKeys = true,keyProperty = "id")
    void insert(User user);
    User findByVerificationToken(String token);
    void updateStatus(User user);

    void update(User user);

}
