/**
 * CourseStatusByTermPage
 * หน้าแสดงสถานะรายวิชาแยกตามภาคการศึกษา
 * 
 * Features:
 * - เลือกภาคการศึกษาที่ต้องการดู
 * - แสดงตารางรายวิชาพร้อมสถานะ
 * - มอบหมายอาจารย์ (เฉพาะ Academic Officer)
 * - ดูรายละเอียดแต่ละวิชา
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { CourseStatusTable } from '../../components/courseStatus/CourseStatusTable';
import { Button } from '../../components/common/Button';
import { DropdownMenu } from '../../components/common/DropdownMenu';
import { useCourseStatus } from '../../hooks/useCourseStatus';
import { useAuth } from '../../hooks/useAuth';
import { useTerms } from '../../hooks/useTerms';

export default function CourseStatusByTermPage() {
    const { termId } = useParams();
    const navigate = useNavigate();
    const { roles } = useAuth();
    const { terms, loading: termsLoading } = useTerms();

    const [selectedTermId, setSelectedTermId] = useState(termId || '');

    const { subjects, loading, error, refetch } = useCourseStatus(selectedTermId);

    // ถ้ามี termId จาก URL ให้ใช้เลย
    useEffect(() => {
        if (termId) {
            setSelectedTermId(termId);
        }
    }, [termId]);

    // Early return ถ้ายังโหลดภาคการศึกษา
    if (termsLoading) {
        return (
            <AppShell title="สถานะรายวิชา">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AppShell>
        );
    }

    // เช็ควิชาจารย์มีสิทธิ์หรือไม่
    const userRole = roles.includes('Academic Officer') || roles.includes('Program Chair')
        ? 'Academic Officer'
        : roles.includes('Professor')
            ? 'Professor'
            : null;

    // Early return ถ้าไม่มีสิทธิ์
    if (!userRole) {
        return (
            <AppShell title="สถานะรายวิชา">
                <div className="text-center py-12">
                    <p className="text-red-600">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
                </div>
            </AppShell>
        );
    }

    // Handle เลือกภาคการศึกษา
    const handleTermChange = (newTermId) => {
        setSelectedTermId(newTermId);

        // อัพเดท URL ด้วย
        if (newTermId) {
            navigate(`/course-status/term/${newTermId}`);
        }
    };

    const selectedTerm = terms.find((t) => String(t.id) === String(selectedTermId));

    const getTermLabel = (t) => {
        const termSector = t.academic_sector || t.semester;
        return `${t.academic_year}/${termSector}`;
    };

    // Handle ดูรายละเอียด
    const handleViewDetail = (subject) => {
        const targetId = subject?.term_subject_id || subject?.id;
        if (!targetId) return;
        const selectedTerm = terms.find((t) => String(t.id) === String(selectedTermId));
        const termSector = selectedTerm?.academic_sector || selectedTerm?.semester;
        const termLabel = termSector && selectedTerm?.academic_year
            ? `ปีการศึกษา ${termSector}/${selectedTerm.academic_year}`
            : null;
        const subjectCode = subject?.code_eng || subject?.code_th || subject?.subject_code || null;

        navigate(`/term-subjects/${targetId}/workload`, {
            state: {
                fromPath: selectedTermId ? `/course-status/term/${selectedTermId}` : '/course-status',
                fromLabel: 'สถานะรายวิชา',
                termLabel,
                subjectCode,
            },
        });
    };

    return (
        <AppShell title="สถานะรายวิชา">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            สถานะรายวิชาตามภาคการศึกษา
                        </h1>
                        <p className="text-xl text-gray-600 mt-1">
                            ตรวจสอบสถานะการส่งเอกสารของแต่ละรายวิชา
                        </p>
                    </div>

                    {/* Refresh Button */}
                    <Button
                        onClick={refetch}
                        disabled={loading}
                        variant="secondary"
                        size="sm"
                        className="px-4 py-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </Button>
                </div>

                {/* Select Term */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <label className="block text-xl font-medium text-gray-700 mb-2">
                        เลือกภาคการศึกษา
                    </label>
                    <DropdownMenu
                        trigger={
                            <button className="px-4 py-2 rounded-lg bg-white hover:bg-gray-50 focus:outline-none text-left flex items-center justify-between min-w-[100px] border border-gray-300">
                                <span className="text-gray-900 text-xl">
                                    {selectedTerm
                                        ? `${getTermLabel(selectedTerm)}${selectedTerm.is_active ? ' (ปัจจุบัน)' : ''}`
                                        : '-- เลือกภาคการศึกษา --'}
                                </span>
                                <span className="material-symbols-outlined text-gray-500 ml-2">
                                    expand_more
                                </span>
                            </button>
                        }
                        items={terms.map((term) => ({
                            id: term.id,
                            label: `${getTermLabel(term)}${term.is_active ? ' (ปัจจุบัน)' : ''}`,
                            onClick: () => handleTermChange(term.id),
                        }))}
                        position="left"
                        className="w-80 max-h-96 overflow-y-auto"
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Table */}
                {selectedTermId ? (
                    <div className="bg-white rounded-lg shadow">
                        <CourseStatusTable
                            subjects={subjects}
                            onRefresh={refetch}
                            onViewDetail={handleViewDetail}
                            userRole={userRole}
                            loading={loading}
                        />
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        กรุณาเลือกภาคการศึกษาเพื่อดูสถานะรายวิชา
                    </div>
                )}
            </div>
        </AppShell>
    );
}
