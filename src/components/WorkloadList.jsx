/**
 * WorkloadList Component
 * แสดงรายการภาระงานทั้งหมด
 */

import EditIcon from '@mui/icons-material/Edit';
import { PaginatedTable } from './common/PaginatedTable';
import TableRow from './common/TableRow';
import { Button } from './common/Button';
import { formatThaiDate, parseDate } from '../utils/dateUtils';

const WorkloadList = ({ workloads = [], termSubjectData, onEdit, onRefresh }) => {
    const columns = [
        {
            label: 'ชื่องาน',
            width: '35%',
            align: 'left',
            renderCell: (work) => (
                <div className="text-xl text-gray-900">{work.work_title}</div>
            ),
        },
        {
            label: 'เริ่มต้น',
            width: '20%',
            align: 'center',
            renderCell: (work) => (
                <div className="text-xl text-gray-900">
                    {work.start_date ? formatThaiDate(parseDate(work.start_date)) : '-'}
                </div>
            ),
        },
        {
            label: 'สิ้นสุด',
            width: '20%',
            align: 'center',
            renderCell: (work) => (
                <div className="text-xl text-gray-900">
                    {work.end_date ? formatThaiDate(parseDate(work.end_date)) : '-'}
                </div>
            ),
        },
        {
            label: 'ชั่วโมง/สัปดาห์',
            width: '15%',
            align: 'center',
            renderCell: (work) => (
                <div className="text-xl text-gray-900">{work.hours_per_week}</div>
            ),
        },
        {
            label: 'จัดการ',
            width: '10%',
            align: 'center',
            renderCell: (work) => (
                <Button
                    onClick={() => onEdit && onEdit(work)}
                    variant="secondary"
                    size="sm"
                    className="px-2 py-1 border-0 bg-transparent hover:bg-gray-100 !text-[#050C9C] hover:!text-[#040a7a]"
                    title="แก้ไข"
                >
                    <EditIcon className="w-5 h-5 mx-auto" />
                </Button>
            ),
        },
    ];

    return (
        <PaginatedTable
            data={workloads}
            columns={columns}
            defaultRowsPerPage={5}
            renderRow={(work) => (
                <TableRow
                    data={work}
                    columns={columns}
                    className="hover:bg-gray-50"
                />
            )}
        />
    );
};

export default WorkloadList;
