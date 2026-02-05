/**
 * ActiveTermCourseStatusPage
 * หน้าแสดงสถานะรายวิชาของภาคการศึกษาปัจจุบัน
 * 
 * Features:
 * - แสดงเฉพาะภาคการศึกษาที่ active
 * - แสดงตารางรายวิชาพร้อมสถานะ
 * - มอบหมายอาจารย์ (เฉพาะ Academic Officer)
 * - ดูรายละเอียดแต่ละวิชา
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { CourseStatusTable } from '../../components/courseStatus/CourseStatusTable';
import { useCourseStatus } from '../../hooks/useCourseStatus';
import { useAuth } from '../../hooks/useAuth';
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
        navigate(`/term-subjects/${subject.id}`);
    };

    // Format term label
    const getTermLabel = (t) => {
        return `ภาคเรียนที่ ${t.academic_sector}/${t.academic_year}`;
    };

    return (
        <AppShell title="สถานะรายวิชา">
            <div className="space-y-6">
                {/* Header with Term Selector */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">
                                สถานะรายวิชา
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                ติดตามสถานะการส่งเอกสารและภาระงานของแต่ละรายวิชา
                            </p>
                        </div>

                        {/* Term Selector */}
                        <div className="flex items-center gap-3">
                            <label htmlFor="term-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                เลือกภาคการศึกษา:
                            </label>
                            <select
                                id="term-select"
                                value={selectedTermId || ''}
                                onChange={(e) => setSelectedTermId(Number(e.target.value))}
                                disabled={termsLoading}
                                className="block w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {termsLoading ? (
                                    <option>กำลังโหลด...</option>
                                ) : terms.length === 0 ? (
                                    <option>ไม่พบภาคการศึกษา</option>
                                ) : (
                                    <>
                                        <option value="">-- เลือกภาคการศึกษา --</option>
                                        {terms.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {getTermLabel(t)}
                                                {t.is_active ? ' (ปัจจุบัน)' : ''}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>

                            {/* Refresh Button */}
                            <button
                                onClick={() => {
                                    if (selectedTermId) refetch();
                                }}
                                disabled={!selectedTermId || loading}
                                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="รีเฟรช"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
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
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                กรุณาเลือกภาคการศึกษา
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
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
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                ยังไม่มีภาคการศึกษาในระบบ
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                กรุณาสร้างภาคการศึกษาก่อนใช้งาน
                            </p>
                        </div>
                    </div>
                )}

                {/* Summary Cards - แสดงเมื่อเลือกเทอมแล้ว */}
                {selectedTermId && !loading && subjects.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-sm text-gray-600">รายวิชาทั้งหมด</div>
                            <div className="text-2xl font-bold text-gray-900 mt-1">
                                {subjects.length}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-sm text-gray-600">ส่ง Outline แล้ว</div>
                            <div className="text-2xl font-bold text-green-600 mt-1">
                                {subjects.filter(s => s.outline_status).length}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-sm text-gray-600">ส่ง Workload แล้ว</div>
                            <div className="text-2xl font-bold text-green-600 mt-1">
                                {subjects.filter(s => s.workload_status).length}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-sm text-gray-600">ส่ง Report แล้ว</div>
                            <div className="text-2xl font-bold text-green-600 mt-1">
                                {subjects.filter(s => s.report_status).length}
                            </div>
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
                    <div className="bg-white rounded-lg shadow">
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
        </AppShell>
    );
}
