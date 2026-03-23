/**
 * CourseStatusRow Component
 * แสดงข้อมูลรายวิชาแต่ละตัวในรูปแบบ row
 */

import { ApprovalBadge, FileCountBadge } from './StatusBadge';
import { ProfessorDropdown } from './ProfessorDropdown';
import { StudentYearDropdown } from './StudentYearDropdown';
import { Button } from '../common/Button';

export function CourseStatusRow({ subject, onRefresh, onViewDetail, userRole }) {

    if (!subject) return null;

    const {
        id,
        subject_id,
        code_th,
        code_eng,
        name_th,
        name_eng,
        credit,
        program_year,
        student_year_ids = [],
        professors = [],
        outline_status,
        outline_approved,
        workload_status,
        report_status,
        report_approved,
        outline_file_count,
        workload_file_count,
        report_file_count,
    } = subject;

    const subjectCode = code_eng || code_th;
    const subjectName = name_th || name_eng;

    // Professor info
    const professor = professors.length > 0 ? professors[0] : null;
    const professorName = professor ? `${professor.first_name_th} ${professor.last_name_th}` : 'ยังไม่มีอาจารย์';
    const professorEmail = professor?.email || '';

    const canAssignProfessor = userRole === 'Academic Officer';
    const canEditStudentYear = userRole === 'Academic Officer';

    return (
        <div className="grid px-6 py-4" style={{ gridTemplateColumns: '25% 10% 10% 25% 10% 10% 10%' }}>
            {/* รหัสวิชา + ชื่อวิชา */}
            <div>
                <div className="mt-1 text-2xl font-bold text-gray-900">{subjectCode}</div>
                <div className="text-xl text-gray-500 uppercase mt-0.5">{subjectName}</div>
            </div>

            {/* หลักสูตร */}
            <div className="text-center flex items-center justify-center">
                <div className="text-xl text-gray-90">{program_year}</div>
            </div>

            {/* ชั้นปีที่เรียน */}
            <div className="text-center flex items-center justify-center">
                {canEditStudentYear ? (
                    student_year_ids.length > 0 ? (
                        <div className="flex-1 cursor-pointer rounded-lg p-2 transition-colors group">
                            <StudentYearDropdown
                                subjectId={subject_id}
                                currentYears={student_year_ids}
                                onSuccess={onRefresh}
                                trigger={<div className="text-xl text-gray-900 group-hover:text-[#050C9C]">{student_year_ids.sort((a, b) => a - b).join(', ')}</div>}
                            />
                        </div>
                    ) : (
                        <StudentYearDropdown
                            subjectId={subject_id}
                            currentYears={student_year_ids}
                            onSuccess={onRefresh}
                            trigger={
                                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-[#050C9C] hover:text-white text-gray-600 transition-colors">
                                    <span className="material-symbols-outlined text-2xl">add</span>
                                </button>
                            }
                        />
                    )
                ) : (
                    <div className="text-2xl text-gray-900">
                        {student_year_ids.length > 0 ? (
                            student_year_ids.sort((a, b) => a - b).join(', ')
                        ) : (
                            <span className="text-gray-400 italic">ยังไม่ระบุ</span>
                        )}
                    </div>
                )}
            </div>

            {/* อาจารย์ผู้สอน */}
            <div className="text-center flex items-center justify-center">
                {canAssignProfessor ? (
                    professor ? (
                        <div className="flex-1 cursor-pointer rounded-lg p-2 transition-colors group">
                            <ProfessorDropdown
                                termSubjectId={id}
                                onSuccess={onRefresh}
                                trigger={
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900 group-hover:text-[#050C9C]">
                                            {professorName}
                                        </div>
                                        <div className="text-xl text-gray-500">{professorEmail}</div>
                                    </div>
                                }
                            />
                        </div>
                    ) : (
                        <ProfessorDropdown
                            termSubjectId={id}
                            onSuccess={onRefresh}
                            trigger={
                                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-[#050C9C] hover:text-white text-gray-600 transition-colors">
                                    <span className="material-symbols-outlined text-2xl">add</span>
                                </button>
                            }
                        />
                    )
                ) : (
                    <div>
                        {professor ? (
                            <>
                                <div className="text-xl font-medium text-gray-900">{professorName}</div>
                                <div className="text-xl text-gray-500">{professorEmail}</div>
                            </>
                        ) : (
                            <span className="text-xl text-gray-400">ยังไม่มีอาจารย์</span>
                        )}
                    </div>
                )}
            </div>

            {/* สถานะ Outline */}
            <div className="flex items-center justify-center">
                {outline_status ? (
                    <ApprovalBadge status={outline_approved} />
                ) : (
                    <span className="text-xl text-gray-400">ยังไม่ส่ง</span>
                )}
            </div>

            {/* ภาระงาน - Action Button */}
            <div className="flex items-center justify-center">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onViewDetail(subject)}
                    className="text-xl"
                >
                    กรอกภาระงาน
                </Button>
            </div>

            {/* สถานะ Report */}
            <div className="flex items-center justify-center">
                {report_status ? (
                    <ApprovalBadge status={report_approved} />
                ) : (
                    <span className="text-xl text-gray-400">ยังไม่ส่ง</span>
                )}
            </div>
        </div>
    );
}
