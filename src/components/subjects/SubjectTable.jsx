/**
 * SubjectTable Component
 * แสดงรายการวิชาแบบ paginated
 * 
 * Features:
 * - Pagination และเลือกจำนวนแสดง
 * - Click row to edit
 * - Delete with confirmation
 * - Empty state
 */

import { PaginatedTable } from '../common/PaginatedTable';
import { TableRow } from '../common/TableRow';

export const SubjectTable = ({ subjects, onEdit, onDelete }) => {
    const handleDelete = (e, subject) => {
        e.stopPropagation();
        if (window.confirm(`คุณต้องการลบรายวิชา "${subject.name_th}" ใช่หรือไม่?`)) {
            onDelete(subject.id);
        }
    };

    if (subjects.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg
                    className="mx-auto h-12 w-12 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                </svg>
                <p className="mt-2 text-xl text-gray-500">ไม่พบข้อมูลรายวิชา</p>
            </div>
        );
    }

    const columns = [
        {
            label: 'รหัสวิชา',
            width: '12%',
            align: 'left',
            renderCell: (subject) => (
                <div className="text-xl font-bold text-gray-900">
                    {subject.code_eng || subject.code_th}
                </div>
            )
        },
        {
            label: 'ชื่อวิชา',
            width: '46%',
            align: 'left',
            renderCell: (subject) => (
                <div>
                    <div className="text-xl text-gray-900">{subject.name_th}</div>
                    {subject.name_eng && (
                        <div className="text-xl text-gray-500 uppercase">{subject.name_eng}</div>
                    )}
                </div>
            )
        },
        {
            label: 'หลักสูตร',
            width: '14%',
            align: 'center',
            renderCell: (subject) => (
                <div className="text-xl text-gray-900">{subject.program_year || '-'}</div>
            )
        },
        {
            label: 'หน่วยกิต',
            width: '14%',
            align: 'center',
            renderCell: (subject) => (
                <div className="text-xl text-gray-900">{subject.credit}</div>
            )
        },
        {
            label: 'จัดการ',
            width: '14%',
            align: 'center',
            renderCell: (subject) => (
                <button
                    onClick={(e) => handleDelete(e, subject)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="ลบรายวิชา"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            )
        }
    ];

    return (
        <PaginatedTable
            data={subjects}
            columns={columns}
            renderRow={(subject) => (
                <TableRow
                    data={subject}
                    columns={columns}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onEdit(subject.id)}
                />
            )}
        />
    );
};

export default SubjectTable;
