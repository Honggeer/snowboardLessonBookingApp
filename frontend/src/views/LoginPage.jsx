import React, { useState } from 'react';

import { loginApi } from '../api/user';

import backgroundImageUrl from '../assets/login_BG.png';

// 登录页面组件
export default function LoginPage() {
    // 使用React Hooks来管理表单输入的状态
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // 用于显示错误信息
    const [isLoading, setIsLoading] = useState(false);
    // 表单提交处理函数 (目前是占位逻辑)
    const handleSubmit = async (e) => {
        e.preventDefault(); // 阻止浏览器默认的表单提交行为
        setError('');

        if (!email || !password) {
            setError('邮箱和密码不能为空。');
            return;
        }

        setIsLoading(true)// 开始登录，设置加载状态为true

        try {
            // 3. 调用后端API
            const response = await loginApi({email, password});

            // 4. 根据后端返回的Result<T>对象进行判断
            if (response.data.code === 1) {
                // 登录成功
                const userData = response.data.data;
                console.log('登录成功!', userData);
                alert(`欢迎回来, ${userData.firstName}! 您的Token是: ${userData.token}`);
                // TODO: 在这里处理登录成功后的逻辑
                // 例如：将token存入localStorage，然后跳转到主页
                // localStorage.setItem('token', userData.token);
                // window.location.href = '/dashboard';
            } else {
                // 登录失败，显示后端返回的错误信息
                setError(response.data.msg || '登录失败，请稍后再试。');
            }
        } catch (err) {
            // 捕获网络错误或服务器500等错误
            console.error('登录请求失败:', err);
            setError(err.response?.data?.msg || '网络错误，请检查您的连接。');
        } finally {
            setIsLoading(false); // 结束登录，设置加载状态为false
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-900">
            {/* 背景图片 */}
            <div
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
                style={{
                    backgroundImage: `url(${backgroundImageUrl})`,
                }}
            >
                {/* 背景遮罩层 */}
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
            </div>

            {/* 登录表单容器 */}
            <div className="relative z-10 w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white tracking-wider">
                        欢迎回来
                    </h1>
                    <p className="mt-2 text-gray-300">
                        登录您的账户，开始新的滑雪课程
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* 错误信息提示 */}
                    {error && (
                        <div className="p-3 bg-red-500/30 text-red-200 border border-red-500/50 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="rounded-md shadow-sm -space-y-px">
                        {/* 邮箱输入框 */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="relative block w-full appearance-none rounded-lg border border-gray-600 bg-gray-700/50 px-3 py-3 pl-10 text-white placeholder-gray-400 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm transition"
                                placeholder="邮箱地址"
                            />
                        </div>

                        {/* 密码输入框 */}
                        <div className="relative pt-4">
                            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 pt-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="relative block w-full appearance-none rounded-lg border border-gray-600 bg-gray-700/50 px-3 py-3 pl-10 text-white placeholder-gray-400 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm transition"
                                placeholder="密码"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-500 bg-gray-600 text-cyan-500 focus:ring-cyan-600"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-gray-300">
                                记住我
                            </label>
                        </div>

                        <div >
                            <a href="#" className="font-medium text-cyan-400 hover:text-cyan-300">
                                忘记密码?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 py-3 px-4 text-sm font-semibold text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out"
                        >
                            登录
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    还没有账户?{' '}
                    <a href="#" className="font-medium text-cyan-400 hover:text-cyan-300">
                        立即注册
                    </a>
                </p>
            </div>
        </div>
    );
}
