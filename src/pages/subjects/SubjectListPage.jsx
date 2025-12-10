/**
 * SubjectListPage
 * หน้าแสดงรายการวิชาทั้งหมด
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { SubjectTable } from '../../components/subjects/SubjectTable';
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl sm:text-4xl font-bold text-gray-900">
                            ข้อมูลรายวิชา
                        </h1>
                    </div>

                    <Button
                        onClick={() => navigate('/subjects/create')}
                        className="bg-[#050C9C] text-white px-4 sm:px-6 py-2 text-sm sm:text-base hover:bg-[#040879] w-full sm:w-auto"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg sm:text-xl">add</span>
                            <span>เพิ่มรายวิชา</span>
                        </span>
                    </Button>
                </div>

                {/* Search Bar */}
                <div className=" rounded-lg p-3 sm:p-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <span className="material-symbols-outlined text-lg sm:text-xl">search</span>
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ค้นหารายวิชา (รหัสวิชา หรือ ชื่อวิชา)"
                            className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#050C9C]"
                        />
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center">
                        <p className="text-red-800 text-sm sm:text-base">{error}</p>
                        <Button
                            onClick={loadSubjects}
                            className="mt-4 bg-red-600 text-white px-4 py-2 text-sm sm:text-base"
                        >
                            ลองอีกครั้ง
                        </Button>
                    </div>
                ) : filteredSubjects.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
                        <span className="material-symbols-outlined text-5xl sm:text-6xl text-gray-300 mb-4">
                            inbox
                        </span>
                        <p className="text-gray-600 text-sm sm:text-base">
                            {searchQuery ? 'ไม่พบรายวิชาที่ค้นหา' : 'ยังไม่มีรายวิชาในระบบ'}
                        </p>
                        {!searchQuery && (
                            <Button
                                onClick={() => navigate('/subjects/create')}
                                className="mt-4 bg-[#050C9C] text-white px-4 sm:px-6 py-2 text-sm sm:text-base"
                            >
                                เพิ่มรายวิชาแรก
                            </Button>
                        )}
                    </div>
                ) : (
                    <SubjectTable
                        subjects={filteredSubjects}
                        onDelete={handleDelete}
                    />
                )}

                {/* Summary */}
                {!loading && !error && filteredSubjects.length > 0 && (
                    <div className="text-center text-xs sm:text-sm text-gray-600">
                        แสดง {filteredSubjects.length} จาก {subjects.length} รายวิชา
                    </div>
                )}
            </div>
        </AppShell>
    );
};

export default SubjectListPage;
