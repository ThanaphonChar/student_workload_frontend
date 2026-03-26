/**
 * MySubjectsPage Component
 * หน้าแสดงรายวิชาที่มอบหมายให้อาจารย์ (Professor only)
 * พร้อมฟีเจอร์ส่งเอกสาร (outline + report) และกรอกภาระงาน
 * 
 * Features:
 * - Status badges สำหรับ outline + report
 * - 3-step upload modal
 * - Submission history modal
 */

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { DropdownMenu } from '../../components/common/DropdownMenu';
import { PaginatedTable } from '../../components/common/PaginatedTable';
import { TableRow } from '../../components/common/TableRow';
import { Button } from '../../components/common/Button';
import { DocumentStatusBadge } from '../../components/MySubjects/DocumentStatusBadge';
import { UploadModal } from '../../components/MySubjects/UploadModal';
import { HistoryModal } from '../../components/MySubjects/HistoryModal';
import * as submissionService from '../../services/submission.service';

export default function MySubjectsPage() {
    const navigate = useNavigate();

    // State
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [terms, setTerms] = useState([]);
    const [subjectsByTerm, setSubjectsByTerm] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    // Upload modal state
    const [uploadModal, setUploadModal] = useState({ isOpen: false, subject: null, documentType: '' });

    // History modal state
    const [historyModal, setHistoryModal] = useState({ isOpen: false, termSubjectId: null, documentType: '' });

    // Load subjects for a term
    const loadSubjectsForTerm = async (termStr) => {
        if (!termStr) return;

        setLoading(true);
        setError(null);

        try {
            // Parse termStr format: "academic_sector/academic_year"
            const [sector, year] = termStr.split('/');
            // Find term ID from terms list - this is simplified, in real app you'd need term ID
            // For now, assuming termStr contains the term ID or we need to fetch from backend

            const response = await submissionService.getMySubjectsWithStatus(termStr);
            if (response.success && response.data) {
                setSubjectsByTerm((prev) => ({
                    ...prev,
                    [termStr]: response.data
                }));
            }
        } catch (err) {
            console.error('[MySubjectsPage] Error loading subjects:', err);
            setError('ไม่สามารถโหลดข้อมูลรายวิชาได้');
        } finally {
            setLoading(false);
        }
    };

    // Load initial terms (simplified - in real app fetch from backend)
    useEffect(() => {
        // Note: This is a placeholder - in real implementation,
        // you'd fetch all terms for the logged-in professor
        // For now, select first available or let user select
    }, []);

    // Sync selected term and load data
    useEffect(() => {
        if (selectedTerm) {
            loadSubjectsForTerm(selectedTerm);
        }
    }, [selectedTerm]);

    // Get current term subjects
    const currentTermSubjects = selectedTerm ? (subjectsByTerm[selectedTerm] || []) : [];

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, 5000);
    };

    // Handle badge/status clicks
    const handleStatusBadgeClick = (subject, documentType) => {
        // If no status (null), open upload modal
        const docData = documentType === 'outline' ? subject.outline : subject.report;
        if (!docData?.status) {
            setUploadModal({ isOpen: true, subject, documentType });
        } else {
            // Open history modal
            setHistoryModal({ isOpen: true, termSubjectId: subject.term_subject_id, documentType });
        }
    };

    const handleUploadSuccess = () => {
        showNotification('success', 'อัปโหลดเอกสารสำเร็จ');
        // Reload current term subjects
        if (selectedTerm) {
            loadSubjectsForTerm(selectedTerm);
        }
    };

    const handleReuploadFromHistory = (subject, documentType) => {
        setHistoryModal({ isOpen: false, termSubjectId: null, documentType: '' });
        setTimeout(() => {
            setUploadModal({ isOpen: true, subject, documentType });
        }, 300);
    };

    // Loading state
    if (loading && currentTermSubjects.length === 0) {
        return (
            <AppShell title="รายวิชาของฉัน">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050C9C] mx-auto"></div>
                        <p className="mt-4 text-gray-600 text-xl">กำลังโหลดข้อมูล...</p>
                    </div>
                </div>
            </AppShell>
        );
    }

    // Error state
    if (error && currentTermSubjects.length === 0) {
        return (
            <AppShell title="รายวิชาของฉัน">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto mt-8">
                    <p className="text-red-600">{error}</p>
                </div>
            </AppShell>
        );
    }

    // Main view
    return (
        <AppShell title="รายวิชาของฉัน">
            {/* Notification Toast */}
            {notification.show && (
                <div className="fixed top-4 right-4 z-50">
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
                            <div className="shrink-0">
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
                                <p className={`text-xl font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                    {notification.message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            รายวิชาของฉัน
                        </h1>

                    </div>

                    {terms.length > 1 && (
                        <div className="w-full md:w-auto md:ml-auto">
                            <DropdownMenu
                                trigger={
                                    <button className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none text-left flex items-center justify-between">
                                        <span className="text-gray-900 text-xl truncate">
                                            {selectedTerm ? `ภาคการศึกษา ${selectedTerm}` : '-- เลือกภาคการศึกษา --'}
                                        </span>
                                        <span className="material-symbols-outlined text-gray-500 ml-2">
                                            expand_more
                                        </span>
                                    </button>
                                }
                                items={terms.map((term) => ({
                                    id: term,
                                    label: `ภาคการศึกษา ${term}`,
                                    onClick: () => setSelectedTerm(term)
                                }))}
                                position="left"
                                className="w-full md:w-96 max-h-96 overflow-y-auto"
                            />
                        </div>
                    )}
                </div>

                {/* Table */}
                {currentTermSubjects.length > 0 && (
                    <PaginatedTable
                        data={currentTermSubjects}
                        columns={[
                            { label: 'รายวิชา', width: '2fr', align: 'left' },
                            { label: 'หลักสูตร', width: '100px', align: 'center' },
                            { label: 'เค้าโครงรายวิชา', width: '150px', align: 'center' },
                            { label: 'ภาระงาน', width: '150px', align: 'center' },
                            { label: 'รายงานผล', width: '150px', align: 'center' }
                        ]}
                        defaultRowsPerPage={10}
                        renderRow={(subject) => (
                            <TableRow
                                data={subject}
                                columns={[
                                    {
                                        label: 'รายวิชา',
                                        width: '2fr',
                                        align: 'left',
                                        renderCell: (row) => (
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {row.subject_code}
                                                </div>
                                                <div className="text-xl text-gray-600">
                                                    {row.subject_name}
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        label: 'หลักสูตร',
                                        width: '100px',
                                        align: 'center',
                                        renderCell: (row) => (
                                            <div className="text-xl text-gray-900">{row.program_id || '-'}</div>
                                        )
                                    },
                                    {
                                        label: 'เค้าโครงรายวิชา',
                                        width: '150px',
                                        align: 'center',
                                        renderCell: (row) => (
                                            <DocumentStatusBadge
                                                status={row.outline?.status || null}
                                                roundNumber={row.outline?.round_number}
                                                onClick={() => handleStatusBadgeClick(row, 'outline')}
                                            />
                                        )
                                    },
                                    {
                                        label: 'ภาระงาน',
                                        width: '150px',
                                        align: 'center',
                                        renderCell: (row) => (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => {
                                                    const termLabel = row?.academic_sector && row?.academic_year
                                                        ? `ปีการศึกษา ${row.academic_sector}/${row.academic_year}`
                                                        : null;

                                                    navigate(`/term-subjects/${row.term_subject_id}/workload`, {
                                                        state: {
                                                            fromPath: '/my-subjects',
                                                            fromLabel: 'รายวิชาของฉัน',
                                                            termLabel,
                                                            subjectCode: row.subject_code
                                                        }
                                                    });
                                                }}
                                                className="text-xl"
                                            >
                                                กรอกภาระงาน
                                            </Button>
                                        )
                                    },
                                    {
                                        label: 'รายงานผล',
                                        width: '150px',
                                        align: 'center',
                                        renderCell: (row) => (
                                            <DocumentStatusBadge
                                                status={row.report?.status || null}
                                                roundNumber={row.report?.round_number}
                                                onClick={() => handleStatusBadgeClick(row, 'report')}
                                            />
                                        )
                                    }
                                ]}
                                className="hover:bg-gray-50"
                            />
                        )}
                    />
                )}

                {/* Empty state */}
                {!loading && (!selectedTerm || currentTermSubjects.length === 0) && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-xl text-gray-500">
                            {!selectedTerm ? 'กรุณาเลือกภาคการศึกษา' : 'ไม่มีรายวิชาที่มอบหมาย'}
                        </p>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <UploadModal
                isOpen={uploadModal.isOpen}
                subject={uploadModal.subject}
                documentType={uploadModal.documentType}
                onClose={() => setUploadModal({ isOpen: false, subject: null, documentType: '' })}
                onSuccess={handleUploadSuccess}
            />

            {/* History Modal */}
            <HistoryModal
                isOpen={historyModal.isOpen}
                termSubjectId={historyModal.termSubjectId}
                documentType={historyModal.documentType}
                onClose={() => setHistoryModal({ isOpen: false, termSubjectId: null, documentType: '' })}
                onReupload={() => {
                    if (uploadModal.subject) {
                        handleReuploadFromHistory(uploadModal.subject, historyModal.documentType);
                    }
                }}
                refetchSubjects={() => {
                    if (selectedTerm) {
                        loadSubjectsForTerm(selectedTerm);
                    }
                }}
            />
        </AppShell>
    );
}
