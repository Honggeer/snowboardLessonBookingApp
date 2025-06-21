import axiosInstance from '../utils/axiosInstance.js';

// 配置基础URL，这样你就不需要在每个请求中都写完整路径了
// 将来可以替换成你的实际API地址，例如 'http://localhost:8080/api'
const API_URL = '/api/instructors/me';

/**
 * 获取当前登录教练的个人资料
 * @returns {Promise<Object>} 包含教练资料的对象
 */
const getProfile = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/profile`);
        return response.data; // axios 会自动将返回的JSON字符串解析为对象
    } catch (error) {
        // 错误处理：打印错误信息到控制台，并向上抛出异常
        console.error('获取教练资料失败:', error);
        throw error;
    }
};
const getInstructorDetail = async (id) => {
    try {

        const response = await axiosInstance.get(`/api/student/instructor/${id}`);
        if (response.data && response.data.code === 1) {
            return response.data.data; // <--- 成功时，直接返回最内层的数据
        } else {
            // 业务失败时，主动抛出错误
            throw new Error(response.data.msg || '获取教练详情失败');
        }
    } catch (error) {
        // 错误处理：打印错误信息到控制台，并向上抛出异常
        console.error(`获取教练ID ${id} 的详情失败:`, error);
        throw error;
    }
};
/**
 * 更新当前登录教练的个人资料
 * @param {Object} profileData - 包含更新后信息的教练资料对象
 * @returns {Promise<Object>} 后端返回的确认信息
 */
const updateProfile = async (profileData) => {
    try {
        // 注意：这里的URL是 '/api/instructors/profile'
        // 你需要确保后端有对应此PUT请求的接口
        const response = await axiosInstance.put(`${API_URL}/profile`, profileData);
        return response.data;
    } catch (error) {
        console.error('更新教练资料失败:', error);
        throw error;
    }
};
const  addSkillCertification = async (formData)=> {
    return axiosInstance.post('/api/instructors/me/skills', formData)
};
const getAllInstructors = async (params) => {
    try {

        const response = await axiosInstance.get(`/api/student/instructors`, {params});
        if (response.data && response.data.code === 1) {
            return response.data;
        } else {
            // 如果后端返回的code不是1，也抛出一个错误
            throw new Error(response.data.message || '获取教练列表失败');
        }
    } catch (error) {
        // 错误处理：打印错误信息到控制台，并向上抛出异常
        console.error('获取教练列表失败:', error);
        throw error;
    }
};
const getInstructorAvailability = async (instructorId, date)=> {
    try {
        const response = await axiosInstance.get(
            // 注意这里的URL，它匹配我们后端 StudentController 中的新接口
            `/api/student/instructor/${instructorId}/availabilities`,
            { params: { date } }
        );
        // 直接返回后端 Result<T> 中的 data 部分
        return response.data.data;
    } catch (error) {
        console.error(`获取教练ID ${instructorId} 在 ${date} 的可用时间失败:`, error);
        throw error;
    }
};
const createAvailabilities = async (createDto) => {
    const response = await axiosInstance.post('/api/instructors/me/availabilities', createDto);
    if (response.data && response.data.code === 1) {
        return response.data; // 对于没有具体返回数据的操作，返回整个 Result 对象或其 data 部分都可以
    }
    throw new Error(response.data.msg || '创建可用时间失败');
};

/**
 * 获取教练本人在指定日期的日程安排。
 * @param {string} date - 日期字符串, 格式为 'YYYY-MM-DD'。
 * @returns {Promise<any>}
 */
const getMyAvailabilitiesByDate = async (date) => {
    const response = await axiosInstance.get('/api/instructors/me/availabilities', { params: { date } });
    if (response.data && response.data.code === 1) {
        return response.data.data; // 直接返回 DailyAvailabilityVO
    }
    throw new Error(response.data.msg || '获取日程失败');
};

/**
 * 删除一个指定的可用时间段。
 * @param {number} availabilityId - 要删除的时间段ID。
 * @returns {Promise<any>}
 */
const deleteAvailabilityById = async (availabilityId) => {
    const response = await axiosInstance.delete(`/api/instructors/me/availabilities/${availabilityId}`);
    if (response.data && response.data.code === 1) {
        return response.data;
    }
    throw new Error(response.data.msg || '删除失败');
};

/**
 * 按天批量删除所有未被预订的可用时间段。
 * @param {string} date - 日期字符串, 格式为 'YYYY-MM-DD'。
 * @returns {Promise<any>}
 */
const deleteAvailabilitiesByDate = async (date) => {
    const response = await axiosInstance.delete('/api/instructors/me/availabilities', { params: { date } });
    if (response.data && response.data.code === 1) {
        return response.data;
    }
    throw new Error(response.data.msg || '清空失败');
};
const deleteAllMyAvailabilities = async () => {
    const response = await axiosInstance.delete('/api/instructors/me/availabilities/all');
    if (response.data && response.data.code === 1) {
        return response.data;
    }
    throw new Error(response.data.msg || '一键清空失败');
};



// 导出这些函数，以便在你的组件中使用
export const instructorService = {
    getProfile,
    updateProfile,
    addSkillCertification,
    getAllInstructors,
    getInstructorAvailability,
    getInstructorDetail,
    getAvailableResorts: async () => axiosInstance.get('/api/locations').then(res => res.data),
    updateMyLocations: async (locationUpdateDTO) => axiosInstance.put('/api/instructors/me/locations', locationUpdateDTO).then(res => res.data),
    // 新增: 获取所有可选技能的API
    getAvailableSkills: async () => axiosInstance.get('/api/skills').then(res => res.data),
    deleteSkillCertification: async (skillId) => axiosInstance.delete(`/api/instructors/me/skills/${skillId}`).then(res => res.data),
    createAvailabilities,
    getMyAvailabilitiesByDate,
    deleteAvailabilityById,
    deleteAvailabilitiesByDate,
    deleteAllMyAvailabilities,
};
