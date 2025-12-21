/**
 * SubjectTable Component
 * แสดงรายการวิชาในรูปแบบ MUI Table
 * 
 * Features:
 * - Sortable columns
 * - Click row to edit
 * - Delete with confirmation
 * - Empty state
 */

import { useState } from 'react';
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
    Box,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InboxIcon from '@mui/icons-material/Inbox';
import { FONT_SIZES } from '../../theme';

// Shared styles
const HEADER_CELL_STYLE = {
    color: 'white',
    fontSize: FONT_SIZES.large,
    fontWeight: 700,
};

const SORT_LABEL_STYLE = {
    color: 'white !important',
    '&:hover': { color: 'white !important' },
    '& .MuiTableSortLabel-icon': {
        color: 'white !important',
        opacity: 0.7,
    },
};

// Column configuration
const COLUMNS = [
    { id: 'code_eng', label: 'รหัสวิชา', sortable: true, align: 'left' },
    { id: 'name_th', label: 'ชื่อวิชา', sortable: false, align: 'left' },
    { id: 'program_year', label: 'หลักสูตร', sortable: true, align: 'center' },
    { id: 'credit', label: 'หน่วยกิต', sortable: true, align: 'center' },
    { id: 'actions', label: 'จัดการ', sortable: false, align: 'center', width: 100 },
];

export const SubjectTable = ({ subjects, onEdit, onDelete }) => {
    const [orderBy, setOrderBy] = useState('code_eng');
    const [order, setOrder] = useState('asc');

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedSubjects = [...subjects].sort((a, b) => {
        let aVal = a[orderBy] ?? '';
        let bVal = b[orderBy] ?? '';

        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();

        if (order === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
    });

    const handleDelete = (e, subject) => {
        e.stopPropagation();
        if (window.confirm(`คุณต้องการลบรายวิชา "${subject.name_th}" ใช่หรือไม่?`)) {
            onDelete(subject.id);
        }
    };

    if (subjects.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    p: 8,
                    textAlign: 'center',
                }}
            >
                <InboxIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography sx={{ fontSize: FONT_SIZES.medium, color: 'text.secondary' }}>
                    ไม่พบข้อมูลรายวิชา
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#050C9C' }}>
                        {COLUMNS.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align}
                                sx={{ ...HEADER_CELL_STYLE, width: column.width }}
                            >
                                {column.sortable ? (
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={orderBy === column.id ? order : 'asc'}
                                        onClick={() => handleSort(column.id)}
                                        sx={SORT_LABEL_STYLE}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                ) : (
                                    column.label
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {sortedSubjects.map((subject) => (
                        <TableRow
                            key={subject.id}
                            hover
                            onClick={() => onEdit(subject.id)}
                            sx={{
                                cursor: 'pointer',
                                '&:last-child td': { border: 0 },
                            }}
                        >
                            <TableCell>
                                <Typography sx={{ fontSize: FONT_SIZES.large, fontWeight: 700 }}>
                                    {subject.code_eng || subject.code_th}
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <Box>
                                    <Typography sx={{ fontSize: FONT_SIZES.medium }}>
                                        {subject.name_th}
                                    </Typography>
                                    {subject.name_eng && (
                                        <Typography sx={{ fontSize: FONT_SIZES.small, color: 'text.secondary', textTransform: 'uppercase' }}>
                                            {subject.name_eng}
                                        </Typography>
                                    )}
                                </Box>
                            </TableCell>

                            <TableCell align="center">
                                <Typography sx={{ fontSize: FONT_SIZES.medium }}>
                                    {subject.program_year || '-'}
                                </Typography>
                            </TableCell>

                            <TableCell align="center">
                                <Typography sx={{ fontSize: FONT_SIZES.medium }}>
                                    {subject.credit}
                                </Typography>
                            </TableCell>

                            <TableCell align="center">
                                <IconButton
                                    size="small"
                                    onClick={(e) => handleDelete(e, subject)}
                                    sx={{
                                        color: 'error.main',
                                        '&:hover': {
                                            bgcolor: 'error.lighter',
                                        },
                                    }}
                                    title="ลบรายวิชา"
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SubjectTable;
