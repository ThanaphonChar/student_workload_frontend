/**
 * MySubjectsPage Component
 * หน้าแสดงรายวิชาที่มอบหมายให้อาจารย์ (Professor only)
 * พร้อมฟีเจอร์อัปโหลดเอกสารและกรอกภาระงาน
 */

import { useState, useMemo, useRef } from 'react';
import { useMySubjects } from '../../hooks/useMySubjects';
import { AppShell } from '../../components/layout/AppShell';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { uploadDocument } from '../../services/uploadService';

export default function MySubjectsPage() {
    const { subjects, loading, error, refetch } = useMySubjects();
    const [selectedTerm, setSelectedTerm] = useState('');
    const [uploadModal, setUploadModal] = useState({ isOpen: false, subject: null, type: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const fileInputRef = useRef(null);

    // จัดกลุ่มวิชาตาม term
    const subjectsByTerm = useMemo(() => {
        return subjects.reduce((acc, subject) => {
            const termKey = `${subject.academic_sector}/${subject.academic_year}`;
            if (!acc[termKey]) {
                acc[termKey] = {
                    academic_sector: subject.academic_sector,
                    academic_year: subject.academic_year,
                    subjects: [],
                };
            }
            acc[termKey].subjects.push(subject);
            return acc;
        }, {});
    }, [subjects]);

    // เรียงตาม academic_year แบบ descending
    const sortedTerms = useMemo(() => {
        return Object.entries(subjectsByTerm).sort(([, a], [, b]) => {
            return b.academic_year - a.academic_year;
        });
    }, [subjectsByTerm]);

    // Set default selected term (ล่าสุด)
    useMemo(() => {
        if (sortedTerms.length > 0 && !selectedTerm) {
            setSelectedTerm(sortedTerms[0][0]);
        }
    }, [sortedTerms, selectedTerm]);

    // Get current term data
    const currentTermData = selectedTerm ? subjectsByTerm[selectedTerm] : null;

    // Handle upload modal
    const openUploadModal = (subject, type) => {
        setUploadModal({ isOpen: true, subject, type });
        setSelectedFile(null);
    };

    const closeUploadModal = () => {
        setUploadModal({ isOpen: false, subject: null, type: '' });
        setSelectedFile(null);
    };

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, 5000); // แสดง 5 วินาที
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            await uploadDocument(
                uploadModal.subject.term_subject_id,
                uploadModal.type,
                selectedFile
            );
            showNotification('success', 'อัปโหลดเอกสารสำเร็จ');
            closeUploadModal();
            refetch(); // รีเฟรชข้อมูล
        } catch (err) {
            console.error('Upload error:', err);
            const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปโหลดเอกสาร';
            showNotification('error', errorMessage);
        } finally {
            setUploading(false);
        }
    };
    // Loading state
    if (loading) {
        return (
            <AppShell>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050C9C] mx-auto"></div>
                        <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
                    </div>
                </div>
            </AppShell>
        );
    }

    // Error state
    if (error) {
        return (
            <AppShell>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto mt-8">
                    <p className="text-red-600">{error}</p>
                </div>
            </AppShell>
        );
    }

    // Empty state
    if (subjects.length === 0) {
        return (
            <AppShell>
                <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">ไม่มีรายวิชาที่มอบหมาย</h3>
                    <p className="text-gray-600">ยังไม่มีรายวิชาที่มอบหมายให้คุณในขณะนี้</p>
                </div>
            </AppShell>
        );
    }

    const getDocumentTypeLabel = (type) => {
        switch (type) {
            case 'outline': return 'เค้าโครงรายวิชา';
            case 'workload': return 'ภาระงาน';
            case 'report': return 'รายงานผล';
            default: return type;
        }
    };

    // Main view
    return (
        <AppShell>
            {/* Notification Toast */}
            {notification.show && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div
                        className={`
                            rounded-lg shadow-lg p-4 min-w-80 max-w-md
                            ${notification.type === 'success' 
                                ? 'bg-green-50 border-l-4 border-green-500' 
                                : 'bg-red-50 border-l-4 border-red-500'
                            }
                        `}
                    >
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {notification.type === 'success' ? (
                                    <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3 flex-1">
                                <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                    {notification.message}
                                </p>
                            </div>
                            <button
                                onClick={() => setNotification({ show: false, type: '', message: '' })}
                                className="ml-4 flex-shrink-0"
                            >
                                <svg className={`h-5 w-5 ${notification.type === 'success' ? 'text-green-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        รายวิชาของฉัน ภาคการศึกษา {currentTermData?.academic_sector}/{currentTermData?.academic_year}
                    </h1>
                </div>

                {/* Term Selector */}
                {sortedTerms.length > 1 && (
                    <div>
                        <select
                            value={selectedTerm}
                            onChange={(e) => setSelectedTerm(e.target.value)}
                            className="block w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#050C9C] bg-white"
                        >
                            {sortedTerms.map(([termKey, termData]) => (
                                <option key={termKey} value={termKey}>
                                    ภาคการศึกษา {termData.academic_sector}/{termData.academic_year} ({termData.subjects.length} รายวิชา)
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Table */}
                {currentTermData && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-[#050C9C]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xl font-medium text-white">
                                        รายวิชา
                                    </th>
                                    <th className="px-6 py-3 text-center text-xl font-medium text-white">
                                        หลักสูตร
                                    </th>
                                    <th className="px-6 py-3 text-center text-xl font-medium text-white">
                                        เค้าโครงรายวิชา
                                    </th>
                                    <th className="px-6 py-3 text-center text-xl font-medium text-white">
                                        ภาระงาน
                                    </th>
                                    <th className="px-6 py-3 text-center text-xl font-medium text-white">
                                        รายงานผล
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentTermData.subjects.map((subject) => (
                                    <tr key={subject.term_subject_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {subject.code_eng || subject.code_th}
                                                </div>
                                                <div className="text-base text-gray-600">
                                                    {subject.name_th || subject.name_eng}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-lg text-gray-900">
                                            {subject.credit || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => openUploadModal(subject, 'outline')}
                                                className="text-base"
                                            >
                                                อัปโหลด
                                            </Button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => {
                                                    // TODO: Navigate to workload data entry page
                                                    console.log('Navigate to workload form for:', subject);
                                                    alert('ฟีเจอร์กรอกภาระงานจะพัฒนาในขั้นตอนถัดไป');
                                                }}
                                                className="text-base"
                                            >
                                                กรอกภาระงาน
                                            </Button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => openUploadModal(subject, 'report')}
                                                className="text-base"
                                            >
                                                อัปโหลด
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <Modal
                isOpen={uploadModal.isOpen}
                onClose={closeUploadModal}
                title="ส่งเอกสาร"
            >
                <div className="space-y-4">
                    {/* Subject Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {uploadModal.subject?.code_eng || uploadModal.subject?.code_th}
                        </h3>
                        <p className="text-base text-gray-600">
                            {uploadModal.subject?.name_th || uploadModal.subject?.name_eng}
                        </p>
                    </div>

                    {/* File Upload */}
                    <div>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#050C9C] transition-colors"
                        >
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <p className="text-base font-medium text-gray-700 mb-1">แนบเอกสาร</p>
                            <p className="text-sm text-gray-500">
                                {selectedFile ? selectedFile.name : 'คลิกเพิ่มเลือกไฟล์'}
                            </p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileSelect}
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end pt-4">
                        <Button
                            variant="secondary"
                            onClick={closeUploadModal}
                            disabled={uploading}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleFileUpload}
                            disabled={!selectedFile || uploading}
                        >
                            {uploading ? 'กำลังอัปโหลด...' : 'ส่ง'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </AppShell>
    );
}
