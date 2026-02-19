/**
 * TermSubjectWorkloadPage
 * หน้าจัดการภาระงานของรายวิชา (Term Subject Workload Management)
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../../../components/layout/AppShell';
import WorkloadForm from '../../../components/WorkloadForm';
import WorkloadList from '../../../components/WorkloadList';
import * as termSubjectService from '../../../services/termSubjectService';
import * as workloadService from '../../../services/workloadService';

const TermSubjectWorkloadPage = () => {
    const { termSubjectId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [termSubject, setTermSubject] = useState(null);
    const [workloads, setWorkloads] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingWork, setEditingWork] = useState(null);
    const [error, setError] = useState(null);

    // ดึงข้อมูล term subject และ workload
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // ดึงข้อมูล term subject
            const termSubjectResponse = await termSubjectService.getTermSubjectById(termSubjectId);
            console.log('Term Subject Response:', termSubjectResponse);
            setTermSubject(termSubjectResponse.data);

            // ดึง workload ของ term_subject นี้
            const workloadResponse = await workloadService.getWorkloadByTermSubject(termSubjectId);
            console.log('Workload Response:', workloadResponse);
            
            // API ส่ง array กลับมา
            if (workloadResponse.data && Array.isArray(workloadResponse.data)) {
                setWorkloads(workloadResponse.data);
            } else {
                setWorkloads([]);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message || 'ไม่สามารถโหลดข้อมูลได้');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (termSubjectId) {
            fetchData();
        }
    }, [termSubjectId]);

    // Handle เพิ่มภาระงานใหม่
    const handleAddWorkload = () => {
        setEditingWork(null);
        setShowForm(true);
    };

    // Handle แก้ไขภาระงาน
    const handleEditWorkload = (work) => {
        setEditingWork(work);
        setShowForm(true);
    };

    // Handle บันทึกภาระงาน (สร้างใหม่หรือแก้ไข)
    const handleSaveWorkload = async (formData) => {
        try {
            if (editingWork) {
                // แก้ไข
                await workloadService.updateWorkload(termSubjectId, editingWork.id, formData);
                alert('อัพเดทภาระงานสำเร็จ');
            } else {
                // สร้างใหม่
                await workloadService.createWorkload(termSubjectId, formData);
                alert('เพิ่มภาระงานสำเร็จ');
            }

            setShowForm(false);
            setEditingWork(null);
            await fetchData(); // รีโหลดข้อมูล
        } catch (error) {
            // Error จะถูกจัดการในฟอร์ม
            throw error;
        }
    };

    // Handle ยกเลิก
    const handleCancel = () => {
        setShowForm(false);
        setEditingWork(null);
    };

    if (loading) {
        return (
            <AppShell>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050C9C] mx-auto mb-4"></div>
                        <p className="text-gray-600">กำลังโหลด...</p>
                    </div>
                </div>
            </AppShell>
        );
    }

    if (error) {
        return (
            <AppShell>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-[#050C9C] text-white rounded-md hover:bg-[#040a7a]"
                        >
                            กลับ
                        </button>
                    </div>
                </div>
            </AppShell>
        );
    }

    // ถ้ากำลังแสดงฟอร์ม
    if (showForm) {
        return (
            <AppShell>
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {editingWork ? 'แก้ไขภาระงาน' : 'เพิ่มภาระงาน'}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {termSubject?.subject_code} - {termSubject?.subject_name_th}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <WorkloadForm
                            termSubjectId={termSubjectId}
                        termSubjectData={termSubject}
                        onSuccess={handleSaveWorkload}
                        onCancel={handleCancel}
                        editData={editingWork}
                    />
                </div>
            </div>
            </AppShell>
        );
    }

    // แสดงหน้ารายการภาระงาน
    return (
        <AppShell>
            <div className="space-y-6">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500">
                    <span className="hover:text-[#050C9C] cursor-pointer" onClick={() => navigate('/')}>
                        ติดตามสถานะรายวิชา
                    </span>
                    <span className="mx-2">{'>'}</span>
                    <span className="hover:text-[#050C9C] cursor-pointer">
                        ปีการศึกษา 1/2568
                    </span>
                    <span className="mx-2">{'>'}</span>
                    <span className="font-medium text-gray-900">
                        DTI 101
                    </span>
                </div>

                {/* Top Section: Subject Info + Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Subject Info Card - Takes 2 columns */}
                    <div className="col-span-2 bg-white rounded-lg shadow p-6">
                        <div className="flex items-start gap-3">
                            <div className="w-1 h-20 bg-[#050C9C] rounded flex-shrink-0"></div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {termSubject?.code_eng || termSubject?.subject_code || 'DTI101'}
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    {termSubject?.name_th || termSubject?.subject_name_th || 'คณิตศาสตร์แบบไม่ต่อเนื่องและการประยุกต์'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards Container - Takes 1 column */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Total Workload Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">รวมภาระงาน</p>
                                <p className="text-6xl font-bold text-yellow-500">
                                    {workloads.length}
                                </p>
                                <p className="text-sm text-gray-600 mt-2">งาน</p>
                            </div>
                        </div>

                        {/* Total Hours Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">ชั่วโมง/สัปดาห์</p>
                                <p className="text-6xl font-bold text-[#050C9C]">
                                    {workloads.reduce((sum, w) => sum + (w.hours_per_week || 0), 0)}
                                </p>
                                <p className="text-sm text-gray-600 mt-2">ชม./สัปดาห์</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Document Status Cards */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Course Outline Document */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-center text-base font-medium text-gray-800 mb-4">
                            เอกสารคำใสร่ารายวิชา
                        </h3>
                        <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">
                            <span className="text-sm text-gray-700">เค้าโครงรายวิชา_DTI101.pdf</span>
                            <div className="flex items-center gap-2">
                                <span className="text-red-500 text-xl cursor-pointer hover:text-red-600">✕</span>
                                <span className="text-green-500 text-xl cursor-pointer hover:text-green-600">✓</span>
                            </div>
                        </div>
                    </div>

                    {/* Report Document */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-center text-base font-medium text-gray-800 mb-4">
                            เอกสารรายงานผลการสอนตำแหน่งงาน
                        </h3>
                        <div className="bg-gray-100 rounded-lg p-3">
                            <span className="text-sm text-gray-700">รายงานผลการสอนตำนิงาน_DTI101.pdf</span>
                        </div>
                    </div>
                </div>

                {/* Workload Section */}
                <div>
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold text-gray-900">ภาระงาน</h2>
                        <button
                            onClick={handleAddWorkload}
                            className="px-6 py-2 bg-[#050C9C] text-white rounded-lg hover:bg-[#040a7a] transition-colors font-medium flex items-center gap-2 shadow"
                        >
                            <span className="text-lg">+</span>
                            เพิ่มภาระงาน
                        </button>
                    </div>

                    {/* Workload Table Card */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <WorkloadList
                            workloads={workloads}
                            termSubjectData={termSubject}
                            onEdit={handleEditWorkload}
                            onRefresh={fetchData}
                        />
                    </div>
                </div>
            </div>
        </AppShell>
    );
};

export default TermSubjectWorkloadPage;
