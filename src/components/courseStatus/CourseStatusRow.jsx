/**
 * CourseStatusRow Component
 * แสดงข้อมูลรายวิชาแต่ละตัวในรูปแบบ row
 */

import { ApprovalBadge, StatusIcon, FileCountBadge } from './StatusBadge';
import { Button } from '../common/Button';
import { ProfessorDropdown } from './ProfessorDropdown';

export function CourseStatusRow({ subject, onRefresh, onViewDetail, userRole }) {
    // Early return ถ้าไม่มีข้อมูล
    if (!subject) return null;

    const {
        id,
        code_th,
        code_eng,
        name_th,
        name_eng,
        credit,
        program_year,
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

    // แสดงรหัสวิชา
    const subjectCode = code_eng || code_th;
    const subjectName = name_th || name_eng;

    // แสดงชื่ออาจารย์
    const professorNames = professors.length > 0
        ? professors.map(p => `${p.first_name_th} ${p.last_name_th}`).join(', ')
        : 'ยังไม่มีอาจารย์';

    // เช็คว่า user มีสิทธิ์ assign professor หรือไม่ (เฉพาะ Academic Officer)
    const canAssignProfessor = userRole === 'Academic Officer';

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            {/* รหัสวิชา + ชื่อวิชา */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">{subjectCode}</div>
                    <div className="text-sm text-gray-500">{subjectName}</div>
                </div>
            </td>

            {/* หลักสูตร/ชั้นปี */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{program_year || '-'}</div>
            </td>

            {/* หน่วยกิต */}
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm text-gray-900">{credit}</div>
            </td>

            {/* อาจารย์ผู้สอน */}
            <td className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-900 flex-1">
                        {professors.length === 0 ? (
                            <span className="text-gray-400 italic">ยังไม่มีอาจารย์</span>
                        ) : (
                            professorNames
                        )}
                    </div>
                    {canAssignProfessor && (
                        <ProfessorDropdown
                            termSubjectId={id}
                            onSuccess={onRefresh}
                        />
                    )}
                </div>
            </td>

            {/* สถานะ Outline */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    {/* <StatusIcon submitted={outline_status} /> */}
                    <div className="ml-2">
                        {outline_status ? (
                            <ApprovalBadge status={outline_approved} />
                        ) : (
                            <span className="text-sm text-gray-400">ยังไม่ส่ง</span>
                        )}
                        <FileCountBadge count={outline_file_count} type="outline" />
                    </div>
                </div>
            </td>

            {/* สถานะ Workload */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    {/* <StatusIcon submitted={workload_status} /> */}
                    <div className="ml-2">
                        {workload_status ? (
                            <span className="text-sm text-green-600 font-medium">ส่งแล้ว</span>
                        ) : (
                            <span className="text-sm text-gray-400">ยังไม่ส่ง</span>
                        )}
                        <FileCountBadge count={workload_file_count} type="workload" />
                    </div>
                </div>
            </td>

            {/* สถานะ Report */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    {/* <StatusIcon submitted={report_status} /> */}
                    <div className="ml-2">
                        {report_status ? (
                            <ApprovalBadge status={report_approved} />
                        ) : (
                            <span className="text-sm text-gray-400">ยังไม่ส่ง</span>
                        )}
                        <FileCountBadge count={report_file_count} type="report" />
                    </div>
                </div>
            </td>

            {/* Actions */}
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetail(subject)}
                >
                    รายละเอียด
                </Button>
            </td>
        </tr>
    );
}
