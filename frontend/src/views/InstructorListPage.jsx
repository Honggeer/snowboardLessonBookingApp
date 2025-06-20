import React, {useState, useEffect, useCallback} from 'react';
import backgroundImageUrl from '../assets/profileBG.png';
import { useNavigate } from 'react-router-dom';
import {instructorService} from "../api/instructorService.js";
import { Star, MapPin, Search, ShieldCheck, Loader, ChevronLeft, ChevronRight, Award } from 'lucide-react';

const GlobalStyles = () => (
    <style>{`
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .text-shadow {
            text-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .filter-select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 0.5rem center;
            background-repeat: no-repeat;
            background-size: 1.5em 1.5em;
            padding-right: 2.5rem;
        }
        .line-clamp-3 { 
            overflow: hidden; 
            display: -webkit-box; 
            -webkit-box-orient: vertical; 
            -webkit-line-clamp: 3; 
        }
    `}</style>
);


// ===================================================================================
// 教练卡片子组件
// ===================================================================================
function InstructorCard({ instructor }) {
    const navigate = useNavigate();
    const handleCardClick = () => {

        navigate(`/instructors/${instructor.userId}`);

    };

    return (
        <div
            onClick={handleCardClick}
            className="glass-card rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer group flex flex-col"
        >
            <div className="pt-16">
                <div className="relative">
                    <img src={instructor.avatarUrl || `https://placehold.co/160x160/e0f2fe/083344/png?text=${instructor.userName.charAt(0)}`} alt={instructor.userName} className="w-32 h-32 mx-auto rounded-full border-4 border-white/80 shadow-lg" />
                </div>
            </div>
            <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 text-shadow">{instructor.userName}</h3>
                <p className="text-md text-blue-600 font-semibold mt-1 text-shadow">{instructor.teachingContent}</p>

                <div className="mt-4 flex justify-center text-gray-700 gap-6">
                    <div className="text-center">
                        <span className="text-xl font-bold text-shadow">{instructor.experienceYears}</span>
                        <p className="text-xs text-gray-500 text-shadow">教龄</p>
                    </div>
                    <div className="border-l border-gray-200"></div>
                    <div className="text-center">
                        <span className="text-xl font-bold flex items-center justify-center gap-1 text-shadow"><Star className="text-yellow-400 fill-current w-5 h-5" />{instructor.rating}</span>
                        <p className="text-xs text-gray-500 text-shadow">评分</p>
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6 flex-grow flex flex-col">
                <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-semibold text-gray-800 mb-2 text-shadow">个人简介</h4>
                    <p className="text-gray-600 text-sm line-clamp-3 text-shadow">{instructor.bio}</p>
                </div>

                <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2 text-shadow">专业认证</h4>
                    <div className="flex flex-wrap gap-2">
                        {/* 修正: 渲染 skill.displayName 并且使用 skill.id 作为 key */}
                        {instructor.skills?.map((skill) => (
                            <span key={skill.id} className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                {skill.displayName}
                             </span>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 text-shadow">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        {/* 修正: 从地点对象中提取 name 属性进行拼接 */}
                        <span>{instructor.locations?.map(loc => loc.displayName).join(', ')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


// ===================================================================================
// 主页面组件
// ===================================================================================
export default function InstructorListPage() {
    // 状态管理
    const [instructors, setInstructors] = useState([]);
    const [filters, setFilters] = useState({ locations: [], certifications: [] });
    const [queryParams, setQueryParams] = useState({
        page: 1,
        pageSize: 9, // 调整为9，方便3列布局
        searchTerm: '',
        locationId: '',
        certificationId: '',
    });
    const [pagination, setPagination] = useState({ total: 0, page: 1, pageSize: 9 });
    const [isLoading, setIsLoading] = useState(true);

    // 【核心修正】: 将useEffect拆分为两个，修正数据获取逻辑

    // Effect 1: 仅在组件首次加载时获取筛选器选项
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [locRes, certRes] = await Promise.all([
                    instructorService.getAvailableResorts(),
                    instructorService.getAvailableSkills(),
                ]);

                // 正确解析后端返回的数据
                setFilters({
                    locations: locRes.data || [],
                    certifications: certRes.data || [],
                });
            } catch (error) {
                console.error("获取筛选条件失败:", error);
            }
        };

        fetchFilters();
    }, []); // 空依赖数组确保此effect只运行一次

    // Effect 2: 仅在queryParams变化时获取教练列表
    useEffect(() => {
        const fetchInstructors = async () => {
            setIsLoading(true);
            try {
                // 过滤掉空的参数，避免发送空字符串到后端
                const activeParams = Object.fromEntries(
                    Object.entries(queryParams).filter(([_, value]) => value !== '' && value !== null)
                );

                const response = await instructorService.getAllInstructors(activeParams);

                if (response.code === 1 && response.data) {
                    setInstructors(response.data.records || []);
                    setPagination({
                        total: response.data.total,
                        page: response.data.page,
                        pageSize: response.data.pageSize,
                    });
                } else {
                    console.error("获取教练列表业务失败:", response.message);
                    setInstructors([]); // 业务失败时清空列表
                }
            } catch (error) {
                console.error("获取教练列表请求失败:", error);
                setInstructors([]); // 请求异常时清空列表
            } finally {
                setIsLoading(false);
            }
        };

        fetchInstructors();
    }, [queryParams]); // 这个effect现在只依赖queryParams


    const handleFilterChange = (key, value) => {
        setQueryParams(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        const totalPages = Math.ceil(pagination.total / pagination.pageSize);
        if (newPage > 0 && newPage <= totalPages) {
            setQueryParams(prev => ({ ...prev, page: newPage }));
        }
    };

    const totalPages = pagination.total > 0 ? Math.ceil(pagination.total / pagination.pageSize) : 1;


    return (
        <>
            <GlobalStyles />
            <div className="min-h-screen" style={{ backgroundImage:`url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 text-shadow">寻找你的滑雪教练</h1>
                        <p className="text-lg text-gray-600 mt-3 text-shadow">在这里发现最适合你的专业滑雪指导</p>

                        <div className="mt-8 max-w-lg mx-auto">
                            <div className="relative">
                                <input type="search" placeholder="按教练名称或教学内容搜索..." value={queryParams.searchTerm} onChange={(e) => handleFilterChange('searchTerm', e.target.value)} className="w-full p-4 pl-12 rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"/>
                                <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            <select id="location-filter" value={queryParams.locationId} onChange={(e) => handleFilterChange('locationId', e.target.value)} className="filter-select w-full p-3 rounded-full border border-gray-300 bg-white/70 backdrop-blur-sm shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value="">所有地点</option>
                                {filters.locations.map(loc => (<option key={loc.id} value={loc.id}>{loc.name}</option>))}
                            </select>
                            <select id="cert-filter" value={queryParams.certificationId} onChange={(e) => handleFilterChange('certificationId', e.target.value)} className="filter-select w-full p-3 rounded-full border border-gray-300 bg-white/70 backdrop-blur-sm shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value="">所有认证</option>
                                {/* 修正: 渲染cert.name */}
                                {filters.certifications.map(cert => (<option key={cert.id} value={cert.id}>{cert.displayName}</option>))}
                            </select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10 flex justify-center items-center gap-3"><Loader className="animate-spin text-blue-500" /><p className="text-gray-700">正在加载教练列表...</p></div>
                    ) : (
                        <>
                            {instructors.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {/* 修正: key 使用 instructor.userId */}
                                    {instructors.map(instructor => ( <InstructorCard key={instructor.userId} instructor={instructor} /> ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-white/70 backdrop-blur-sm rounded-xl"><p className="text-gray-700 font-semibold">没有找到符合条件的教练。</p></div>
                            )}

                            {pagination.total > pagination.pageSize && (
                                <div className="mt-12 flex justify-center items-center gap-4">
                                    <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1} className="p-2 rounded-full bg-white/70 backdrop-blur-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft /></button>
                                    <span className="font-semibold text-gray-700">第 {pagination.page} / {totalPages} 页</span>
                                    <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= totalPages} className="p-2 rounded-full bg-white/70 backdrop-blur-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight /></button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
