import React, { useState, useEffect, useMemo } from 'react';
import { Star, Award, MapPin, Search, ShieldCheck } from 'lucide-react';
import backgroundImageUrl from '../assets/profileBG.png';
// ===================================================================================
// 模拟API服务和数据 (当您的后端完成后，可以替换这部分)
// ===================================================================================

const mockInstructors = [
    { id: 1, userName: "王教练 (Alex Wang)", teachingContent: "首席滑雪顾问", avatarUrl: "https://placehold.co/160x160/e0f2fe/083344/png?text=头像1", experienceYears: 10, rating: 4.9, bio: "拥有超过10年的专业滑雪指导经验，专注于高山滑雪技巧、野雪探险和儿童滑雪教学。", skills: ["CASI 2级", "野雪向导"], locations: ["崇礼万龙", "北京南山"] },
    { id: 2, userName: "李教练 (Lily Li)", teachingContent: "儿童单板启蒙专家", avatarUrl: "https://placehold.co/160x160/e0f2fe/083344/png?text=头像2", experienceYears: 8, rating: 4.8, bio: "耐心与亲和力是我的标签，尤其擅长引导零基础的儿童和女性学员。", skills: ["NZSIA 1级", "儿童教学专家"], locations: ["松花湖", "北大壶"] },
    { id: 3, userName: "张教练 (David Zhang)", teachingContent: "自由式技巧大神", avatarUrl: "https://placehold.co/160x160/e0f2fe/083344/png?text=头像3", experienceYears: 12, rating: 5.0, bio: "热衷于挑战极限，精通各类公园道具和跳台动作。如果你想在雪上飞翔，找我没错！", skills: ["CASI 公园1级"], locations: ["亚布力", "可可托海"] },
    { id: 4, userName: "陈教练 (Sara Chen)", teachingContent: "全能滑行导师", avatarUrl: "https://placehold.co/160x160/e0f2fe/083344/png?text=头像4", experienceYears: 9, rating: 4.9, bio: "无论是刻滑还是小回转，我都能帮你找到最高效、最优美的滑行方式。", skills: ["CASI 1级", "CASI 2级"], locations: ["崇礼万龙", "松花湖"] },
];

const mockFilters = {
    locations: ["崇礼万龙", "松花湖", "北大壶", "亚布力", "可可托海"],
    certifications: ["CASI 1级", "CASI 2级", "NZSIA", "CASI 公园1级", "野雪向导", "儿童教学专家"],
};

const instructorService = {
    getAllInstructors: async () => {
        await new Promise(res => setTimeout(res, 500));
        return { code: 1, data: mockInstructors };
    },
    getFilters: async () => {
        await new Promise(res => setTimeout(res, 200));
        return { code: 1, data: mockFilters };
    }
};

// ===================================================================================
// 全局样式 (为了提升可读性，调整了毛玻璃效果和添加了文字阴影)
// ===================================================================================
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
    `}</style>
);


// ===================================================================================
// 教练卡片子组件
// ===================================================================================
function InstructorCard({ instructor }) {
    // const navigate = useNavigate();

    const handleCardClick = () => {
        console.log(`Navigating to profile of instructor ID: ${instructor.id}`);
        // navigate(`/instructor/${instructor.id}`);
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
                        {instructor.skills.map((skill, index) => (
                            <span key={index} className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                {skill}
                             </span>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 text-shadow">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{instructor.locations.join(', ')}</span>
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
    const [allInstructors, setAllInstructors] = useState([]);
    const [filters, setFilters] = useState({ locations: [], certifications: [] });
    const [activeLocation, setActiveLocation] = useState('all');
    const [activeCertification, setActiveCertification] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [instructorsRes, filtersRes] = await Promise.all([
                    instructorService.getAllInstructors(),
                    instructorService.getFilters()
                ]);
                if (instructorsRes.code === 1) setAllInstructors(instructorsRes.data);
                if (filtersRes.code === 1) setFilters(filtersRes.data);
            } catch (error) {
                console.error("获取页面数据失败:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredInstructors = useMemo(() => {
        return allInstructors.filter(instructor => {
            const matchesSearchTerm = instructor.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                instructor.teachingContent.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLocation = activeLocation === 'all' || instructor.locations.includes(activeLocation);
            const matchesCertification = activeCertification === 'all' || instructor.skills.includes(activeCertification);
            return matchesSearchTerm && matchesLocation && matchesCertification;
        });
    }, [allInstructors, searchTerm, activeLocation, activeCertification]);


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
                                <input
                                    type="search"
                                    placeholder="按教练名称或教学内容搜索..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-4 pl-12 rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                />
                                <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            <div>
                                <label htmlFor="location-filter" className="sr-only">按地点筛选</label>
                                <select
                                    id="location-filter"
                                    value={activeLocation}
                                    onChange={(e) => setActiveLocation(e.target.value)}
                                    className="filter-select w-full p-3 rounded-full border border-gray-300 bg-white/70 backdrop-blur-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">所有地点</option>
                                    {filters.locations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="cert-filter" className="sr-only">按认证筛选</label>
                                <select
                                    id="cert-filter"
                                    value={activeCertification}
                                    onChange={(e) => setActiveCertification(e.target.value)}
                                    className="filter-select w-full p-3 rounded-full border border-gray-300 bg-white/70 backdrop-blur-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">所有认证</option>
                                    {filters.certifications.map(cert => (
                                        <option key={cert} value={cert}>{cert}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10"><p className="text-gray-700">正在加载教练列表...</p></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredInstructors.map(instructor => (
                                <InstructorCard key={instructor.id} instructor={instructor} />
                            ))}
                        </div>
                    )}
                    {!isLoading && filteredInstructors.length === 0 && (
                        <div className="text-center py-10 bg-white/70 backdrop-blur-sm rounded-xl">
                            <p className="text-gray-700 font-semibold">没有找到符合条件的教练。</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

