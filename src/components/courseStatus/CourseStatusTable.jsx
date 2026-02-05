/**
 * CourseStatusTable Component
 * แสดงตารางสถานะรายวิชาทั้งหมด พร้อม sorting และ filtering
 */

import { useState, useMemo } from 'react';
import { CourseStatusRow } from './CourseStatusRow';

export function CourseStatusTable({
    subjects = [],
    onRefresh,
    onViewDetail,
    userRole,
    loading = false
}) {
    // ⚠️ CRITICAL: เรียก Hooks ก่อน early returns ทั้งหมด (Rules of Hooks)
    const [sortBy, setSortBy] = useState('code'); // code, program_year, credit
    const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
    const [filterStatus, setFilterStatus] = useState('all'); // all, submitted, pending

    // Filter subjects ตาม filterStatus
    const filteredSubjects = useMemo(() => {
        if (filterStatus === 'all') return subjects;

        if (filterStatus === 'submitted') {
            return subjects.filter(s =>
                s.outline_status && s.workload_status && s.report_status
            );
        }

        if (filterStatus === 'pending') {
            return subjects.filter(s =>
                !s.outline_status || !s.workload_status || !s.report_status
            );
        }

        return subjects;
    }, [subjects, filterStatus]);

    // Sort subjects
    const sortedSubjects = useMemo(() => {
        const sorted = [...filteredSubjects].sort((a, b) => {
            let aValue, bValue;

            if (sortBy === 'code') {
                aValue = (a.code_eng || a.code_th || '').toLowerCase();
                bValue = (b.code_eng || b.code_th || '').toLowerCase();
            } else if (sortBy === 'program_year') {
                aValue = a.program_year || '';
                bValue = b.program_year || '';
            } else if (sortBy === 'credit') {
                aValue = a.credit || 0;
                bValue = b.credit || 0;
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [filteredSubjects, sortBy, sortOrder]);

    // Early return ถ้ากำลังโหลด
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Early return ถ้าไม่มีข้อมูล
    if (!subjects || subjects.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีข้อมูลรายวิชา</h3>
                <p className="mt-1 text-sm text-gray-500">ยังไม่มีรายวิชาในภาคการศึกษานี้</p>
            </div>
        );
    }

    // Toggle sort order
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    // Sort indicator icon
    const SortIcon = ({ field }) => {
        if (sortBy !== field) return null;
        return (
            <span className="ml-1">
                {sortOrder === 'asc' ? '↑' : '↓'}
            </span>
        );
    };

    return (
        <div className="space-y-4">
            {/* Filter และ Summary */}
            <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        ทั้งหมด ({subjects.length})
                    </button>
                    <button
                        onClick={() => setFilterStatus('submitted')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'submitted'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        ส่งครบแล้ว
                    </button>
                    <button
                        onClick={() => setFilterStatus('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'pending'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        รอส่ง
                    </button>
                </div>

                <div className="text-sm text-gray-600">
                    แสดง {sortedSubjects.length} รายวิชา
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                onClick={() => handleSort('code')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                รหัสวิชา/ชื่อวิชา <SortIcon field="code" />
                            </th>
                            <th
                                onClick={() => handleSort('program_year')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                หลักสูตร/ชั้นปี <SortIcon field="program_year" />
                            </th>
                            <th
                                onClick={() => handleSort('credit')}
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                หน่วยกิต <SortIcon field="credit" />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                อาจารย์ผู้สอน
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Outline
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Workload
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Report
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedSubjects.map((subject) => (
                            <CourseStatusRow
                                key={subject.id}
                                subject={subject}
                                onRefresh={onRefresh}
                                onViewDetail={onViewDetail}
                                userRole={userRole}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ถ้า filter แล้วไม่มีผลลัพธ์ */}
            {sortedSubjects.length === 0 && filterStatus !== 'all' && (
                <div className="text-center py-8 text-gray-500">
                    ไม่พบรายวิชาที่ตรงกับตัวกรอง
                </div>
            )}
        </div>
    );
}
