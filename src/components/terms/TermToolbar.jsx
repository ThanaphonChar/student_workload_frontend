/**
 * TermToolbar Component
 * แถบเครื่องมือสำหรับหน้าภาคการศึกษา (Search + Filters + Create Button)
 */

import { Box, TextField, MenuItem, Button, Stack, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../hooks/useAuth';
import { FONT_SIZES } from '../../theme/muiTheme';

const ACADEMIC_YEARS = [
    { value: '', label: 'ทั้งหมด' },
    { value: '2568', label: '2568' },
    { value: '2567', label: '2567' },
    { value: '2566', label: '2566' },
];

const ACADEMIC_SECTORS = [
    { value: '', label: 'เทอม' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
];

export function TermToolbar({ filters, onFilterChange, onClearFilters, onCreateClick }) {
    const { user } = useAuth();
    // Check both role formats
    const canCreate = user?.roles?.includes('ACADEMIC_OFFICER') || 
                     user?.roles?.includes('Academic Officer') ||
                     user?.role === 'academic_staff';

    const handleChange = (field) => (event) => {
        onFilterChange({
            ...filters,
            [field]: event.target.value,
        });
    };

    const hasActiveFilters = filters.academic_year || filters.academic_sector || filters.status;

    return (
        <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <TextField
                placeholder="ค้นหาภาคการศึกษา เช่น 1/2568..."
                value={filters.search || ''}
                onChange={handleChange('search')}
                size="small"
                sx={{ minWidth: 300 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    style: { fontSize: FONT_SIZES.medium },
                }}
            />

            {/* ปีการศึกษา Dropdown */}
            <TextField
                select
                value={filters.academic_year || ''}
                onChange={handleChange('academic_year')}
                size="small"
                sx={{ minWidth: 120 }}
                inputProps={{
                    style: { fontSize: FONT_SIZES.medium },
                }}
            >
                {ACADEMIC_YEARS.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: FONT_SIZES.medium }}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

            {/* ภาคการศึกษา Dropdown */}
            <TextField
                select
                value={filters.academic_sector || ''}
                onChange={handleChange('academic_sector')}
                size="small"
                sx={{ minWidth: 100 }}
                inputProps={{
                    style: { fontSize: FONT_SIZES.medium },
                }}
            >
                {ACADEMIC_SECTORS.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: FONT_SIZES.medium }}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

            {/* ปุ่มสร้างภาคการศึกษา */}
            {canCreate && (
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onCreateClick}
                    sx={{
                        fontSize: FONT_SIZES.medium,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        ml: 'auto',
                    }}
                >
                    เริ่มภาคการศึกษาใหม่
                </Button>
            )}
        </Stack>
    );
}
