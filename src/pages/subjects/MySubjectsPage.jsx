/**
 * MySubjectsPage Component
 * หน้าแสดงรายวิชาที่มอบหมายให้อาจารย์ (Professor only)
 */

import { useState, useMemo } from 'react';
import { useMySubjects } from '../../hooks/useMySubjects';
import { useNavigate } from 'react-router-dom';

export default function MySubjectsPage() {
    const { subjects, loading, error } = useMySubjects();
    const navigate = useNavigate();
    const [selectedTerm, setSelectedTerm] = useState('');

    // จัดกลุ่มวิชาตาม term
    const subjectsByTerm = useMemo(() => {
        return subjects.reduce((acc, subject) => {
            const termKey = `${subject.academic_year}/${subject.term_name}`;
            if (!acc[termKey]) {
                acc[termKey] = {
                    term_name: subject.term_name,
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

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (subjects.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีรายวิชาที่มอบหมาย</h3>
                    <p className="text-gray-600">ยังไม่มีรายวิชาที่มอบหมายให้คุณในขณะนี้</p>
                </div>
            </div>
        );
    }

    // Get current term data
    const currentTermData = selectedTerm ? subjectsByTerm[selectedTerm] : null;

    // Handle subject click
    const handleSubjectClick = (termSubjectId) => {
        navigate(`/subjects/${termSubjectId}`);
    };

    // Main view
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        รายวิชาของฉัน
                    </h1>
                    <p className="text-gray-600">
                        รายวิชาที่มอบหมายให้คุณทั้งหมด ({subjects.length} รายวิชา)
                    </p>
                </div>

                {/* Term Selector */}
                <div className="mb-6">
                    <label htmlFor="term-select" className="block text-sm font-medium text-gray-700 mb-2">
                        เลือกภาคการศึกษา
                    </label>
                    <select
                        id="term-select"
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(e.target.value)}
                        className="block w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                        {sortedTerms.map(([termKey, termData]) => (
                            <option key={termKey} value={termKey}>
                                ภาคการศึกษา {termData.term_name} ปีการศึกษา {termData.academic_year} ({termData.subjects.length} รายวิชา)
                            </option>
                        ))}
                    </select>
                </div>

                {/* Subjects Display */}
                {currentTermData && (
                    <div>
                        {/* Term Info Badge */}
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                            <h2 className="text-xl font-semibold text-blue-900">
                                ภาคการศึกษา {currentTermData.term_name} ปีการศึกษา {currentTermData.academic_year}
                            </h2>
                            <p className="text-sm text-blue-700 mt-1">
                                {currentTermData.subjects.length} รายวิชา
                            </p>
                        </div>

                        {/* Subjects Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {currentTermData.subjects.map((subject) => (
                                <SubjectCard
                                    key={subject.term_subject_id}
                                    subject={subject}
                                    onClick={() => handleSubjectClick(subject.term_subject_id)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * SubjectCard Component
 * แสดงข้อมูลรายวิชาในรูปแบบการ์ด
 */
function SubjectCard({ subject, onClick }) {
    // กำหนดสีตามสถานะ
    const getStatusColor = (status) => {
        if (status === 'approved') return 'text-green-600 bg-green-50';
        if (status === 'rejected') return 'text-red-600 bg-red-50';
        return 'text-yellow-600 bg-yellow-50';
    };

    const getStatusText = (status) => {
        if (status === 'approved') return 'อนุมัติ';
        if (status === 'rejected') return 'ไม่อนุมัติ';
        return 'รอดำเนินการ';
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 overflow-hidden"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                <div className="text-sm font-medium text-blue-100 mb-1">
                    {subject.code_eng || subject.code_th}
                </div>
                <h3 className="text-white font-semibold text-lg leading-tight">
                    {subject.name_th || subject.name_eng}
                </h3>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
                {/* Credit */}
                <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{subject.credit} หน่วยกิต</span>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">สถานะมคอ.3:</span>
                        <span className={`px-2 py-1 rounded-full font-medium ${getStatusColor(subject.outline_approved)}`}>
                            {getStatusText(subject.outline_approved)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">สถานะรายงาน:</span>
                        <span className={`px-2 py-1 rounded-full font-medium ${getStatusColor(subject.report_approved)}`}>
                            {getStatusText(subject.report_approved)}
                        </span>
                    </div>
                </div>

                {/* Assigned Date */}
                <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        มอบหมายเมื่อ: {new Date(subject.assigned_at).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ดูรายละเอียด</span>
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
