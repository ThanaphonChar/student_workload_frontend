/**
 * TermSubjectWorkloadPage
 * หน้าจัดการภาระงานของรายวิชา (Term Subject Workload Management)
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppShell } from '../../../components/layout/AppShell';
import WorkloadForm from '../../../components/WorkloadForm';
import WorkloadList from '../../../components/WorkloadList';
import { Button } from '../../../components/common/Button';
import { useToast } from '../../../components/common/Toast';
import { useAuth } from '../../../hooks/useAuth';
import { formatThaiDate, parseDate } from '../../../utils/dateUtils';
import * as termSubjectService from '../../../services/termSubjectService';
import * as workloadService from '../../../services/workloadService';
import * as uploadService from '../../../services/uploadService';

const TermSubjectWorkloadPage = () => {
    const { termSubjectId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const { roles } = useAuth();
    const isAcademicOfficer = roles?.includes('Academic Officer');

    const [loading, setLoading] = useState(true);
    const [termSubject, setTermSubject] = useState(null);
    const [workloads, setWorkloads] = useState([]);
    const [documents, setDocuments] = useState({ outline: null, report: null });
    const [documentActionLoading, setDocumentActionLoading] = useState({
        outline: false,
        report: false,
    });
    const [showForm, setShowForm] = useState(false);
    const [editingWork, setEditingWork] = useState(null);
    const [error, setError] = useState(null);

    const breadcrumbSourcePath = location.state?.fromPath || '/course-status';
    const breadcrumbSourceLabel = location.state?.fromLabel || 'ติดตามสถานะรายวิชา';
    const breadcrumbTermLabel = location.state?.termLabel
        || ((termSubject?.academic_sector && termSubject?.academic_year)
            ? `ปีการศึกษา ${termSubject.academic_sector}/${termSubject.academic_year}`
            : 'ภาคการศึกษา');
    const breadcrumbSubjectLabel = location.state?.subjectCode
        || termSubject?.code_eng
        || termSubject?.subject_code
        || 'รายวิชา';

    // ดึงข้อมูล term subject และ workload
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // ดึงข้อมูล term subject + workload + latest documents
            const [termSubjectResponse, workloadResponse, latestDocuments] = await Promise.all([
                termSubjectService.getTermSubjectById(termSubjectId),
                workloadService.getWorkloadByTermSubject(termSubjectId),
                uploadService.getLatestDocuments(termSubjectId),
            ]);
            console.log('Term Subject Response:', termSubjectResponse);
            setTermSubject(termSubjectResponse.data);
            console.log('Workload Response:', workloadResponse);
            setDocuments(latestDocuments || { outline: null, report: null });

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
                toast.success('อัพเดทภาระงานสำเร็จ');
            } else {
                // สร้างใหม่
                await workloadService.createWorkload(termSubjectId, formData);
                toast.success('เพิ่มภาระงานสำเร็จ');
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

    const getDocumentApprovalStatus = (documentType) => {
        if (!termSubject) return 'pending';
        if (documentType === 'outline') return termSubject.outline_approved || 'pending';
        return termSubject.report_approved || 'pending';
    };

    const getStatusBadgeClass = (status) => {
        if (status === 'approved') return 'bg-[#E7F8F2] text-[#10B981]';
        if (status === 'rejected') return 'bg-[#FBE9E9] text-[#DC2626]';
        return 'bg-[#FFF5EA] text-[#FF8D28]';
    };

    const getStatusLabel = (status) => {
        if (status === 'approved') return 'อนุมัติแล้ว';
        if (status === 'rejected') return 'ปฏิเสธแล้ว';
        return 'รอการพิจารณา';
    };

    const normalizeDisplayFileName = (fileName) => {
        if (!fileName || typeof fileName !== 'string') return fileName;

        // แก้ชื่อไฟล์ที่เพี้ยนจาก latin1/utf8 mismatch (เช่น à¸..., Ã...)
        if (/[ÃÂà]/.test(fileName)) {
            try {
                const bytes = Uint8Array.from(fileName, (char) => char.charCodeAt(0));
                const decoded = new TextDecoder('utf-8').decode(bytes);
                if (decoded && decoded !== fileName) {
                    return decoded;
                }
            } catch {
                // fallback to original
            }
        }

        return fileName;
    };

    const setDocumentLoading = (documentType, loadingState) => {
        setDocumentActionLoading((prev) => ({
            ...prev,
            [documentType]: loadingState,
        }));
    };

    const handleViewDocument = async (documentType) => {
        const doc = documents?.[documentType];
        if (!doc) return;

        try {
            setDocumentLoading(documentType, true);
            await uploadService.viewDocumentFile(termSubjectId, doc.id);
        } catch (err) {
            toast.error(err.message || 'ไม่สามารถเปิดไฟล์ได้');
        } finally {
            setDocumentLoading(documentType, false);
        }
    };

    const handleDownloadDocument = async (documentType) => {
        const doc = documents?.[documentType];
        if (!doc) return;

        try {
            setDocumentLoading(documentType, true);
            await uploadService.downloadDocumentFile(termSubjectId, doc.id);
            toast.success('ดาวน์โหลดไฟล์สำเร็จ');
        } catch (err) {
            toast.error(err.message || 'ไม่สามารถดาวน์โหลดไฟล์ได้');
        } finally {
            setDocumentLoading(documentType, false);
        }
    };

    const handleDocumentApproval = async (documentType, nextStatus) => {
        if (!isAcademicOfficer) return;

        const fieldName = documentType === 'outline' ? 'outline_approved' : 'report_approved';

        try {
            setDocumentLoading(documentType, true);
            const response = await termSubjectService.updateTermSubject(termSubjectId, {
                [fieldName]: nextStatus,
            });

            setTermSubject(response.data);
            toast.success(nextStatus === 'approved' ? 'อนุมัติเอกสารสำเร็จ' : 'ปฏิเสธเอกสารสำเร็จ');
        } catch (err) {
            toast.error(err.message || 'ไม่สามารถอัปเดตสถานะเอกสารได้');
        } finally {
            setDocumentLoading(documentType, false);
        }
    };

    const renderDocumentCard = (documentType, title) => {
        const doc = documents?.[documentType] || null;
        const status = getDocumentApprovalStatus(documentType);
        const isBusy = documentActionLoading?.[documentType];

        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-center text-2xl font-bold text-gray-800 mb-4">
                    {title}
                </h3>

                {!doc ? (
                    <div className="bg-[#F1F1F1] rounded-lg p-4 text-center">
                        <span className="text-xl text-gray-500">ยังไม่มีไฟล์</span>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => handleViewDocument(documentType)}
                            disabled={isBusy}
                            className="w-full text-left bg-[#F1F1F1] rounded-lg p-4 hover:bg-gray-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            title="คลิกเพื่อดูไฟล์"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-xl text-gray-800 font-medium wrap-break-word">{normalizeDisplayFileName(doc.original_name)}</p>
                                <span className={`inline-flex shrink-0 px-3 py-1 rounded-full text-xl font-bold ${getStatusBadgeClass(status)}`}>
                                    {getStatusLabel(status)}
                                </span>
                            </div>
                        </button>

                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    onClick={() => handleDownloadDocument(documentType)}
                                    variant="secondary"
                                    size="sm"
                                    disabled={isBusy}
                                    className="text-xl"
                                >
                                    ดาวน์โหลด
                                </Button>

                                {isAcademicOfficer && (
                                    <>
                                        <Button
                                            onClick={() => handleDocumentApproval(documentType, 'approved')}
                                            variant="success"
                                            size="sm"
                                            disabled={isBusy || status === 'approved'}
                                            className="text-xl"
                                        >
                                            อนุมัติ
                                        </Button>
                                        <Button
                                            onClick={() => handleDocumentApproval(documentType, 'rejected')}
                                            variant="danger"
                                            size="sm"
                                            disabled={isBusy || status === 'rejected'}
                                            className="text-xl bg-[#EF4444] text-[#FEE2E2]"
                                        >
                                            ปฏิเสธ
                                        </Button>
                                    </>
                                )}
                            </div>
                            <p className="text-lg text-gray-500 shrink-0">
                                อัปโหลดเมื่อ {formatThaiDate(parseDate(doc.uploaded_at))}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <AppShell>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050C9C] mx-auto mb-4"></div>
                        <p className="text-gray-600 text-xl">กำลังโหลด...</p>
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
                        <Button
                            onClick={() => navigate(-1)}
                            variant="primary"
                            size="sm"
                            className="text-xl"
                        >
                            กลับ
                        </Button>
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
                <div className="flex items-center gap-2 text-2xl text-gray-600">
                    <span className="hover:text-[#050C9C] cursor-pointer" onClick={() => navigate(breadcrumbSourcePath)}>
                        {breadcrumbSourceLabel}
                    </span>
                    <span className="material-symbols-outlined text-xl sm:text-xl">
                        chevron_right
                    </span>
                    <span className="hover:text-[#050C9C] cursor-pointer" onClick={() => navigate(breadcrumbSourcePath)}>
                        {breadcrumbTermLabel}
                    </span>
                    <span className="material-symbols-outlined text-xl sm:text-xl">
                        chevron_right
                    </span>
                    <span className="text-[#050C9C] font-bold">
                        {breadcrumbSubjectLabel}
                    </span>
                </div>

                {/* Top Section: Subject Info + Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Subject Info Card - Takes 2 columns */}
                    <div className="col-span-2 bg-white rounded-lg shadow p-6">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-30 bg-[#050C9C] rounded shrink-0"></div>
                            <div>
                                <h1 className="text-5xl font-bold text-gray-900">
                                    {termSubject?.code_eng || termSubject?.subject_code}
                                </h1>
                                <p className="text-[#989898] text-2xl font-bold  mt-2">
                                    {termSubject?.name_th || termSubject?.subject_name_th}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards Container - Takes 1 column */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Total Workload Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-center">
                                <p className="text-xl text-gray-600 mb-2">รวมภาระงาน</p>
                                <p className="text-6xl font-bold text-yellow-500">
                                    {workloads.length}
                                </p>
                                <p className="text-xl text-gray-600 mt-2">งาน</p>
                            </div>
                        </div>

                        {/* Total Hours Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-center">
                                <p className="text-xl text-gray-600 mb-2">ชั่วโมง/สัปดาห์</p>
                                <p className="text-6xl font-bold text-[#050C9C]">
                                    {workloads.reduce((sum, w) => sum + (w.hours_per_week || 0), 0)}
                                </p>
                                <p className="text-xl text-gray-600 mt-2">ชม./สัปดาห์</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Document Status Cards */}
                <div className="grid grid-cols-2 gap-4">
                    {renderDocumentCard('outline', 'เอกสารเค้าโครงรายวิชา')}
                    {renderDocumentCard('report', 'เอกสารรายงานผลการดำเนินงาน')}
                </div>

                {/* Workload Section */}
                <div>
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold text-gray-900">ภาระงาน</h2>
                        <Button
                            onClick={handleAddWorkload}
                            variant="primary"
                            size="sm"
                            className="text-xl shadow"
                        >

                            เพิ่มภาระงาน
                        </Button>
                    </div>

                    {/* Workload Table Card */}
                    <div className="bg-white rounded-lg overflow-hidden">
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
