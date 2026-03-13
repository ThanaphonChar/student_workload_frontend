/**
 * CourseStatusTable Component
 * แสดงตารางสถานะรายวิชาทั้งหมด พร้อม sorting และ filtering
 */

import { useMemo } from 'react';
import { PaginatedTable } from '../common/PaginatedTable';
import { CourseStatusRow } from './CourseStatusRow';

export function CourseStatusTable({
    subjects = [],
    onRefresh,
    onViewDetail,
    userRole,
    loading = false
}) {
    // Sort subjects
    const sortedSubjects = useMemo(() => {
        return [...subjects].sort((a, b) => {
            const aValue = (a.code_eng || a.code_th || '').toLowerCase();
            const bValue = (b.code_eng || b.code_th || '').toLowerCase();
            if (aValue < bValue) return -1;
            if (aValue > bValue) return 1;
            return 0;
        });
    }, [subjects]);

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050C9C]"></div>
            </div>
        );
    }

    // Define columns
    const columns = [
        { label: 'รายวิชา', width: '25%', align: 'left' },
        { label: 'หลักสูตร', width: '10%', align: 'center' },
        { label: 'ชั้นปี', width: '10%', align: 'center' },
        { label: 'อาจารย์', width: '25%', align: 'center' },
        { label: 'เค้าโครงรายวิชา', width: '10%', align: 'center' },
        { label: 'ภาระงาน', width: '10%', align: 'center' },
        { label: 'รายงานผล', width: '10%', align: 'center' },
    ];

    return (
        <PaginatedTable
            data={sortedSubjects}
            columns={columns}
            renderRow={(subject) => (
                <CourseStatusRow
                    subject={subject}
                    onRefresh={onRefresh}
                    onViewDetail={onViewDetail}
                    userRole={userRole}
                />
            )}
        />
    );
}
