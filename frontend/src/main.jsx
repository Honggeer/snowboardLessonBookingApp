import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import LoginPage from './views/LoginPage.jsx'; // 导入我们的登录页
import './index.css'; // 导入Tailwind样式

// 创建路由配置
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            // 在这里定义所有页面的路由
            {
                path: '/login', // 当访问 /login 时
                element: <LoginPage />, // 显示LoginPage组件
            },
            // 你可以添加一个默认首页
            {
                index: true, // 这是默认子路由
                element: <div>欢迎来到首页! <a href="/login">去登录</a></div>,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);