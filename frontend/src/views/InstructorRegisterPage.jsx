import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// 假设我们从API获取了所有可选的技能类型
const MOCK_SKILL_TYPES = [
    { skillName: 'CASI_LEVEL_1', displayName: 'CASI 1级' },
    { skillName: 'CASI_LEVEL_2', displayName: 'CASI 2级' },
    { skillName: 'PARK_INSTRUCTOR_1', displayName: '公园教练 1级' },
    { skillName: 'CARVING_INSTRUCTOR_1', displayName: '刻滑教练 1级' },
];

const backgroundImageUrl = 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1964&auto=format&fit=crop';

export default function InstructorRegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        // ...其他基础信息字段
    });

    // 使用一个数组来管理动态添加的技能
    const [skills, setSkills] = useState([
        { skillName: MOCK_SKILL_TYPES[0].skillName, certificateFile: null, certificateUrl: '' }
    ]);

    // ... 其他state ...

    const handleAddSkill = () => {
        setSkills([...skills, { skillName: MOCK_SKILL_TYPES[0].skillName, certificateFile: null, certificateUrl: '' }]);
    };

    const handleSkillChange = (index, field, value) => {
        const newSkills = [...skills];
        newSkills[index][field] = value;
        setSkills(newSkills);
    };

    const handleRemoveSkill = (index) => {
        const newSkills = skills.filter((_, i) => i !== index);
        setSkills(newSkills);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 1. 在这里，您需要先遍历 skills 数组
        // 2. 依次将每个 certificateFile 上传到后端的文件上传接口，获取返回的URL
        // 3. 将返回的URL更新到 skills 状态对应的 certificateUrl 字段
        // 4. 最后，将 formData 和处理好的 skills 数组一起提交给后端的教练注册接口
        console.log("最终提交的数据:", { ...formData, skills });
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
            {/* 背景 */}
            <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
            </div>

            <div className="relative z-10 w-full max-w-4xl p-10 space-y-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white tracking-wider">成为认证教练</h1>
                    <p className="mt-2 text-gray-300">提交您的资料，等待审核，开启您的教学之旅</p>
                </div>

                <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
                    {/* ... 其他基础信息输入框 ... */}

                    {/* 技能认证部分 */}
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-4">技能认证</h2>
                        <div className="space-y-4">
                            {skills.map((skill, index) => (
                                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                                    <select
                                        value={skill.skillName}
                                        onChange={(e) => handleSkillChange(index, 'skillName', e.target.value)}
                                        className="flex-1 input-style"
                                    >
                                        {MOCK_SKILL_TYPES.map(type => (
                                            <option key={type.skillName} value={type.skillName}>{type.displayName}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="file"
                                        onChange={(e) => handleSkillChange(index, 'certificateFile', e.target.files[0])}
                                        className="flex-1 text-white"
                                    />
                                    <button type="button" onClick={() => handleRemoveSkill(index)} className="text-red-500 hover:text-red-400">&times;</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={handleAddSkill} className="mt-4 text-cyan-400 hover:text-cyan-300">+ 添加更多技能</button>
                    </div>

                    <button type="submit" className="w-full submit-button">提交审核</button>
                </form>
                {/* ... 返回登录链接 ... */}
            </div>
        </div>
    );
}
