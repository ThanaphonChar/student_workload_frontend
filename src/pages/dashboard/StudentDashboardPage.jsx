/**
 * StudentDashboardPage
 * Read-only dashboard for student role with local subject selection only.
 */

import React, { useEffect, useMemo, useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import SummaryCard from '../../components/dashboard/SummaryCard';
import WorkloadAveragePanel from '../../components/dashboard/WorkloadAveragePanel';
import WorkloadChart from '../../components/dashboard/WorkloadChart';
import { useDashboardData } from '../../hooks/useDashboardData';
import { STAT_CARD_CONFIG } from '../../constants/dashboard';
import { DropdownMenu } from '../../components/common/DropdownMenu';
import { useAuth } from '../../hooks/useAuth';
import * as subjectService from '../../services/subjectService';
import * as termSubjectService from '../../services/termSubjectService';

function getStudentCode(user) {
    const candidates = [
        user?.username,
        user?.student_id,
        user?.studentId,
        user?.student_code,
        user?.studentCode,
    ];

    const found = candidates.find((value) => typeof value === 'string' && /^\d{2,}$/.test(value));
    return found || '';
}

function deriveStudentYear(studentCode) {
    if (!studentCode || studentCode.length < 2) {
        return 1;
    }

    const entryYearPrefix = parseInt(studentCode.slice(0, 2), 10);
    if (Number.isNaN(entryYearPrefix)) {
        return 1;
    }

    const buddhistYear = new Date().getFullYear() + 543;
    const currentYearPrefix = buddhistYear % 100;
    let year = currentYearPrefix - entryYearPrefix;

    if (year <= 0) {
        year += 100;
    }

    if (year < 1) return 1;
    if (year > 8) return 8;
    return year;
}

function getStudentSubjectKey(userId) {
    return `student_dashboard_subjects_${userId || 'anonymous'}`;
}

const StudentDashboardPage = () => {
    const { user, userId } = useAuth();
    const studentCode = getStudentCode(user);
    const studentYear = deriveStudentYear(studentCode);

    const [selectedYears, setSelectedYears] = useState([studentYear]);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [availableSubjectsInTerm, setAvailableSubjectsInTerm] = useState([]);
    const [defaultSubjectsForYear, setDefaultSubjectsForYear] = useState([]);
    const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
    const [subjectsInCurrentTerm, setSubjectsInCurrentTerm] = useState([]);
    const [subjectToAdd, setSubjectToAdd] = useState('');
    const [subjectError, setSubjectError] = useState('');
    const [subjectLoading, setSubjectLoading] = useState(false);

    const {
        stats,
        averageWorkload,
        chartData,
        allTerms,
        selectedTermId,
        setSelectedTermId,
        isLoading,
        error,
    } = useDashboardData(selectedYears);

    useEffect(() => {
        setSelectedYears([studentYear]);
    }, [studentYear]);

    useEffect(() => {
        const fetchAllSubjects = async () => {
            try {
                const response = await subjectService.getSubjects({
                    is_active: true,
                });

                const subjects = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.subjects)
                        ? response.subjects
                        : Array.isArray(response?.data?.subjects)
                            ? response.data.subjects
                            : [];

                setAvailableSubjects(subjects);
            } catch (fetchError) {
                setAvailableSubjects([]);
            }
        };

        fetchAllSubjects();
    }, []);

    useEffect(() => {
        const storageKey = getStudentSubjectKey(userId);
        localStorage.setItem(storageKey, JSON.stringify(selectedSubjectIds));
    }, [selectedSubjectIds, userId]);

    // Fetch subjects available in current term and determine defaults by year
    useEffect(() => {
        const fetchTermSubjectsAndDefaults = async () => {
            if (!selectedTermId) {
                setSubjectsInCurrentTerm([]);
                setAvailableSubjectsInTerm([]);
                setDefaultSubjectsForYear([]);
                return;
            }

            setSubjectLoading(true);
            setSubjectError('');

            try {
                const response = await termSubjectService.getTermSubjectsByTermId(selectedTermId);
                const termSubjects = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.termSubjects)
                        ? response.termSubjects
                        : Array.isArray(response?.data?.termSubjects)
                            ? response.data.termSubjects
                            : [];

                // All subject IDs available in current term (active)
                const subjectIdsInTerm = termSubjects
                    .filter((ts) => ts.is_active !== false)
                    .map((ts) => ts.subject_id);

                // Subject IDs for student's year in current term (defaults)
                const defaultIds = termSubjects
                    .filter(
                        (ts) => ts.is_active !== false
                            && ts.student_year_id === studentYear,
                    )
                    .map((ts) => ts.subject_id);

                setSubjectsInCurrentTerm(subjectIdsInTerm);
                setAvailableSubjectsInTerm(subjectIdsInTerm);
                setDefaultSubjectsForYear(defaultIds);

                // Restore from localStorage if exists, otherwise use defaults
                const storageKey = getStudentSubjectKey(userId);
                const stored = localStorage.getItem(storageKey);
                if (stored) {
                    const storedIds = JSON.parse(stored);
                    // Validate stored IDs exist in current term
                    const validIds = storedIds.filter((id) => subjectIdsInTerm.includes(id));
                    setSelectedSubjectIds(validIds.length > 0 ? validIds : defaultIds);
                } else {
                    // First time: use defaults for this year in this term
                    setSelectedSubjectIds(defaultIds);
                }
            } catch (err) {
                setSubjectError(err?.message || 'ไม่สามารถโหลดข้อมูลรายวิชาของเทอมได้');
                setSubjectsInCurrentTerm([]);
                setAvailableSubjectsInTerm([]);
                setDefaultSubjectsForYear([]);
                setSelectedSubjectIds([]);
            } finally {
                setSubjectLoading(false);
            }
        };

        fetchTermSubjectsAndDefaults();
    }, [selectedTermId, studentYear, userId]);

    const currentTerm = allTerms.find((t) => t.id === selectedTermId);

    // Only count selected subjects that are active in current term
    const effectiveSelectedSubjectIds = useMemo(() => {
        if (subjectsInCurrentTerm.length === 0) {
            return [];
        }
        return selectedSubjectIds.filter((id) => subjectsInCurrentTerm.includes(id));
    }, [selectedSubjectIds, subjectsInCurrentTerm]);

    const selectedSubjects = useMemo(() => {
        return availableSubjects.filter((subject) => effectiveSelectedSubjectIds.includes(subject.id));
    }, [availableSubjects, effectiveSelectedSubjectIds]);

    // Addable subjects are those in current term but not yet selected
    const addableSubjects = useMemo(() => {
        return availableSubjects.filter(
            (subject) => availableSubjectsInTerm.includes(subject.id)
                && !selectedSubjectIds.includes(subject.id),
        );
    }, [availableSubjects, availableSubjectsInTerm, selectedSubjectIds]);

    const handleTermChange = (termId) => {
        setSelectedTermId(parseInt(termId, 10));
    };

    const handleYearFilterChange = (newYears) => {
        // Student sees dashboard by own year only.
        setSelectedYears(newYears.length > 0 ? [newYears[0]] : [studentYear]);
    };

    const handleAddSubject = () => {
        const subjectId = parseInt(subjectToAdd, 10);
        if (!subjectId) return;

        if (!selectedSubjectIds.includes(subjectId)) {
            setSelectedSubjectIds((prev) => [...prev, subjectId]);
        }

        setSubjectToAdd('');
    };

    const handleRemoveSubject = (subjectId) => {
        setSelectedSubjectIds((prev) => prev.filter((id) => id !== subjectId));
    };

    const formatThaiDate = (dateValue) => {
        if (!dateValue) return '-';

        return new Date(dateValue).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <AppShell title="แดชบอร์ดนักศึกษา">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050C9C] mx-auto" />
                        <p className="mt-4 text-gray-600 text-xl">กำลังโหลดข้อมูล...</p>
                    </div>
                </div>
            </AppShell>
        );
    }

    if (error) {
        return (
            <AppShell title="แดชบอร์ดนักศึกษา">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">เกิดข้อผิดพลาด</h3>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell title="แดชบอร์ดนักศึกษา">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ดนักศึกษา</h1>
                        <p className="text-xl text-gray-600 mt-1">
                            รหัสนักศึกษา: {studentCode || '-'} | ชั้นปีที่คำนวณได้: {studentYear}
                        </p>
                    </div>
                    <div className="w-full md:w-auto md:ml-auto">
                        <div className="flex-1 flex items-center gap-4">
                            <DropdownMenu
                                trigger={(
                                    <button className="flex-none w-64 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none text-left flex items-center justify-between">
                                        <span className="text-gray-900 text-xl truncate">
                                            {currentTerm
                                                ? `ภาคการศึกษา ${currentTerm.academic_sector}/${currentTerm.academic_year}${currentTerm.is_active ? ' (ปัจจุบัน)' : ''}`
                                                : 'เลือกภาคการศึกษา'}
                                        </span>
                                        <span className="material-symbols-outlined text-gray-500">expand_more</span>
                                    </button>
                                )}
                                items={allTerms.map((term) => ({
                                    id: term.id,
                                    label: `ภาคการศึกษา ${term.academic_sector}/${term.academic_year}${term.is_active ? ' (ปัจจุบัน)' : ''}`,
                                    onClick: () => handleTermChange(term.id),
                                }))}
                                position="left"
                                className="w-96 max-h-96 overflow-y-auto"
                            />\
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-[#DDE3FF] bg-[#F8FAFF] p-4 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-end gap-3">
                        <div className="flex-1">
                            <p className="text-xl font-semibold text-[#050C9C]">จัดการรายวิชาส่วนตัวสำหรับการดูแดชบอร์ด</p>
                            <p className="text-lg text-gray-600">
                                ดึงรายวิชาของชั้นปี {studentYear} ในเทอมนี้เป็น default
                                แต่สามารถเพิ่มรายวิชาอื่นในเทอมนี้ได้ตามต้องการ
                                และบันทึกเฉพาะบัญชีของคุณเท่านั้น
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                className="min-w-[260px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-lg"
                                value={subjectToAdd}
                                onChange={(event) => setSubjectToAdd(event.target.value)}
                                disabled={subjectLoading || addableSubjects.length === 0}
                            >
                                <option value="">เลือกรายวิชาเพื่อเพิ่ม</option>
                                {addableSubjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {(subject.code_eng || subject.code_th || '-')} - {(subject.name_th || subject.name_eng || '-')}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="rounded-lg bg-[#050C9C] px-4 py-2 text-lg font-medium text-white disabled:opacity-50"
                                onClick={handleAddSubject}
                                disabled={!subjectToAdd}
                            >
                                เพิ่ม
                            </button>
                        </div>
                    </div>

                    {subjectError ? <p className="text-red-600 text-lg">{subjectError}</p> : null}

                    <div className="flex flex-wrap gap-2">
                        {selectedSubjectIds.length === 0 ? (
                            <p className="text-lg text-gray-500">ยังไม่มีรายวิชาที่เลือก</p>
                        ) : (
                            <>
                                {selectedSubjects.length > 0 && (
                                    <>
                                        <p className="w-full text-sm text-gray-600">
                                            <strong>รายวิชาที่คำนวณในภาคการศึกษานี้:</strong>
                                        </p>
                                        {selectedSubjects.map((subject) => {
                                            const isDefault = defaultSubjectsForYear.includes(subject.id);
                                            return (
                                                <div
                                                    key={subject.id}
                                                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${isDefault
                                                            ? 'border-[#B9C6FF] bg-white'
                                                            : 'border-blue-400 bg-blue-50'
                                                        }`}
                                                >
                                                    <span className="text-lg text-gray-800">
                                                        {(subject.code_eng || subject.code_th || '-')} - {(subject.name_th || subject.name_eng || '-')}
                                                    </span>
                                                    {!isDefault && (
                                                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                                            เพิ่มเอง
                                                        </span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="text-red-600 text-base font-medium"
                                                        onClick={() => handleRemoveSubject(subject.id)}
                                                    >
                                                        ลบ
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                                {selectedSubjectIds.filter((id) => !subjectsInCurrentTerm.includes(id)).length > 0 && (
                                    <>
                                        <p className="w-full text-sm text-gray-500 mt-2">
                                            <strong>รายวิชาที่เลือกแต่ไม่เปิดในภาคการศึกษานี้ (ไม่นำมาคำนวณ):</strong>
                                        </p>
                                        {availableSubjects
                                            .filter((subject) => selectedSubjectIds.includes(subject.id) && !subjectsInCurrentTerm.includes(subject.id))
                                            .map((subject) => (
                                                <div
                                                    key={subject.id}
                                                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 opacity-60"
                                                >
                                                    <span className="text-lg text-gray-600">
                                                        {(subject.code_eng || subject.code_th || '-')} - {(subject.name_th || subject.name_eng || '-')}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="text-gray-500 text-base font-medium"
                                                        onClick={() => handleRemoveSubject(subject.id)}
                                                    >
                                                        ลบ
                                                    </button>
                                                </div>
                                            ))}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-6">
                    <div className="col-span-1">
                        <WorkloadAveragePanel averageData={averageWorkload} />
                    </div>
                    <div className="col-span-3">
                        <WorkloadChart
                            semester={currentTerm?.academic_sector || 'ภาคการศึกษา'}
                            termYear={currentTerm?.academic_year || 'ปีการศึกษา'}
                            chartData={chartData}
                            selectedYear={selectedYears[0]}
                            onFilterChange={handleYearFilterChange}
                        />
                    </div>
                </div>
            </div>
        </AppShell>
    );
};

export default StudentDashboardPage;
