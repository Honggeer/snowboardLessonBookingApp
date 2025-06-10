import React, { useState } from 'react';


// 使用与登录页相同的背景图，保持风格统一
import backgroundImageUrl from '../assets/login_BG.png';
import {Link} from "react-router-dom";
import {loginApi, registerStudentApi} from "../api/user.js";
// 注册页面组件
const InputWithIcon = ({ icon, ...props }) => (
    <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            {icon}
        </div>
        <input {...props} className="relative block w-full appearance-none rounded-lg border border-gray-600 bg-gray-700/50 px-3 py-3 pl-10 text-white placeholder-gray-400 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm transition" />
    </div>
);
export default function RegisterPage() {
    // 【修改】根据您最新的DTO更新表单状态
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        userName: '', // 使用 userName 替换了 firstName 和 lastName
        phoneNumber: '',
        dateOfBirth: '',
        gender: 'MALE', // 默认值
        heightCm: '',
        weightKg: '',
        abilityLevel: 'BEGINNER', // 默认值
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 处理输入框变化的通用函数
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // 表单提交处理函数
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (formData.password !== formData.confirmPassword) {
            setError('两次输入的密码不一致。');
            return;
        }

        // 检查所有必填字段是否已填写
        for (const key in formData) {
            if (!formData[key]) {
                // confirmPassword 字段不需要提交给后端，所以可以跳过
                if (key === 'confirmPassword') continue;
                setError('请填写所有必填项。');
                return;
            }
        }

        setIsLoading(true);

        // --- 在这里准备并调用后端API ---
        // TODO: 创建并调用与您新DTO匹配的 registerApi 函数
        try {
            // 准备提交给后端的数据，移除前端专用的confirmPassword字段
            const { confirmPassword, ...payload } = formData;
            const  response = await registerStudentApi(payload);
            console.log('准备提交的注册数据:', payload);
            if(response.data.code === 1){
                setSuccess('注册成功！一封验证邮件已发送至您的邮箱，请查收。');
            }
            else{
                setError(response.data.msg || '注册失败，请稍后再试。')
            }

        } catch (err) {
            console.error('注册请求失败:', err);
            setError(err.response?.data?.msg || '网络错误，请检查您的连接。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
            {/* 背景 */}
            <div
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            >
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
            </div>

            {/* 注册表单容器 */}
            <div className="relative z-10 w-full max-w-2xl p-8 space-y-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white tracking-wider">
                        创建您的账户
                    </h1>
                    <p className="mt-2 text-gray-300">
                        加入我们，开启您的滑雪新篇章
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="p-3 bg-red-500/30 text-red-200 border border-red-500/50 rounded-lg text-center">{error}</div>}
                    {success && <div className="p-3 bg-green-500/30 text-green-200 border border-green-500/50 rounded-lg text-center">{success}</div>}

                    {/* 【修改】使用新的InputWithIcon组件，并调整间距 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="md:col-span-2">
                            <InputWithIcon
                                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>}
                                name="userName" type="text" required value={formData.userName} onChange={handleChange} placeholder="用户名 (Username)" />
                        </div>
                        <div className="md:col-span-2">
                            <InputWithIcon
                                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>}
                                name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} placeholder="邮箱地址" />
                        </div>
                        <InputWithIcon
                            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>}
                            name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="密码" />
                        <InputWithIcon
                            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>}
                            name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} placeholder="确认密码" />
                        <InputWithIcon
                            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400"><path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.067a1.5 1.5 0 01-1.465 1.825H4.21a1.5 1.5 0 01-1.228-2.318l.38-1.522zM17.5 2a1.5 1.5 0 011.5 1.5v13a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 011 16.5v-13A1.5 1.5 0 012.5 2h15z" /></svg>}
                            name="phoneNumber" type="tel" required value={formData.phoneNumber} onChange={handleChange} placeholder="电话号码" />
                        <InputWithIcon
                            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c0-.414.336-.75.75-.75h10.5a.75.75 0 010 1.5H5.5a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>}
                            name="dateOfBirth" type="date" required value={formData.dateOfBirth} onChange={handleChange} placeholder="出生日期" />
                        <select name="gender" value={formData.gender} onChange={handleChange} className="relative block w-full appearance-none rounded-lg border border-gray-600 bg-gray-700/50 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm transition">
                            <option value="MALE">男 (Male)</option>
                            <option value="FEMALE">女 (Female)</option>
                            <option value="OTHER">其他 (Other)</option>
                        </select>
                        <select name="abilityLevel" value={formData.abilityLevel} onChange={handleChange} className="relative block w-full appearance-none rounded-lg border border-gray-600 bg-gray-700/50 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm transition">
                            <option value="BEGINNER">小白 (Beginner)</option>
                            <option value="INTERMEDIATE">入门 (Intermediate)</option>
                            <option value="ADVANCED">高手 (Advanced)</option>
                            <option value="PRO">大神 (Pro)</option>
                        </select>
                        <InputWithIcon
                            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400"><path d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zM6.75 16.5a.75.75 0 01-.75-.75V4.25a.75.75 0 011.5 0v11.5a.75.75 0 01-.75.75zM10 18a1 1 0 01-1-1V3a1 1 0 112 0v14a1 1 0 01-1 1zM14.25 15.25a.75.75 0 01-.75-.75V5.5a.75.75 0 011.5 0v9a.75.75 0 01-.75.75zM17 12a1 1 0 01-1-1V9a1 1 0 112 0v2a1 1 0 01-1 1z" /></svg>}
                            name="heightCm" type="number" required value={formData.heightCm} onChange={handleChange} placeholder="身高 (cm)" />
                        <InputWithIcon
                            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400"><path d="M10.75 10.75a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5z" /><path fillRule="evenodd" d="M6 3a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5A.75.75 0 016 3zM4.75 3a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H4.75zM10 18a8 8 0 100-16 8 8 0 000 16zM9.25 5a.75.75 0 011.5 0v5.5a.75.75 0 01-1.5 0V5z" clipRule="evenodd" /></svg>}
                            name="weightKg" type="number" step="0.01" required value={formData.weightKg} onChange={handleChange} placeholder="体重 (kg)" />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 py-3 px-4 text-sm font-semibold text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '正在注册...' : '立即注册'}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    已经有账户了?{' '}
                    {/* 【修改】将Link组件替换为a标签以解决渲染错误 */}
                    <a href="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
                        返回登录
                    </a>
                </p>
            </div>
        </div>
    );
}

// 在 src/index.css 文件中添加这个辅助样式，让占位符颜色更好看
// (这不是必须的，但能提升视觉效果)
/*
@layer base {
  .input-style {
    @apply relative block w-full appearance-none rounded-lg border border-gray-600 bg-gray-700/50 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm transition;
  }
}
*/
