/**
 * SubjectListPage
 * หน้าแสดงรายการวิชาทั้งหมด
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { SubjectCard } from '../../components/subjects/SubjectCard';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import * as subjectService from '../../services/subjectService';

export const SubjectListPage = () => {
    const navigate = useNavigate();

    // State
    const [subjects, setSubjects] = useState([]);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Load subjects on mount
    useEffect(() => {
        loadSubjects();
    }, []);

    // Filter subjects when search query changes
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredSubjects(subjects);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = subjects.filter(subject =>
            subject.code_th?.toLowerCase().includes(query) ||
            subject.code_eng?.toLowerCase().includes(query) ||
            subject.name_th?.toLowerCase().includes(query) ||
            subject.name_eng?.toLowerCase().includes(query)
        );
        setFilteredSubjects(filtered);
    }, [searchQuery, subjects]);

    /**
     * Load subjects from API
     */
    const loadSubjects = async () => {
        setLoading(true);
        setError(null);

        try {
            // Get only active subjects
            const response = await subjectService.getSubjects({ is_active: true });
            setSubjects(response.subjects || []);
            setFilteredSubjects(response.subjects || []);
        } catch (err) {
            console.error('Error loading subjects:', err);
            setError(err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลรายวิชาได้');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle delete subject (soft delete - set is_active = false)
     */
    const handleDelete = async (id) => {
        try {
            await subjectService.deleteSubject(id);
            // Remove from displayed list (since we only show active subjects)
            setSubjects(prev => prev.filter(s => s.id !== id));
            setFilteredSubjects(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error('Error deleting subject:', err);
            alert(err.response?.data?.message || 'ไม่สามารถลบรายวิชาได้');
        }
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-[32px] font-bold text-gray-900">
                            ข้อมูลรายวิชา
                        </h1>
                        <p className="text-[14px] text-gray-600 mt-1">
                            จัดการรายวิชาทั้งหมดในระบบ
                        </p>
                    </div>

                    <Button
                        onClick={() => navigate('/subjects/create')}
                        className="bg-[#050C9C] text-white px-6 py-3 text-[16px] hover:bg-[#040879]"
                    >
                        <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span>เพิ่มรายวิชา</span>
                        </span>
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ค้นหารายวิชา (รหัสวิชา หรือ ชื่อวิชา)"
                            className="w-full pl-10 pr-4 py-2 text-[16px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#050C9C]"
                        />
                    </div>
                </div>

                {/* Table Header */}
                <div className="bg-[#050C9C] text-white rounded-lg px-4 py-3">
                    <div className="grid grid-cols-12 gap-4 text-[14px] font-semibold">
                        <div className="col-span-4">รหัสวิชา / ชื่อวิชา</div>
                        <div className="col-span-2 text-center">หลักสูตร</div>
                        <div className="col-span-2 text-center">หน่วยกิต</div>
                        <div className="col-span-2 text-center">ชั้นปี</div>
                        <div className="col-span-1 text-center">สถานะ</div>
                        <div className="col-span-1 text-center">เพิ่มเติม</div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-800 text-[16px]">{error}</p>
                        <Button
                            onClick={loadSubjects}
                            className="mt-4 bg-red-600 text-white px-4 py-2"
                        >
                            ลองอีกครั้ง
                        </Button>
                    </div>
                ) : filteredSubjects.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <span className="material-symbols-outlined text-[64px] text-gray-300 mb-4">
                            inbox
                        </span>
                        <p className="text-gray-600 text-[18px]">
                            {searchQuery ? 'ไม่พบรายวิชาที่ค้นหา' : 'ยังไม่มีรายวิชาในระบบ'}
                        </p>
                        {!searchQuery && (
                            <Button
                                onClick={() => navigate('/subjects/create')}
                                className="mt-4 bg-[#050C9C] text-white px-6 py-2"
                            >
                                เพิ่มรายวิชาแรก
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredSubjects.map(subject => (
                            <SubjectCard
                                key={subject.id}
                                subject={subject}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                {/* Summary */}
                {!loading && !error && filteredSubjects.length > 0 && (
                    <div className="text-center text-[14px] text-gray-600">
                        แสดง {filteredSubjects.length} จาก {subjects.length} รายวิชา
                    </div>
                )}
            </div>
        </AppShell>
    );
};

export default SubjectListPage;
