// 文件位置: frontend/src/views/DashboardPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 1. 从localStorage中移除token
        localStorage.removeItem('token');
        // 2. 跳转回登录页面
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold text-gray-800">欢迎来到您的仪表盘</h1>
                <p className="mt-4 text-gray-600">这里是只有登录用户才能看到的内容。</p>
                <button
                    onClick={handleLogout}
                    className="mt-6 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                >
                    登出
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;
