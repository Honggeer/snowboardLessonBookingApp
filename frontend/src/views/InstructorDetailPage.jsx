import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { instructorService } from '../api/instructorService';
import {
    LoaderCircle,
    Calendar,
    Clock,
    MapPin,
    AlertCircle,
    UserRound,
    Sparkles,
    Star,
    Award,
    ShieldCheck,
    ExternalLink,
    X,
    Mail,
    Phone,
    Contact
} from 'lucide-react';
import defaultAvatar from '../assets/DefaultAvatar.png';
import backgroundImageUrl from '../assets/profileBG.png';

// ===================================================================================
// 辅助组件：全局样式和模态框
// ===================================================================================

const GlobalStyles = () => (
    <style>{`
    /* 亮色毛玻璃主题 */
    /* 【样式更新】调整背景透明度以匹配列表页 */
    .profile-card-light { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); }
    .form-input-light { background-color: rgba(255, 255, 255, 0.8); border: 1px solid #d1d5db; color: #111827; }
    .form-input-light:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3); }
    .tag-base-light { background: rgba(229, 231, 235, 0.7); border: 1px solid rgba(209, 213, 219, 0.8); color: #374151; }
    .modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 50; transition: opacity 0.3s ease; }
    .modal-content { background: #1e293b; border-radius: 1rem; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; transition: transform 0.3s ease; }
  `}</style>
);

const ImageModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt="放大图片" className="object-contain max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl" />
                <button onClick={onClose} className="absolute -top-3 -right-3 bg-white text-black rounded-full p-1.5 shadow-lg hover:scale-110 transition-transform">
                    <X size={24} />
                </button>
            </div>
        </div>
    );
};

