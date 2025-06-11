import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerInstructorApi } from '../api/user.js'; // 真实的API函数
import { uploadFileApi } from '../api/upload.js'; // 真实的API函数
import { getSkillTypesApi } from '../api/skills.js'; // 真实的API函数

// --- 为了方便您独立测试前端，我们先用模拟(Mock)的API函数 ---

// --- 模拟函数结束 ---

// 使用一张新的、充满活力的单板背景图
import backgroundImageUrl from '../assets/InstructorRegisterPage_BG.png';
// 可复用的带图标输入框组件
const InputWithIcon = ({ icon, id, ...props }) => (
    <div>
        <label htmlFor={id} className="sr-only">{props.placeholder}</label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">{icon}</div>
            <input id={id} {...props} className="relative block w-full appearance-none rounded-lg border border-gray-600 bg-gray-700/50 px-3 py-3 pl-10 text-white placeholder-gray-400 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm transition" />
        </div>
    </div>
);

// 可复用的文件上传组件
const FileInput = ({ id, label, file, onChange, error }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${error ? 'border-red-500' : 'border-gray-600'} border-dashed rounded-md`}>
            <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div className="flex text-sm text-gray-400">
                    <label htmlFor={id} className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-cyan-500 px-1">
                        <span>上传文件</span>
                        <input id={id} name={id} type="file" className="sr-only" onChange={onChange} />
                    </label>
                    <p className="pl-1">或拖拽到此处</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, up to 5MB</p>
                {file && <p className="text-sm text-green-400 mt-2 truncate w-40">{file.name}</p>}
                {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
            </div>
        </div>
    </div>
);


export default function InstructorRegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '', password: '', confirmPassword: '', userName: '', phoneNumber: '', idCardFile: null
    });
    const [skills, setSkills] = useState([]);
    const [availableSkills, setAvailableSkills] = useState([]);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 在组件加载时获取所有可选技能
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await getSkillTypesApi();
                if (response.data.code === 1) {
                    setAvailableSkills(response.data.data);
                    // 默认添加一个技能栏
                    if (response.data.data.length > 0) {
                        setSkills([{ skillName: response.data.data[0].skillName, certificateFile: null, certificateUrl: '' }]);
                    }
                }
            } catch (err) {
                setError("无法加载技能列表，请刷新页面。");
            }
        };
        fetchSkills();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFileChange = (file, field, skillIndex = null) => {
        if (!file) return;
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_SIZE) {
            setError(`文件大小不能超过 5MB`);
            return;
        }
        setError('');
        if (skillIndex !== null) {
            const newSkills = [...skills];
            newSkills[skillIndex][field] = file;
            setSkills(newSkills);
        } else {
            setFormData(prevState => ({ ...prevState, [field]: file }));
        }
    };

    const handleAddSkill = () => {
        if (availableSkills.length > 0) {
            setSkills([...skills, { skillName: availableSkills[0].skillName, certificateFile: null }]);
        }
    };

    const handleRemoveSkill = (index) => setSkills(skills.filter((_, i) => i !== index));

    const handleSkillNameChange = (index, value) => {
        const newSkills = [...skills];
        newSkills[index]['skillName'] = value;
        setSkills(newSkills);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // 前端验证
            if (formData.password.length < 8) {
                throw new Error("密码长度不能少于8个字符。");
            }
            if (!formData.idCardFile) throw new Error("请上传身份证照片。");
            if (formData.password !== formData.confirmPassword) throw new Error("两次输入的密码不一致。");

            // 1. 上传身份证
            const idCardUploadRes = await uploadFileApi(formData.idCardFile);
            if (idCardUploadRes.data.code !== 1) throw new Error("身份证上传失败。");

            // 2. 并行上传所有技能证书
            const uploadPromises = skills.map(skill => {
                if (!skill.certificateFile) throw new Error(`请为技能 ${skill.skillName} 上传证书。`);
                return uploadFileApi(skill.certificateFile);
            });
            const uploadResults = await Promise.all(uploadPromises);

            // 3. 准备最终提交的数据
            const finalSkills = skills.map((skill, index) => {
                const result = uploadResults[index];
                if (result.data.code !== 1) throw new Error(`证书 ${skill.skillName} 上传失败。`);
                return { skillName: skill.skillName, certificateUrl: result.data.data };
            });

            const { idCardFile, confirmPassword, ...basicInfo } = formData;
            const payload = { ...basicInfo, idCardUrl: idCardUploadRes.data.data, skills: finalSkills };

            // 4. 提交注册
            const registerResponse = await registerInstructorApi(payload);
            if (registerResponse.data.code === 1) {
                setSuccess('注册申请已提交成功，请等待管理员审核！3秒后将跳转到登录页面...');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(registerResponse.data.msg || '注册失败。');
            }

        } catch (err) {
            setError(err.message || '发生未知错误。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
            <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
            </div>

            <div className="relative z-10 w-full max-w-4xl p-10 space-y-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white tracking-wider">成为认证教练</h1>
                    <p className="mt-2 text-gray-300">提交您的资料，等待审核，开启您的教学之旅</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="p-3 bg-red-500/30 text-red-200 border border-red-500/50 rounded-lg text-center">{error}</div>}
                    {success && <div className="p-3 bg-green-500/30 text-green-200 border border-green-500/50 rounded-lg text-center">{success}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        <InputWithIcon icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>} id="userName" name="userName" type="text" required value={formData.userName} onChange={handleChange} placeholder="用户名 (Username)" />
                        <InputWithIcon icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400"><path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.067a1.5 1.5 0 01-1.465 1.825H4.21a1.5 1.5 0 01-1.228-2.318l.38-1.522zM17.5 2a1.5 1.5 0 011.5 1.5v13a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 011 16.5v-13A1.5 1.5 0 012.5 2h15z" /></svg>} id="phoneNumber" name="phoneNumber" type="tel" required value={formData.phoneNumber} onChange={handleChange} placeholder="电话号码" />
                        <div className="md:col-span-2"><InputWithIcon icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>} id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="邮箱地址" /></div>
                        <InputWithIcon icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>} id="password" name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="密码" />
                        <InputWithIcon icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>} id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} placeholder="确认密码" />
                        <div className="md:col-span-2"><FileInput id="idCardFile" label="上传ID照片" file={formData.idCardFile} onChange={(e) => handleFileChange(e.target.files[0], 'idCardFile')} /></div>
                    </div>

                    <div className="pt-4">
                        <h2 className="text-xl font-semibold text-white mb-4">技能认证</h2>
                        <div className="space-y-4">
                            {skills.map((skill, index) => (
                                <div key={index} className="relative grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-gray-800/50 rounded-lg">
                                    <select value={skill.skillName} onChange={(e) => handleSkillNameChange(index, e.target.value)} className="relative block w-full appearance-none rounded-lg border border-gray-600 bg-gray-700/50 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm transition">
                                        {availableSkills.map(type => (<option key={type.skillName} value={type.skillName}>{type.displayName}</option>))}
                                    </select>
                                    <div className="md:col-span-2"><FileInput id={`skill-cert-${index}`} label={`上传 ${availableSkills.find(s => s.skillName === skill.skillName)?.displayName || ''} 证书`} file={skill.certificateFile} onChange={(e) => handleFileChange(e.target.files[0], 'certificateFile', index)} /></div>
                                    {skills.length > 1 && (<button type="button" onClick={() => handleRemoveSkill(index)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-700 transition-colors">&times;</button>)}
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={handleAddSkill} className="mt-4 text-cyan-400 hover:text-cyan-300 font-medium">+ 添加更多技能认证</button>
                    </div>

                    <div className="pt-4"><button type="submit" disabled={isLoading} className="group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 py-3 px-4 text-sm font-semibold text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? '正在提交...' : '提交审核'}</button></div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">已经有账户了?{' '}<Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300">返回登录</Link></p>
            </div>
        </div>
    );
}
