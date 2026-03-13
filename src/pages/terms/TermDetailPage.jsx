/**
 * TermDetailPage
 * หน้าแสดงรายละเอียดภาคการศึกษา
 * พร้อมลิงก์ไปดูสถานะรายวิชา
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/common/Button';
import { ActionButton } from '../../components/common/ActionButton';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/roleConfig';
import * as termService from '../../services/termService';

// Format Thai date
const formatThaiDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('th-TH', { month: 'long' });
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
};

// Get sector label
const getSectorLabel = (sector) => {
    const sectorMap = {
        '1': '1',
        '2': '2',
        '3': '3',
    };
    return sectorMap[sector] || sector;
};

export const TermDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { roles } = useAuth();
    const [term, setTerm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // เช็คสิทธิ์ว่าเป็น Academic Officer หรือ Program Chair
    const canViewCourseStatus = roles.includes(ROLES.ACADEMIC_OFFICER) ||
        roles.includes(ROLES.PROGRAM_CHAIR) ||
        roles.includes(ROLES.PROFESSOR);

    const isAcademicOfficer = roles.includes(ROLES.ACADEMIC_OFFICER);

    // โหลดข้อมูล term
    useEffect(() => {
        const fetchTerm = async () => {
            try {
                setLoading(true);
                const data = await termService.getTermById(id);
                setTerm(data);
            } catch (err) {
                console.error('Failed to fetch term:', err);
                setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTerm();
        }
    }, [id]);

    // Loading state
    if (loading) {
        return (
            <AppShell title="รายละเอียดภาคการศึกษา">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AppShell>
        );
    }

    // Error state
    if (error) {
        return (
            <AppShell title="รายละเอียดภาคการศึกษา">
                <div className="text-center py-12">
                    <div className="text-red-600 mb-4">{error}</div>
                    <Button
                        onClick={() => navigate('/terms')}
                        variant="primary"
                        size="sm"
                        className="text-xl"
                    >
                        กลับไปรายการภาคการศึกษา
                    </Button>
                </div>
            </AppShell>
        );
    }

    // Not found
    if (!term) {
        return (
            <AppShell title="รายละเอียดภาคการศึกษา">
                <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">ไม่พบข้อมูลภาคการศึกษา</p>
                    <Button
                        onClick={() => navigate('/terms')}
                        variant="primary"
                        size="sm"
                        className="text-xl"
                    >
                        กลับไปรายการภาคการศึกษา
                    </Button>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell title="รายละเอียดภาคการศึกษา">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        ปีการศึกษา {getSectorLabel(term.academic_sector)}/{term.academic_year}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {formatThaiDate(term.term_start_date)} - {formatThaiDate(term.term_end_date)}
                    </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* วันที่เทอม */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            วันที่ภาคการศึกษา
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xl text-gray-600">วันเริ่มเทอม</label>
                                <p className="text-gray-900 font-medium">{formatThaiDate(term.term_start_date)}</p>
                            </div>
                            <div>
                                <label className="text-xl text-gray-600">วันสิ้นสุดเทอม</label>
                                <p className="text-gray-900 font-medium">{formatThaiDate(term.term_end_date)}</p>
                            </div>
                        </div>
                    </div>

                    {/* วันสอบกลางภาค */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            สอบกลางภาค
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xl text-gray-600">วันเริ่มสอบ</label>
                                <p className="text-gray-900 font-medium">{formatThaiDate(term.midterm_start_date)}</p>
                            </div>
                            <div>
                                <label className="text-xl text-gray-600">วันสิ้นสุดสอบ</label>
                                <p className="text-gray-900 font-medium">{formatThaiDate(term.midterm_end_date)}</p>
                            </div>
                        </div>
                    </div>

                    {/* วันสอบปลายภาค */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            สอบปลายภาค
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xl text-gray-600">วันเริ่มสอบ</label>
                                <p className="text-gray-900 font-medium">{formatThaiDate(term.final_start_date)}</p>
                            </div>
                            <div>
                                <label className="text-xl text-gray-600">วันสิ้นสุดสอบ</label>
                                <p className="text-gray-900 font-medium">{formatThaiDate(term.final_end_date)}</p>
                            </div>
                        </div>
                    </div>

                    {/* สถิติ */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            สถิติ
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xl text-gray-600">จำนวนรายวิชา</label>
                                <p className="text-2xl font-bold text-[#050C9C]">{term.subject_count || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ปุ่มดูสถานะรายวิชา */}
                {canViewCourseStatus && (
                    <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-lg shadow p-6 border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    สถานะรายวิชาในภาคการศึกษานี้
                                </h3>
                                <p className="text-gray-600">
                                    ดูรายวิชาทั้งหมด สถานะการส่งเอกสาร และมอบหมายอาจารย์ผู้รับผิดชอบ
                                </p>
                            </div>
                            <Button
                                onClick={() => navigate(`/course-status/term/${id}`)}
                                variant="primary"
                                size="sm"
                                className="text-xl shadow-md hover:shadow-lg"
                            >
                                ดูสถานะรายวิชา →
                            </Button>
                        </div>
                    </div>
                )}

                {/* Created/Updated Info */}
                {(term.created_at || term.updated_at) && (
                    <div className="bg-gray-50 rounded-lg p-4 text-xl text-gray-600">
                        {term.created_at && (
                            <p>สร้างเมื่อ: {new Date(term.created_at).toLocaleString('th-TH')}</p>
                        )}
                        {term.updated_at && (
                            <p>แก้ไขล่าสุด: {new Date(term.updated_at).toLocaleString('th-TH')}</p>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <ActionButton
                        onClick={() => navigate('/terms')}
                        variant="secondary"
                    >
                        กลับ
                    </ActionButton>
                    {isAcademicOfficer && (
                        <ActionButton
                            onClick={() => navigate(`/terms/edit/${id}`)}
                            variant="primary"
                            icon="edit"
                        >
                            แก้ไข
                        </ActionButton>
                    )}
                </div>
            </div>
        </AppShell>
    );
};
