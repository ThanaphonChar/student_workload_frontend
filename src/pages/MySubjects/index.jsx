import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import { DropdownMenu } from '../../components/common/DropdownMenu';
import { PaginatedTable } from '../../components/common/PaginatedTable';
import { TableRow } from '../../components/common/TableRow';
import { Button } from '../../components/common/Button';
import { DocumentStatusBadge } from '../../components/MySubjects/DocumentStatusBadge';
import { UploadModal } from '../../components/MySubjects/UploadModal';
import { HistoryModal } from '../../components/MySubjects/HistoryModal';
import { DeadlineBanner } from '../../components/MySubjects/DeadlineBanner';
import { getAssignedSubjects, getMySubjects } from '../../services/submission.service';

const sortTermsDesc = (a, b) => {
    const yearDiff = Number(b.academic_year || 0) - Number(a.academic_year || 0);
    if (yearDiff !== 0) return yearDiff;
    return Number(b.academic_sector || 0) - Number(a.academic_sector || 0);
};

export default function MySubjectsIndexPage() {
    const navigate = useNavigate();
    const [baseSubjects, setBaseSubjects] = useState([]);
    const [selectedTermId, setSelectedTermId] = useState(null);
    const [statusRows, setStatusRows] = useState([]);
    const [loadingBase, setLoadingBase] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [uploadModal, setUploadModal] = useState({
        isOpen: false,
        termSubjectId: null,
        subjectCode: '',
        subjectName: '',
        documentType: 'outline',
    });

    const [historyModal, setHistoryModal] = useState({
        isOpen: false,
        termSubjectId: null,
        subjectCode: '',
        subjectName: '',
        documentType: 'outline',
    });

    const groupedTerms = useMemo(() => {
        const map = new Map();

        baseSubjects.forEach((subject) => {
            const termId = Number(subject.term_id);
            if (!map.has(termId)) {
                map.set(termId, {
                    term_id: termId,
                    academic_year: subject.academic_year,
                    academic_sector: subject.academic_sector,
                    subjects: [],
                });
            }

            map.get(termId).subjects.push(subject);
        });

        return Array.from(map.values()).sort(sortTermsDesc);
    }, [baseSubjects]);

    const selectedTerm = useMemo(() => {
        return groupedTerms.find((term) => term.term_id === Number(selectedTermId)) || null;
    }, [groupedTerms, selectedTermId]);

    const statusMap = useMemo(() => {
        const map = new Map();
        statusRows.forEach((item) => {
            map.set(Number(item.term_subject_id), item);
        });
        return map;
    }, [statusRows]);

    const mergedRows = useMemo(() => {
        const subjects = selectedTerm?.subjects || [];

        return subjects.map((subject) => {
            const status = statusMap.get(Number(subject.term_subject_id));

            return {
                ...subject,
                subject_code: status?.subject_code || subject.code_eng || subject.code_th,
                subject_name: status?.subject_name || subject.name_th || subject.name_eng,
                outline: status?.outline || null,
                report: status?.report || null,
            };
        });
    }, [selectedTerm, statusMap]);

    const termStartDate = useMemo(() => {
        return statusRows[0]?.term_start_date || null;
    }, [statusRows]);

    const loadAssignedSubjects = async () => {
        setLoadingBase(true);
        setErrorMessage('');

        try {
            const subjects = await getAssignedSubjects();
            setBaseSubjects(Array.isArray(subjects) ? subjects : []);
        } catch (error) {
            setErrorMessage(error?.data?.message || error?.message || 'ไม่สามารถโหลดรายวิชาที่ได้รับมอบหมายได้');
        } finally {
            setLoadingBase(false);
        }
    };

    const loadSubmissionStatus = async (termId) => {
        if (!termId) return;

        setLoadingStatus(true);
        setErrorMessage('');

        try {
            const rows = await getMySubjects(termId);
            setStatusRows(Array.isArray(rows) ? rows : []);
        } catch (error) {
            setErrorMessage(error?.data?.message || error?.message || 'ไม่สามารถโหลดสถานะเอกสารได้');
        } finally {
            setLoadingStatus(false);
        }
    };

    useEffect(() => {
        loadAssignedSubjects();
    }, []);

    useEffect(() => {
        if (!selectedTermId && groupedTerms.length > 0) {
            setSelectedTermId(groupedTerms[0].term_id);
        }
    }, [groupedTerms, selectedTermId]);

    useEffect(() => {
        if (selectedTermId) {
            loadSubmissionStatus(selectedTermId);
        }
    }, [selectedTermId]);

    const openUploadModal = (row, documentType) => {
        setUploadModal({
            isOpen: true,
            termSubjectId: row.term_subject_id,
            subjectCode: row.subject_code,
            subjectName: row.subject_name,
            documentType,
        });
    };

    const openHistoryModal = (row, documentType) => {
        setHistoryModal({
            isOpen: true,
            termSubjectId: row.term_subject_id,
            subjectCode: row.subject_code,
            subjectName: row.subject_name,
            documentType,
        });
    };

    const handleBadgeClick = (row, documentType) => {
        const statusData = documentType === 'outline' ? row.outline : row.report;
        if (statusData === null) {
            openUploadModal(row, documentType);
            return;
        }
        openHistoryModal(row, documentType);
    };

    if (loadingBase) {
        return (
            <AppShell title="รายวิชาของฉัน">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050C9C] mx-auto" />
                        <p className="mt-4 text-xl text-gray-600">กำลังโหลดข้อมูล...</p>
                    </div>
                </div>
            </AppShell>
        );
    }

    if (!loadingBase && groupedTerms.length === 0) {
        return (
            <AppShell title="รายวิชาของฉัน">
                <div className="text-center py-12">
                    <h3 className="text-2xl text-gray-900">ไม่มีรายวิชาที่มอบหมาย</h3>
                    <p className="text-xl text-gray-600 mt-2">ยังไม่มีรายวิชาที่มอบหมายให้คุณในขณะนี้</p>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell title="รายวิชาของฉัน">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-6">
                        <h1 className="text-4xl font-bold text-gray-900 mt-4">รายวิชาของฉัน</h1>
                    </div>

                    {groupedTerms.length > 1 ? (
                        <DropdownMenu
                            trigger={
                                <button className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none text-left flex items-center justify-between">
                                    <span className="text-xl text-gray-900 truncate">
                                        {selectedTerm
                                            ? `ภาคการศึกษา ${selectedTerm.academic_sector}/${selectedTerm.academic_year} (${selectedTerm.subjects.length} รายวิชา)`
                                            : 'เลือกภาคการศึกษา'}
                                    </span>
                                    <span className="material-symbols-outlined text-gray-500">expand_more</span>
                                </button>
                            }
                            items={groupedTerms.map((term) => ({
                                id: term.term_id,
                                label: `ภาคการศึกษา ${term.academic_sector}/${term.academic_year} (${term.subjects.length} รายวิชา)`,
                                onClick: () => setSelectedTermId(term.term_id),
                            }))}
                            position="left"
                            className="w-full md:w-96 max-h-96 overflow-y-auto"
                        />
                    ) : null}
                </div>

                {errorMessage ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <p className="text-lg text-red-700">{errorMessage}</p>
                    </div>
                ) : null}

                {loadingStatus ? (
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <p className="text-xl text-gray-600">กำลังโหลดสถานะเอกสาร...</p>
                    </div>
                ) : null}

                <PaginatedTable
                    data={mergedRows}
                    columns={[
                        { label: 'รายวิชา', width: '2fr', align: 'left' },
                        { label: 'หลักสูตร', width: '100px', align: 'center' },
                        { label: 'เค้าโครงรายวิชา', width: '180px', align: 'center' },
                        { label: 'ภาระงาน', width: '150px', align: 'center' },
                        { label: 'รายงานผล', width: '180px', align: 'center' },
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
                                            <div className="text-2xl font-bold text-black">{row.subject_code}</div>
                                            <div className="text-xl text-[#757575]">{row.subject_name}</div>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'หลักสูตร',
                                    width: '100px',
                                    align: 'center',
                                    renderCell: (row) => (
                                        <div className="text-xl text-gray-900">{row.program_year || row.program_id || '-'}</div>
                                    ),
                                },
                                {
                                    label: 'เค้าโครงรายวิชา',
                                    width: '180px',
                                    align: 'center',
                                    renderCell: (row) => (
                                        <DocumentStatusBadge
                                            status={row.outline?.status || null}
                                            roundNumber={row.outline?.round_number || null}
                                            onClick={() => handleBadgeClick(row, 'outline')}
                                        />
                                    ),
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
                                                const subjectCode = row?.subject_code || null;

                                                navigate(`/term-subjects/${row.term_subject_id}/workload`, {
                                                    state: {
                                                        fromPath: '/my-subjects',
                                                        fromLabel: 'รายวิชาของฉัน',
                                                        termLabel,
                                                        subjectCode,
                                                    },
                                                });
                                            }}
                                            className="text-xl font-bold px-4 bg-[#dadbf0] text-[#050C9C] hover:bg-[#c0c2e8]"
                                        >
                                            <span className="text-[#050C9C]">ดูภาระงาน</span>
                                        </Button>
                                    ),
                                },
                                {
                                    label: 'รายงานผล',
                                    width: '180px',
                                    align: 'center',
                                    renderCell: (row) => (
                                        <DocumentStatusBadge
                                            status={row.report?.status || null}
                                            roundNumber={row.report?.round_number || null}
                                            onClick={() => handleBadgeClick(row, 'report')}
                                        />
                                    ),
                                },
                            ]}
                            className="hover:bg-gray-50"
                        />
                    )}
                />

                <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 px-4">
                    <div className="pointer-events-auto mx-auto max-w-7xl">
                        <DeadlineBanner termStartDate={termStartDate} offsetDays={7} />
                    </div>
                </div>
            </div>

            <UploadModal
                isOpen={uploadModal.isOpen}
                onClose={() => setUploadModal({ isOpen: false, termSubjectId: null, subjectCode: '', subjectName: '', documentType: 'outline' })}
                termSubjectId={uploadModal.termSubjectId}
                subjectCode={uploadModal.subjectCode}
                subjectName={uploadModal.subjectName}
                documentType={uploadModal.documentType}
                onSuccess={() => {
                    if (selectedTermId) {
                        loadSubmissionStatus(selectedTermId);
                    }
                }}
            />

            <HistoryModal
                isOpen={historyModal.isOpen}
                onClose={() => setHistoryModal({ isOpen: false, termSubjectId: null, subjectCode: '', subjectName: '', documentType: 'outline' })}
                termSubjectId={historyModal.termSubjectId}
                subjectCode={historyModal.subjectCode}
                subjectName={historyModal.subjectName}
                documentType={historyModal.documentType}
                onReupload={() => {
                    setUploadModal({
                        isOpen: true,
                        termSubjectId: historyModal.termSubjectId,
                        subjectCode: historyModal.subjectCode,
                        subjectName: historyModal.subjectName,
                        documentType: historyModal.documentType,
                    });
                }}
            />
        </AppShell>
    );
}
