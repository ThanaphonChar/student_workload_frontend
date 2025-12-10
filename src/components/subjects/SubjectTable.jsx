/**
 * SubjectTable Component
 * แสดงรายการวิชาในรูปแบบ MUI Table พร้อม sort, edit, delete
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    IconButton,
    Chip,
    Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const SubjectTable = ({ subjects, onDelete }) => {
    const navigate = useNavigate();
    const [orderBy, setOrderBy] = useState('code_th');
    const [order, setOrder] = useState('asc');

    /**
     * Handle sort
     */
    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    /**
     * Sort data
     */
    const sortedSubjects = [...subjects].sort((a, b) => {
        let aVal = a[orderBy];
        let bVal = b[orderBy];

        // Handle null/undefined
        if (aVal == null) aVal = '';
        if (bVal == null) bVal = '';

        // Convert to string for comparison
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();

        if (order === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
    });

    /**
     * Handle edit
     */
    const handleEdit = (id) => {
        navigate(`/subjects/edit/${id}`);
    };

    /**
     * Handle delete with confirmation
     */
    const handleDelete = (subject) => {
        if (window.confirm(`คุณต้องการลบรายวิชา "${subject.name_th}" ใช่หรือไม่?`)) {
            onDelete(subject.id);
        }
    };

    return (
        <TableContainer component={Paper} elevation={0} className="border border-gray-200 rounded-lg overflow-x-auto">
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow className="bg-[#050C9C]">
                        <TableCell
                            align="center"
                            className="text-white font-bold py-2 text-sm sm:text-base"
                        >
                            <TableSortLabel
                                active={orderBy === 'code_eng'}
                                direction={orderBy === 'code_eng' ? order : 'asc'}
                                onClick={() => handleSort('code_eng')}
                                sx={{
                                    color: 'white !important',
                                    '&:hover': { color: 'white !important' },
                                    '& .MuiTableSortLabel-icon': { color: 'white !important' },
                                }}
                            >
                                รหัสวิชา
                            </TableSortLabel>
                        </TableCell>
                        <TableCell
                            align="center"
                            className="text-white font-bold py-2 text-sm sm:text-base"
                        >
                            <TableSortLabel
                                active={orderBy === 'name_eng'}
                                direction={orderBy === 'name_eng' ? order : 'asc'}
                                onClick={() => handleSort('name_eng')}
                                sx={{
                                    color: 'white !important',
                                    '&:hover': { color: 'white !important' },
                                    '& .MuiTableSortLabel-icon': { color: 'white !important' },
                                }}
                            >
                                ชื่อวิชา
                            </TableSortLabel>
                        </TableCell>
                        <TableCell
                            align="center"
                            className="text-white font-bold py-2 text-sm sm:text-base"
                        >
                            <TableSortLabel
                                active={orderBy === 'program_year'}
                                direction={orderBy === 'program_year' ? order : 'asc'}
                                onClick={() => handleSort('program_year')}
                                sx={{
                                    color: 'white !important',
                                    '&:hover': { color: 'white !important' },
                                    '& .MuiTableSortLabel-icon': { color: 'white !important' },
                                }}
                            >
                                หลักสูตร
                            </TableSortLabel>
                        </TableCell>
                        <TableCell
                            align="center"
                            className="text-white font-bold py-2 text-sm sm:text-base"
                        >
                            <TableSortLabel
                                active={orderBy === 'credit'}
                                direction={orderBy === 'credit' ? order : 'asc'}
                                onClick={() => handleSort('credit')}
                                sx={{
                                    color: 'white !important',
                                    '&:hover': { color: 'white !important' },
                                    '& .MuiTableSortLabel-icon': { color: 'white !important' },
                                }}
                            >
                                หน่วยกิต
                            </TableSortLabel>
                        </TableCell>
                        <TableCell
                            align="center"
                            className="text-white font-bold py-2 text-sm sm:text-base"
                        >
                            <TableSortLabel
                                active={orderBy === 'student_year'}
                                direction={orderBy === 'student_year' ? order : 'asc'}
                                onClick={() => handleSort('student_year')}
                                sx={{
                                    color: 'white !important',
                                    '&:hover': { color: 'white !important' },
                                    '& .MuiTableSortLabel-icon': { color: 'white !important' },
                                }}
                            >
                                ชั้นปี
                            </TableSortLabel>
                        </TableCell>
                        <TableCell
                            align="center"
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                py: 2,
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                        >
                            สถานะ
                        </TableCell>
                        <TableCell
                            align="center"
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                py: 2,
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                        >
                            จัดการ
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedSubjects.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                <Box className="text-gray-500">
                                    <span className="material-symbols-outlined text-4xl sm:text-5xl mb-2 block">
                                        inbox
                                    </span>
                                    <p className="text-sm sm:text-base">ไม่พบข้อมูลรายวิชา</p>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedSubjects.map((subject) => (
                            <TableRow
                                key={subject.id}
                                hover
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell sx={{ py: 1.5 }}>
                                    <div>
                                        <div className="font-semibold text-sm sm:text-base text-gray-900">
                                            {subject.code_th || subject.code_eng}
                                        </div>
                                        {subject.code_eng && subject.code_th !== subject.code_eng && (
                                            <div className="text-xs sm:text-sm text-gray-500">
                                                {subject.code_eng}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell sx={{ py: 1.5 }}>
                                    <div>
                                        <div className="text-sm sm:text-base text-gray-900">
                                            {subject.name_th}
                                        </div>
                                        {subject.name_eng && (
                                            <div className="text-xs sm:text-sm text-gray-500 uppercase">
                                                {subject.name_eng}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell align="center" sx={{ py: 1.5 }}>
                                    <span className="text-sm sm:text-base font-medium text-gray-900">
                                        {subject.program_year || '-'}
                                    </span>
                                </TableCell>
                                <TableCell align="center" sx={{ py: 1.5 }}>
                                    <span className="text-sm sm:text-base font-medium text-gray-900">
                                        {subject.credit}
                                    </span>
                                </TableCell>
                                <TableCell align="center" sx={{ py: 1.5 }}>
                                    <span className="text-sm sm:text-base font-medium text-gray-900">
                                        {subject.student_year || '-'}
                                    </span>
                                </TableCell>
                                <TableCell align="center" sx={{ py: 2 }}>
                                    {subject.is_active ? (
                                        <Chip
                                            label="เปิดใช้งาน"
                                            color="success"
                                            size="small"
                                            sx={{ fontWeight: 500 }}
                                        />
                                    ) : (
                                        <Chip
                                            label="ปิดใช้งาน"
                                            color="default"
                                            size="small"
                                            sx={{ fontWeight: 500 }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell align="center" sx={{ py: 2 }}>
                                    <Box className="flex items-center justify-center gap-1">
                                        <IconButton
                                            onClick={() => handleEdit(subject.id)}
                                            size="small"
                                            className="text-blue-600 hover:bg-blue-50"
                                            title="แก้ไขรายวิชา"
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(subject)}
                                            size="small"
                                            className="text-red-600 hover:bg-red-50"
                                            title="ลบรายวิชา"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SubjectTable;
