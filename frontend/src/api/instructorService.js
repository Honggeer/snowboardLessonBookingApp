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

// 导出这些函数，以便在你的组件中使用
export const instructorService = {
    getProfile,
    updateProfile,
    addSkillCertification,
    getAvailableResorts: async () => axiosInstance.get('api/locations').then(res => res.data),
    updateMyLocations: async (locationUpdateDTO) => axiosInstance.put('api/instructors/me/locations', locationUpdateDTO).then(res => res.data),
    // 新增: 获取所有可选技能的API
    getAvailableSkills: async () => axiosInstance.get('/api/skills').then(res => res.data),
    deleteSkillCertification: async (skillId) => axiosInstance.delete(`api/instructors/me/skills/${skillId}`).then(res => res.data),
};
