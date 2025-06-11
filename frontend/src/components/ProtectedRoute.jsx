import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    // 检查是否存在token
    if (!token) {
        // 如果没有token，重定向到登录页面
        return <Navigate to="/login" replace />;
    }

    // 如果有token，则渲染子路由（即受保护的页面）
    return <Outlet />;
};

export default ProtectedRoute;
