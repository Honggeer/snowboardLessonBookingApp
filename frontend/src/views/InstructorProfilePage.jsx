import React, {useState, useEffect, useCallback} from 'react';
import {
    Edit3,
    Check,
    UserRound,
    Sparkles,
    MapPin,
    Contact,
    Mail,
    Phone,
    Award,
    Star,
    LoaderCircle,
    PlusCircle,
    ShieldCheck,
    Clock,
    ShieldX,
    ExternalLink
} from 'lucide-react';
import { uploadFileApi } from '../api/upload.js';
import backgroundImageUrl from '../assets/profileBG.png';
import bannerUrl from '../assets/LOGOBanner.png';
import defaultAvatar from '../assets/DefaultAvatar.png';
import {instructorService} from "../api/instructorService.js";

// 模拟从API获取的初始数据

// 全局样式组件
const GlobalStyles = () => (
    <style>{`
    body { font-family: 'Inter', sans-serif; }
    .profile-card { background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.15); }
    .edit-btn { background: linear-gradient(90deg, #3b82f6, #8b5cf6); }
    .edit-btn:hover {
      box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
    }
    .tag-base { background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.5); }
    .tag-base:hover {
      background: rgba(59, 130, 246, 0.4);
    }
    .form-input { background-color: rgba(30, 41, 59, 0.9); border: 1px solid #4a5568; }
    .form-input:focus { outline: none; border-color: #8b5cf6; box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.4); }
    .modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 50; }
    .modal-content { background: #1e293b; border-radius: 1rem; padding: 2rem; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
    .add-skill-btn { background-color: rgba(59, 130, 246, 0.2); border: 1px dashed rgba(59, 130, 246, 0.7); color: #93c5fd; }
    .add-skill-btn:hover { background-color: rgba(59, 130, 246, 0.3); border-color: rgba(59, 130, 246, 1); }
  `}</style>
);
function EditProfileModal({ isOpen, onClose, onSaveSuccess,profileData}) {
    const [editData, setEditData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (profileData && isOpen) {

            const skillDisplayNames = profileData.skills?.map(skillVO => skillVO.displayName) || [];

            setEditData({
                ...profileData,
                skills: skillDisplayNames, // 在编辑状态中, skills现在是一个由displayName组成的字符串数组
            });
        }
    }, [profileData, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const finalValue = e.target.type === 'number' ? parseInt(value, 10) || 0 : value;
        setEditData(prev => ({ ...prev, [name]: finalValue }));
    };


    const handleSave = async () => {
        setIsSaving(true);
        try {
            // 发送给后端的 `editData.skills` 是一个字符串数组
            const responseWrapper = await instructorService.updateProfile(editData);
            if (responseWrapper && responseWrapper.code === 1) {
                onSaveSuccess();
                onClose();
            } else {
                throw new Error(responseWrapper.message || '保存失败');
            }
        } catch (err) {
            alert(`保存失败: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content text-white">
                <h2 className="text-2xl font-bold mb-6">编辑个人资料</h2>
                <div className="space-y-4">
                    <div><label>用户名</label><input type="text" name="userName" value={editData?.userName || ''} onChange={handleInputChange} className="form-input w-full p-2 mt-1 rounded-md" /></div>
                    <div><label>教学内容</label><input type="text" name="teachingContent" value={editData?.teachingContent || ''} onChange={handleInputChange} className="form-input w-full p-2 mt-1 rounded-md" /></div>
                    <div><label>执教年限</label><input type="number" name="experienceYears" value={editData?.experienceYears || 0} onChange={handleInputChange} className="form-input w-full p-2 mt-1 rounded-md" /></div>
                    <div><label>个人简介</label><textarea name="bio" value={editData?.bio || ''} onChange={handleInputChange} className="form-input w-full h-24 p-2 mt-1 rounded-md"></textarea></div>
                    <div><label>邮箱</label><input type="email" name="email" value={editData?.email || ''} onChange={handleInputChange} className="form-input w-full p-2 mt-1 rounded-md" /></div>
                    <div><label>电话</label><input type="tel" name="phoneNumber" value={editData?.phoneNumber || ''} onChange={handleInputChange} className="form-input w-full p-2 mt-1 rounded-md" /></div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                    <button onClick={onClose} disabled={isSaving} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg">取消</button>
                    <button onClick={handleSave} disabled={isSaving} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg flex items-center">
                        {isSaving ? <LoaderCircle className="animate-spin mr-2" /> : <Check size={16} className="mr-2" />}
                        保存
                    </button>
                </div>
            </div>
        </div>
    );
}
function AddSkillModal({ isOpen, onClose, onSkillAdded }) {
    const [availableSkills, setAvailableSkills] = useState([]);
    const [selectedSkillName, setSelectedSkillName] = useState('');
    const [certificateFile, setCertificateFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // 弹窗打开时，获取可选技能列表
            const fetchSkills = async () => {
                try {
                    const response = await instructorService.getAvailableSkills();
                    if (response.code === 1 && Array.isArray(response.data)) {
                        setAvailableSkills(response.data);
                    }
                } catch (error) {
                    console.error("获取技能列表失败:", error);
                    alert("无法加载技能列表，请稍后重试。");
                }
            };
            fetchSkills();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!selectedSkillName || !certificateFile) {
            alert('请选择技能并上传证书文件。');
            return;
        }
        setIsSubmitting(true);
        const uploadRes = await uploadFileApi(certificateFile);
        if (uploadRes.data.code !== 1) throw new Error("证书上传失败。");

        const certificateUrl = uploadRes.data.data;

        // 步骤 2: 构造JSON数据并提交技能认证
        const skillData = {
            skillName: selectedSkillName,
            certificateUrl: certificateUrl,
        };

        try {
            const responseWrapper = await instructorService.addSkillCertification(skillData);
            if (responseWrapper.data && responseWrapper.data.code === 1) {
                alert('提交成功，等待审核！');
                onSkillAdded();
                onClose();
            } else {
                throw new Error(responseWrapper.message || '提交失败');
            }
        } catch (err) {
            alert(`提交失败: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop"><div className="modal-content text-white">
            <h2 className="text-2xl font-bold mb-6">申请技能认证</h2>
            <div className="space-y-4">
                <div>
                    <label>技能名称</label>
                    <select value={selectedSkillName} onChange={(e) => setSelectedSkillName(e.target.value)} className="form-input w-full p-2 mt-1 rounded-md">
                        <option value="" disabled>-- 请选择一项技能 --</option>
                        {/* 假设/api/skills返回的数组中每个对象有id和name属性 */}
                        {availableSkills.map(skill => (
                            <option key={skill.skillName} value={skill.skillName}>{skill.displayName}</option>
                        ))}
                    </select>
                </div>
                <div><label>上传证书文件</label><input type="file" onChange={(e) => setCertificateFile(e.target.files[0])} className="form-input w-full p-2 mt-1 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/></div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
                <button onClick={onClose} disabled={isSubmitting} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg">取消</button>
                <button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg flex items-center">{isSubmitting ? <LoaderCircle className="animate-spin mr-2" /> : <Check size={16} className="mr-2" />}提交审核</button>
            </div>
        </div></div>
    );
}
function EditLocationsModal({ isOpen, onClose, onSaveSuccess, currentLocations }) {
    const [allResorts, setAllResorts] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchResorts = async () => {
                try {
                    const response = await instructorService.getAvailableResorts();
                    if (response.code === 1 && Array.isArray(response.data)) {
                        setAllResorts(response.data);
                        // 初始化已选中的地点
                        // 假设 /api/resorts 返回 [{id: 1, name: '万龙'}, ...]
                        // 而 currentLocations 是 ['万龙', '南山']
                        const currentIds = new Set();
                        response.data.forEach(resort => {
                            if (currentLocations.includes(resort.name)) {
                                currentIds.add(resort.id);
                            }
                        });
                        setSelectedIds(currentIds);
                    }
                } catch (error) {
                    console.error("获取雪场列表失败:", error);
                    alert("无法加载雪场列表，请稍后重试。");
                }
            };
            fetchResorts();
        }
    }, [isOpen, currentLocations]);

    if (!isOpen) return null;

    const handleCheckboxChange = (resortId, isChecked) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (isChecked) {
                newSet.add(resortId);
            } else {
                newSet.delete(resortId);
            }
            return newSet;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        const locationUpdateDTO = { resortIds: Array.from(selectedIds) };
        try {
            const response = await instructorService.updateMyLocations(locationUpdateDTO);
            if (response && response.code === 1) {
                onSaveSuccess();
                onClose();
            } else {
                throw new Error(response.message || "更新地点失败");
            }
        } catch (err) {
            alert(`保存失败: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content text-white">
                <h2 className="text-2xl font-bold mb-6">编辑授课地点</h2>
                <div className="space-y-2 grid grid-cols-2 md:grid-cols-3 gap-4">{allResorts.map(resort => (<div key={resort.id} className="flex items-center">
                    <input type="checkbox" id={`resort-${resort.id}`} checked={selectedIds.has(resort.id)} onChange={(e) => handleCheckboxChange(resort.id, e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <label htmlFor={`resort-${resort.id}`} className="ml-2">{resort.name}</label>
                </div>))}
                </div>
                <div className="flex justify-end gap-4 mt-8">
                    <button onClick={onClose} disabled={isSaving} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg">取消</button>
                    <button onClick={handleSave} disabled={isSaving} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg flex items-center">{isSaving ? <LoaderCircle className="animate-spin mr-2" /> : <Check size={16} className="mr-2" />}保存</button>
                </div>
            </div>
        </div>);

}
function SkillDetailModal({ isOpen, onClose, skill }) {
    if (!isOpen || !skill) return null;
    const formatDate = (dateString) => { if (!dateString) return 'N/A'; return new Date(dateString).toLocaleString('zh-CN'); };
    return (<div className="modal-backdrop"><div className="modal-content text-white"><h2 className="text-2xl font-bold mb-6">{skill.displayName} - 详情</h2><div className="space-y-4"><div><h3 className="font-semibold mb-2">证书预览:</h3><a href={skill.certificateUrl} target="_blank" rel="noopener noreferrer" className="block border border-gray-600 rounded-lg overflow-hidden"><img src={skill.certificateUrl} alt={`${skill.displayName} 证书`} className="w-full h-auto object-contain max-h-64"/></a><a href={skill.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mt-2 inline-flex items-center gap-2">查看原图 <ExternalLink size={16}/></a></div><div className="grid grid-cols-2 gap-4"><div><strong className="block text-gray-400">认证状态:</strong> {skill.status}</div><div><strong className="block text-gray-400">提交时间:</strong> {formatDate(skill.submittedAt)}</div><div><strong className="block text-gray-400">审核时间:</strong> {formatDate(skill.approvedAt)}</div></div></div><div className="flex justify-end gap-4 mt-8"><button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg">关闭</button></div></div></div>);
}
export default function InstructorProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
    const [isEditLocationsModalOpen, setIsEditLocationsModalOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const fetchProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            const responseWrapper = await instructorService.getProfile();
            if (responseWrapper && responseWrapper.code === 1 && responseWrapper.data) {
                const profile = responseWrapper.data;
                profile.skills = profile.skills || [];
                profile.locations = profile.locations || [];
                setProfileData(profile);
            } else {
                throw new Error(responseWrapper.message || '获取的数据格式不正确');
            }
        } catch (err) {
            setError("无法加载教练信息，请稍后再试。");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleSkillClick = async (skillVO) => {
        if (skillVO.status === 'REJECTED') {
            if (window.confirm(`您确定要删除这个被拒绝的技能认证'${skillVO.displayName}'吗？`)) {
                try {
                    await instructorService.deleteSkillCertification(skillVO.id);
                    alert("删除成功！");
                    fetchProfile();
                } catch (err) { alert(`删除失败: ${err.message}`); }
            }
        } else {
            setSelectedSkill(skillVO);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white"><LoaderCircle className="animate-spin mr-2" /> 正在加载...</div>;
    }
    if (error) {
        return <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-red-400">{error}</div>;
    }
    return (
        <>

            <GlobalStyles />
            <div
                className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-900 text-gray-200"
                style={{ backgroundImage: `url('${backgroundImageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="profile-card w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url('${bannerUrl}')` }}></div>
                    <div className="p-8 relative">
                        {/* 头像和编辑按钮 */}
                        <div className="flex items-end -mt-24">
                            <img src={profileData?.avatarUrl || defaultAvatar} alt="教练头像" className="w-32 h-32 rounded-full border-4 border-slate-700 bg-slate-200 object-cover" />
                            <div className="ml-auto">
                                <button onClick={() => setIsModalOpen(true)} className="edit-btn text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2"><Edit3 size={16} /><span>编辑资料</span></button>
                            </div>
                        </div>

                        {/* --- 只负责展示的内容区域 --- */}
                        <div className="mt-6">
                            <div className="flex flex-wrap items-center justify-between gap-y-2">
                                <div>
                                    <h1 className="text-3xl font-bold text-white">{profileData?.userName}</h1>
                                    <p className="text-lg text-blue-400 font-medium mt-1">{profileData?.teachingContent}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 px-3 py-2 rounded-lg"><Award className="text-green-400" size={20} /><span className="text-white font-semibold text-lg">{profileData?.experienceYears}</span><span className="text-gray-400 text-sm">年经验</span></div>
                                    <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 px-3 py-2 rounded-lg"><Star className="text-yellow-400" size={20} /><span className="text-white font-semibold text-lg">{profileData?.rating}</span><span className="text-gray-400 text-sm">/ 5.0 评分</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10"><h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2"><UserRound size={20} className="text-gray-400" />个人简介</h2><p className="text-gray-300 leading-relaxed">{profileData?.bio}</p></div>
                        <div className="mt-10">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2"><Sparkles size={20} className="text-gray-400" />专业技能</h2>
                                <button onClick={() => setIsAddSkillModalOpen(true)} className="add-skill-btn text-sm font-semibold py-2 px-4 rounded-full flex items-center gap-2 transition-colors"><PlusCircle size={16} /> 添加认证</button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {profileData?.skills?.map((skillVO) => (
                                    <button key={skillVO.id} onClick={() => handleSkillClick(skillVO)} className="tag-base text-blue-300 font-medium py-2 px-4 rounded-full flex items-center gap-2 text-left">
                                        {skillVO.displayName}
                                        {skillVO.status === 'APPROVED' && <ShieldCheck size={16} className="text-green-400" title="已认证" />}
                                        {skillVO.status === 'PENDING' && <Clock size={16} className="text-yellow-400" title="审核中" />}
                                        {skillVO.status === 'REJECTED' && <ShieldX size={16} className="text-red-400" title="已拒绝" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-10">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2"><MapPin size={20} className="text-gray-400" />代课地点</h2>
                                <button onClick={() => setIsEditLocationsModalOpen(true)} className="action-btn text-sm font-semibold py-2 px-4 rounded-full flex items-center gap-2 transition-colors"><Edit3 size={16} /> 编辑地点</button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {profileData?.locations?.map((loc, index) => <span key={`${loc}-${index}`} className="tag-base text-blue-300 font-medium py-2 px-4 rounded-full">{loc}</span>)}
                            </div>
                        </div>
                        <div className="mt-10"><h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><Contact size={20} className="text-gray-400" />联系方式</h2><div className="space-y-3"><div className="flex items-center gap-4 text-gray-300"><Mail size={20} className="text-gray-400" /><span>{profileData?.email}</span></div><div className="flex items-center gap-4 text-gray-300"><Phone size={20} className="text-gray-400" /><span>{profileData?.phoneNumber}</span></div></div></div>

                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                profileData={profileData}
                onSaveSuccess={fetchProfile}
            />
            <AddSkillModal
                isOpen={isAddSkillModalOpen}
                onClose={() => setIsAddSkillModalOpen(false)}
                onSkillAdded={fetchProfile}/>
            <EditLocationsModal
                isOpen={isEditLocationsModalOpen}
                onClose={() => setIsEditLocationsModalOpen(false)}
                onSaveSuccess={fetchProfile} currentLocations={profileData?.locations || []}
            />
            <SkillDetailModal
                isOpen={!!selectedSkill}
                onClose={() => setSelectedSkill(null)}
                skill={selectedSkill} />

        </>

    );
}
