/**
 * ActiveTermCourseStatusPage
 * หน้าแสดงสถานะรายวิชาของภาคการศึกษาปัจจุบัน
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { CourseStatusTable } from '../../components/courseStatus/CourseStatusTable';
import { useCourseStatus } from '../../hooks/useCourseStatus';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { DropdownMenu } from '../../components/common/DropdownMenu';
import * as termService from '../../services/termService';

export default function ActiveTermCourseStatusPage() {
    const navigate = useNavigate();
    const { roles } = useAuth();

    // State
    const [selectedTermId, setSelectedTermId] = useState(null);
    const [terms, setTerms] = useState([]);
    const [termsLoading, setTermsLoading] = useState(true);

    // Load course status เมื่อเลือกเทอมแล้ว
    const { subjects, term, loading, error, refetch } = useCourseStatus(selectedTermId);

    // Load terms list และ auto-select active term
    useEffect(() => {
        const loadTerms = async () => {
            try {
                setTermsLoading(true);

                // Load ทุกเทอม
                const allTerms = await termService.getAllTerms();
                setTerms(allTerms);

                // หา active term แล้ว select ให้อัตโนมัติ
                const activeTerms = await termService.getActiveTerms();
                if (activeTerms && activeTerms.length > 0) {
                    setSelectedTermId(activeTerms[0].id);
                } else if (allTerms && allTerms.length > 0) {
                    // ถ้าไม่มี active term ให้เลือกเทอมล่าสุด
                    setSelectedTermId(allTerms[0].id);
                }
            } catch (err) {
                console.error('[ActiveTermCourseStatusPage] Failed to load terms:', err);
            } finally {
                setTermsLoading(false);
            }
        };

        loadTerms();
    }, []);

    // เช็คสิทธิ์
    const userRole = roles.includes('Academic Officer') || roles.includes('Program Chair')
        ? 'Academic Officer'
        : roles.includes('Professor')
            ? 'Professor'
            : null;

    // Early return ถ้าไม่มีสิทธิ์
    if (!userRole) {
        return (
            <AppShell title="สถานะรายวิชาปัจจุบัน">
                <div className="text-center py-12">
                    <p className="text-red-600">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
                </div>
            </AppShell>
        );
    }

    // Handle ดูรายละเอียด
    const handleViewDetail = (subject) => {
        const targetId = subject?.term_subject_id || subject?.id;
        if (!targetId) return;
        const subjectCode = subject?.code_eng || subject?.code_th || subject?.subject_code || null;
        const termLabel = term?.academic_sector && term?.academic_year
            ? `ปีการศึกษา ${term.academic_sector}/${term.academic_year}`
            : null;

        navigate(`/term-subjects/${targetId}/workload`, {
            state: {
                fromPath: '/course-status',
                fromLabel: 'ติดตามสถานะรายวิชา',
                termLabel,
                subjectCode,
            },
        });
    };

    // Format term label
    const getTermLabel = (t) => {
        return `ภาคเรียนที่ ${t.academic_sector}/${t.academic_year}`;
    };

    return (
        <AppShell title="สถานะรายวิชา">
            <div className="space-y-6">
                {/* Header with Term Selector */}
                <div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-900">
                                {selectedTermId && !termsLoading ? (() => {
                                    const selected = terms.find(t => t.id === selectedTermId);
                                    return selected ? `ติดตามสถานะรายวิชา ปีการศึกษา ${selected.academic_sector}/${selected.academic_year}` : 'ติดตามสถานะรายวิชา';
                                })() : 'ติดตามสถานะรายวิชา'}
                            </h1>
                        </div>

                        {/* Term Selector */}
                        <div className="flex items-center gap-3 py-3">
                            <label className="text-2xl text-gray-700 whitespace-nowrap">
                                เลือกภาคการศึกษา:
                            </label>
                            <DropdownMenu
                                trigger={
                                    <button
                                        disabled={termsLoading}
                                        className="px-4 py-2 rounded-lg bg-white hover:bg-gray-50 focus:outline-none text-left flex items-center justify-between min-w-60 max-w-[360px] border border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <span className="text-gray-900 text-xl truncate">
                                            {termsLoading ? 'กำลังโหลด...' :
                                                terms.length === 0 ? 'ไม่พบภาคการศึกษา' :
                                                    selectedTermId ? (() => {
                                                        const selected = terms.find(t => t.id === selectedTermId);
                                                        return selected ? `${getTermLabel(selected)}${selected.is_active ? ' (ปัจจุบัน)' : ''}` : '-- เลือกภาคการศึกษา --';
                                                    })() : '-- เลือกภาคการศึกษา --'
                                            }
                                        </span>
                                        <span className="material-symbols-outlined text-gray-500 ml-2">
                                            expand_more
                                        </span>
                                    </button>
                                }
                                items={termsLoading || terms.length === 0 ? [] : terms.map((t) => ({
                                    id: t.id,
                                    label: `${getTermLabel(t)}${t.is_active ? ' (ปัจจุบัน)' : ''}`,
                                    onClick: () => setSelectedTermId(t.id)
                                }))}
                                position="left"
                                className="w-80 max-h-96 overflow-y-auto"
                            />

                            {/* Refresh Button */}
                            <Button
                                onClick={() => {
                                    if (selectedTermId) refetch();
                                }}
                                disabled={!selectedTermId || loading}
                                variant="secondary"
                                size="sm"
                                className="px-2 py-2"
                                title="รีเฟรช"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Empty State - ยังไม่เลือกเทอม */}
                {!selectedTermId && !termsLoading && (
                    <div className="bg-white rounded-lg shadow p-12">
                        <div className="text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="mt-4 text-xl font-medium text-gray-900">
                                กรุณาเลือกภาคการศึกษา
                            </h3>
                            <p className="mt-2 text-xl text-gray-500">
                                เลือกภาคการศึกษาจากด้านบนเพื่อดูสถานะรายวิชา
                            </p>
                        </div>
                    </div>
                )}

                {/* Empty State - ไม่มีเทอม */}
                {!termsLoading && terms.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-12">
                        <div className="text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-4 text-xl font-medium text-gray-900">
                                ยังไม่มีภาคการศึกษาในระบบ
                            </h3>
                            <p className="mt-2 text-xl text-gray-500">
                                กรุณาสร้างภาคการศึกษาก่อนใช้งาน
                            </p>
                        </div>
                    </div>
                )}


                {/* Error */}
                {error && selectedTermId && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Course Status Table - แสดงเมื่อเลือกเทอมแล้ว */}
                {selectedTermId && (
                    <div>
                        <CourseStatusTable
                            subjects={subjects}
                            onRefresh={refetch}
                            onViewDetail={handleViewDetail}
                            userRole={userRole}
                            loading={loading}
                        />
                    </div>
                )}
            </div>
        </AppShell >
    );
}
