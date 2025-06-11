// 文件位置: frontend/src/utils/axiosInstance.js
import axios from 'axios';

// 创建一个Axios的实例
const axiosInstance = axios.create({
    // baseURL可以根据您的后端地址进行配置，但因为我用了Vite代理，这里可以不写
    // baseURL: '/api'
});

// 添加一个请求拦截器
axiosInstance.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么
        const token = localStorage.getItem('token'); // 从localStorage中获取token

        if (token) {
            // 如果token存在，则在每个请求的头中添加Authorization字段
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

export default axiosInstance;
