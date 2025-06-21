import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import LoginPage from './views/LoginPage.jsx';// 导入我们的登录页
import RegisterPage from "./views/RegisterPage.jsx";
import './index.css';
import DashboardPage from "./views/DashboardPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import InstructorRegisterPage from "./views/InstructorRegisterPage.jsx";
import InstructorProfilePage from "./views/InstructorProfilePage.jsx";
import InstructorListPage from "./views/InstructorListPage.jsx"; // 导入Tailwind样式
import InstructorDetailPage from "./views/InstructorDetailPage.jsx";
import AvailabilityManagementPage from "./views/AvailabilityManagementPage.jsx";
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
            {
                element: <ProtectedRoute />, // 使用这个组件包裹所有需要保护的页面
                children: [
                    {
                        path: '/dashboard', // 当访问 /dashboard 时
                        element: <DashboardPage />, // 显示仪表盘
                    },
                    {
                        path: '/instructorProfile',
                        element: <InstructorProfilePage />,
                    },
                    {
                        path: '/instructorList',
                        element: <InstructorListPage />,
                    },
                    {
                        path: '/instructors/:id',
                        element: <InstructorDetailPage/>,
                    },
                    {
                        path: '/instructor/schedule',
                        element: <AvailabilityManagementPage />
                    }

                    // 未来可以添加更多受保护的页面，比如 /profile, /settings 等
                ] // 显示LoginPage组件
            },

            {
                path: '/register',
                element: <RegisterPage />,
            },

            {
                path: '/InstructorRegister',
                element: <InstructorRegisterPage />,
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