const SkillDetailModal = ({ skill, onClose }) => {
    if (!skill) return null;
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('zh-CN') : 'N/A';
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content text-white p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{skill.displayName} - 认证详情</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X/></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">证书预览:</h3>
                        <a href={skill.certificateUrl} target="_blank" rel="noopener noreferrer" className="block border border-gray-600 rounded-lg overflow-hidden">
                            <img src={skill.certificateUrl} alt={`${skill.displayName} 证书`} className="w-full h-auto object-contain max-h-64"/>
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-700/50 p-3 rounded-lg"><strong className="block text-gray-400">认证状态:</strong> <span className={`font-semibold ${skill.status === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{skill.status}</span></div>
                        <div className="bg-slate-700/50 p-3 rounded-lg"><strong className="block text-gray-400">审核日期:</strong> {formatDate(skill.approvedAt)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ===================================================================================
// 主页面组件
// ===================================================================================
export default function InstructorDetailPage() {
    const { id } = useParams();
    const [instructor, setInstructor] = useState(null);
    const [availability, setAvailability] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);
    const [error, setError] = useState('');

    const [imageToView, setImageToView] = useState(null);
    const [skillToView, setSkillToView] = useState(null);

    useEffect(() => {
        const fetchInstructorProfile = async () => {
            setIsLoading(true);
            try {
                const instructorProfile = await instructorService.getInstructorDetail(id);
                setInstructor(instructorProfile);
            } catch (err) {
                setError("无法加载教练信息，请检查ID或网络连接。");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchInstructorProfile();
    }, [id]);

    useEffect(() => {
        if (!selectedDate || !id) return;
        const fetchAvailability = async () => {
            setIsAvailabilityLoading(true);
            try {
                const data = await instructorService.getInstructorAvailability(id, selectedDate);
                setAvailability(data);
            } catch (err) {
                console.error(err);
                setAvailability({ availableSlots: [], lockedInResort: null });
            } finally {
                setIsAvailabilityLoading(false);
            }
        };
        fetchAvailability();
    }, [selectedDate, id]);

    if (isLoading) return <div className="min-h-screen w-full flex items-center justify-center bg-gray-100"><LoaderCircle className="animate-spin mr-2" /> 正在加载教练资料...</div>;
    if (error) return <div className="min-h-screen w-full flex items-center justify-center text-red-500">{error}</div>;
    if (!instructor) return <div className="min-h-screen w-full flex items-center justify-center">未找到教练信息。</div>;

    return (
        <>
            <GlobalStyles />
            <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-100 text-gray-800" style={{ backgroundImage: `url('${backgroundImageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>

                <div className="profile-card-light w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">

                    {/* --- 教练头部信息 --- */}
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <img
                                src={instructor.avatarUrl || defaultAvatar}
                                alt={instructor.userName}
                                className="w-40 h-40 rounded-full border-4 border-white bg-gray-200 object-cover flex-shrink-0 shadow-lg cursor-pointer transform hover:scale-105 transition-transform"
                                onClick={() => setImageToView(instructor.avatarUrl || defaultAvatar)}
                            />
                            <div className="flex-grow text-center md:text-left">
                                <h1 className="text-4xl font-bold text-gray-900">{instructor.userName}</h1>
                                <p className="text-lg text-blue-600 font-medium mt-1">{instructor.teachingContent}</p>

                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4">
                                    <div className="flex items-center gap-2 bg-white/60 border border-gray-200 px-3 py-2 rounded-lg"><Award className="text-green-500" size={20} /><span className="text-gray-900 font-semibold text-lg">{instructor.experienceYears}</span><span className="text-gray-500 text-sm">年经验</span></div>
                                    <div className="flex items-center gap-2 bg-white/60 border border-gray-200 px-3 py-2 rounded-lg"><Star className="text-yellow-400" size={20} /><span className="text-gray-900 font-semibold text-lg">{instructor.rating}</span><span className="text-gray-500 text-sm">/ 5.0 评分</span></div>
                                </div>
                            </div>
                        </div>

                        {/* --- 个人简介、技能和地点 --- */}
                        <div className="mt-10 space-y-8">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><UserRound size={20} className="text-gray-500" />个人简介</h2>
                                <p className="text-gray-700 leading-relaxed">{instructor.bio}</p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><Sparkles size={20} className="text-gray-500" />专业技能</h2>
                                <div className="flex flex-wrap gap-3">
                                    {instructor.skills?.map(skill => (
                                        <button
                                            key={skill.id}
                                            onClick={() => setSkillToView(skill)}
                                            className="bg-green-100 text-green-800 border border-green-200 font-medium py-2 px-4 rounded-full flex items-center gap-2 transition-colors hover:bg-green-200"
                                        >
                                            {skill.displayName}
                                            {skill.status === 'APPROVED' && <ShieldCheck size={16} className="text-green-600" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2"><MapPin size={20} className="text-gray-500" />授课地点</h2>
                                <div className="flex flex-wrap gap-3">
                                    {instructor.locations?.map((location) =>
                                        location.websiteUrl ? (
                                            <a
                                                key={location.id}
                                                href={location.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="tag-base-light font-medium py-2 px-4 rounded-full flex items-center gap-2 transition-colors hover:bg-gray-300 hover:text-blue-600"
                                            >
                                                {location.displayName}
                                                <ExternalLink size={14} className="opacity-60" />
                                            </a>
                                        ) : (
                                            <span key={location.id} className="tag-base-light font-medium py-2 px-4 rounded-full flex items-center gap-2">
                                                {location.displayName}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"><Contact size={20} className="text-gray-500" />联系方式</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 text-gray-700">
                                        <Mail size={20} className="text-gray-500 flex-shrink-0" />
                                        <span>{instructor.email}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-700">
                                        <Phone size={20} className="text-gray-500 flex-shrink-0" />
                                        <span>{instructor.phoneNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- 预约模块 --- */}
                    <div className="bg-gray-50/70 px-8 py-6 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3"><Calendar size={22}/> 预约课程</h2>

                        <div className="mb-6">
                            <label htmlFor="booking-date" className="block text-sm font-medium text-gray-700 mb-2">请选择上课日期</label>
                            <input
                                type="date"
                                id="booking-date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="form-input-light w-full md:w-72 p-3 rounded-lg shadow-sm"
                            />
                        </div>

                        {isAvailabilityLoading ? (
                            <div className="flex items-center gap-3 text-gray-600"><LoaderCircle className="animate-spin text-blue-500" /><span>正在查询...</span></div>
                        ) : (
                            <div>
                                {availability?.lockedInResort && (
                                    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md mb-4 flex items-center gap-3">
                                        <MapPin />
                                        <p>今日授课地点已锁定在：<strong className="font-semibold">{availability.lockedInResort.name}</strong></p>
                                    </div>
                                )}

                                <h3 className="font-semibold text-gray-800 mb-3">可选时间段:</h3>
                                <div className="flex flex-wrap gap-4">
                                    {availability?.availableSlots?.length > 0 ? (
                                        availability.availableSlots.map(slot => (
                                            <button key={slot.availabilityId} className="flex items-center gap-2 bg-green-500 text-white font-bold py-3 px-5 rounded-lg shadow hover:bg-green-600 transition-colors transform hover:scale-105">
                                                <Clock size={16} />
                                                {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                -
                                                {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">抱歉，该日期没有可预约的时间。</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- 模态框渲染区 --- */}
            <ImageModal imageUrl={imageToView} onClose={() => setImageToView(null)} />
            <SkillDetailModal skill={skillToView} onClose={() => setSkillToView(null)} />
        </>
    );
}
