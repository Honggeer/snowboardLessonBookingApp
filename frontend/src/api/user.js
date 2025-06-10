// 文件位置: frontend/src/api/user.js
import axios from 'axios';

/**
 * 用户登录API
 * @param {object} data - 包含 email 和 password 的对象
 * @returns Promise
 */
export const loginApi = (data) => {
    // 注意：这里的URL路径是相对路径，Vite代理会自动将其转发到 http://localhost:8080/api/users/login
    return axios.post('/api/users/login', data);
};
export const registerStudentApi = (data) => {
    // 注意：这里的URL路径是相对路径，Vite代理会自动将其转发到 http://localhost:8080/api/users/login
    return axios.post('/api/users/register/student', data);
};
// 未来你可以在这里添加更多用户相关的API请求，比如注册、获取用户信息等
// export const registerApi = (data) => { ... };
