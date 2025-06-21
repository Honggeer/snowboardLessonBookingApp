import React, { useState, useEffect, useCallback } from 'react';
import { instructorService } from '../api/instructorService.js';
import { Calendar, Clock, Trash2, Plus, LoaderCircle, X, ChevronLeft, ChevronRight, AlertTriangle, MapPin } from 'lucide-react';
import backgroundImageUrl from '../assets/profileBG.png';

// ===================================================================================
// 主页面组件
// ===================================================================================
export default function AvailabilityManagementPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [schedule, setSchedule] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [resorts, setResorts] = useState([]);

    useEffect(() => {
        const fetchResorts = async () => {
            try {
                const locRes = await instructorService.getAvailableResorts();
                if (locRes && locRes.code === 1) {
                    setResorts(locRes.data);
                }
            } catch (error) {
                console.error("获取雪山列表失败", error);
            }
        };
        fetchResorts();
    }, []);

    const fetchMonthSchedule = useCallback(async (date) => {
        setIsLoading(true);
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const newSchedule = {};
        const promises = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const fullDate = new Date(year, month, day);
            const dateString = fullDate.toISOString().split('T')[0];

            promises.push(
                (async () => {
                    try {
                        const data = await instructorService.getMyAvailabilitiesByDate(dateString);
                        newSchedule[dateString] = data;
                    } catch (err) {
                        console.error(`获取日期 ${dateString} 的日程失败:`, err);
                        newSchedule[dateString] = { availableSlots: [], lockedInResort: null };
                    }
                })()
            );
        }

        await Promise.all(promises);
        setSchedule(newSchedule);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchMonthSchedule(currentDate);
    }, [currentDate, fetchMonthSchedule]);

    const handleActionSuccess = () => {
        fetchMonthSchedule(currentDate);
    };

    const changeMonth = (amount) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    return (
        <div className="min-h-screen w-full p-4 md:p-8 bg-gray-100" style={{ backgroundImage: `url('${backgroundImageUrl}')`, backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-shadow">我的时间表</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-1">
                        <AvailabilityCreator onSuccess={handleActionSuccess} resorts={resorts} />
                    </div>
                    <div className="lg:col-span-2">
                        <ScheduleCalendar
                            currentDate={currentDate}
                            schedule={schedule}
                            isLoading={isLoading}
                            onMonthChange={changeMonth}
                            onActionSuccess={handleActionSuccess}
                            resorts={resorts}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ===================================================================================
// 1. 批量创建可用时间的表单组件
// ===================================================================================
const AvailabilityCreator = ({ onSuccess, resorts }) => {
    const initialDays = [{name: 'SUNDAY', label: '日'}, {name: 'MONDAY', label: '一'}, {name: 'TUESDAY', label: '二'}, {name: 'WEDNESDAY', label: '三'}, {name: 'THURSDAY', label: '四'}, {name: 'FRIDAY', label: '五'}, {name: 'SATURDAY', label: '六'}];
    const [formData, setFormData] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        daysOfWeek: [],
        startTime: '10:00',
        endTime: '16:00',
        resortId: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleDay = (dayName) => {
        setFormData(prev => {
            const newDays = prev.daysOfWeek.includes(dayName)
                ? prev.daysOfWeek.filter(d => d !== dayName)
                : [...prev.daysOfWeek, dayName];
            return { ...prev, daysOfWeek: newDays };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.endDate) {
            setError('结束日期为必填项。');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            const payload = { ...formData, resortId: formData.resortId || null };
            await instructorService.createAvailabilities(payload);
            alert('可用时间创建/覆盖成功！');
            onSuccess();
        } catch (err) {
            setError(err.message || '发生未知错误，请重试。');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClearAll = async () => {
        if (window.confirm("危险操作：您确定要一键清空所有【未被预订】的可用时间吗？此操作不可撤销。")) {
            setIsSubmitting(true);
            setError('');
            try {
                await instructorService.deleteAllMyAvailabilities();
                alert('所有未预订的时间已清空！');
                onSuccess();
            } catch (err) {
                setError(err.message || '清空失败，请重试。');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg sticky top-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><Plus /> 创建/覆盖时间表</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-gray-700">开始日期</label><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="form-input-light w-full mt-1"/></div>
                    <div><label className="text-sm font-medium text-gray-700">结束日期</label><input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="form-input-light w-full mt-1"/></div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">选择星期 (不选则为每天)</label>
                    <div className="flex justify-between mt-2">{initialDays.map(day => (<button key={day.name} type="button" onClick={() => toggleDay(day.name)} className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${formData.daysOfWeek.includes(day.name) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{day.label}</button>))}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-gray-700">开始时间</label><input type="time" name="startTime" value={formData.startTime} onChange={handleChange} step="3600" className="form-input-light w-full mt-1"/></div>
                    <div><label className="text-sm font-medium text-gray-700">结束时间</label><input type="time" name="endTime" value={formData.endTime} onChange={handleChange} step="3600" className="form-input-light w-full mt-1"/></div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">滑雪场 (可选)</label>
                    <select name="resortId" value={formData.resortId} onChange={handleChange} className="form-input-light w-full mt-1">
                        <option value="">-- 不指定地点 (通用) --</option>
                        {resorts.map(resort => <option key={resort.id} value={resort.id}>{resort.name}</option>)}
                    </select>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                {/* 【UI优化】将两个按钮放入同一个容器，并调整间距 */}
                <div className="pt-2 space-y-3">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition flex items-center justify-center disabled:opacity-50 shadow-lg hover:shadow-blue-500/50">
                        {isSubmitting && <LoaderCircle className="animate-spin mr-2" />}
                        {isSubmitting ? '正在处理...' : '生成/覆盖时间表'}
                    </button>
                    <button type="button" onClick={handleClearAll} disabled={isSubmitting} className="w-full bg-red-700 text-white font-bold py-2 rounded-lg hover:bg-red-800 transition flex items-center justify-center disabled:opacity-50 shadow-lg hover:shadow-red-500/50">
                        <AlertTriangle size={16} className="mr-2" />
                        一键清空所有未预订时间
                    </button>
                </div>
            </form>
        </div>
    );
};

// ===================================================================================
// 2. 日程日历组件
// ===================================================================================
const ScheduleCalendar = ({ currentDate, schedule, isLoading, onMonthChange, onActionSuccess, resorts }) => {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="border-r border-b border-gray-200/50"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const dateString = new Date(year, month, day).toISOString().split('T')[0];
        const daySchedule = schedule[dateString];
        calendarDays.push(
            <DayCell key={day} day={day} schedule={daySchedule} onActionSuccess={onActionSuccess} dateString={dateString} resorts={resorts}/>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => onMonthChange(-1)} className="p-2 rounded-full hover:bg-gray-200/50"><ChevronLeft /></button>
                <h2 className="text-2xl font-semibold text-gray-800">{year} 年 {month + 1} 月</h2>
                <button onClick={() => onMonthChange(1)} className="p-2 rounded-full hover:bg-gray-200/50"><ChevronRight /></button>
            </div>
            <div className="grid grid-cols-7 border-t border-l border-gray-200/50">
                {weekdays.map(day => <div key={day} className="text-center font-semibold text-gray-600 py-2 border-r border-b border-gray-300/50 bg-gray-50/50">{day}</div>)}
                {isLoading ? <div className="col-span-7 h-96 flex items-center justify-center"><LoaderCircle className="animate-spin text-3xl text-blue-500"/></div> : calendarDays}
            </div>
        </div>
    );
};

// ===================================================================================
// 3. 日历中的“天”单元格子组件
// ===================================================================================
const DayCell = ({ day, schedule, onActionSuccess, dateString, resorts }) => {

    const handleDeleteSlot = async (id) => {
        if(window.confirm("确定要删除这个时间段吗？")) {
            try {
                await instructorService.deleteAvailabilityById(id);
                alert('删除成功！');
                onActionSuccess();
            } catch (err) {
                alert(`删除失败: ${err.message}`);
            }
        }
    };

    const handleClearDay = async () => {
        if(window.confirm(`确定要清空 ${dateString} 这一天所有未预订的时间吗？`)) {
            try {
                await instructorService.deleteAvailabilitiesByDate(dateString);
                alert('清空成功！');
                onActionSuccess();
            } catch (err) {
                alert(`操作失败: ${err.message}`);
            }
        }
    };

    const hasUnbookedSlots = schedule?.availableSlots?.length > 0;

    const getDayResortName = () => {
        if (!schedule) return null;
        if (schedule.lockedInResort) return schedule.lockedInResort.name;
        if (!schedule.availableSlots || schedule.availableSlots.length === 0) return null;

        const firstResortId = schedule.availableSlots[0].resortId;
        if (firstResortId && schedule.availableSlots.every(slot => slot.resortId === firstResortId)) {
            const resort = resorts.find(r => r.id === firstResortId);
            return resort ? resort.name : '多个地点';
        }
        if (!firstResortId && schedule.availableSlots.every(slot => !slot.resortId)) {
            return '通用时间';
        }
        return '多个地点';
    };

    const dayResortName = getDayResortName();
    const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-CA', {hour: '2-digit', minute:'2-digit', hour12: false});

    return (
        <div className="border-r border-b border-gray-200/50 p-2 min-h-[120px] relative flex flex-col">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-800">{day}</span>
                    {schedule?.lockedInResort && (
                        <div title="当天有预订" className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                </div>
                {hasUnbookedSlots && (
                    <button onClick={handleClearDay} title="清空当天未预订时间" className="p-1 -mr-1 -mt-1">
                        <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                    </button>
                )}
            </div>

            {dayResortName && (
                <div title={dayResortName} className="truncate text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{dayResortName}</span>
                </div>
            )}

            <div className="mt-1 space-y-1 overflow-y-auto flex-grow">
                {schedule?.availableSlots?.map(slot => (
                    <div key={slot.availabilityId} className="bg-blue-100 text-blue-800 text-xs p-1 rounded-md flex justify-between items-center">
                        <span className="flex items-center gap-1">
                            <Clock size={12}/>
                            {`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}
                        </span>
                        <button onClick={() => handleDeleteSlot(slot.availabilityId)} className="hover:text-red-600 rounded-full hover:bg-red-200 p-0.5">
                            <X size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 辅助样式组件
const GlobalStyles = () => (
    <style>{`
        .text-shadow { text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .form-input-light { background-color: rgba(255, 255, 255, 0.8); border: 1px solid #d1d5db; color: #111827; border-radius: 0.5rem; padding: 0.75rem; transition: all 0.2s ease-in-out; }
        .form-input-light:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3); }
    `}</style>
);
