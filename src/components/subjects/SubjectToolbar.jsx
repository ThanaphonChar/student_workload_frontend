/**
 * SubjectToolbar Component
 * แถบเครื่องมือสำหรับจัดการ Subject List
 * 
 * Features:
 * - Search input
 * - Create button
 * - Responsive layout
 */

import { Box, TextField, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { FONT_SIZES } from '../../theme';

export const SubjectToolbar = ({
    searchQuery,
    onSearchChange,
    onCreateClick
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
            }}
        >
            {/* หัวข้อ */}
            <Box>
                <Box
                    component="h1"
                    sx={{
                        fontSize: { xs: FONT_SIZES.large, sm: FONT_SIZES.extraLarge },
                        fontWeight: 700,
                        color: 'text.primary',
                        m: 0,
                    }}
                >
                    ข้อมูลรายวิชา
                </Box>
            </Box>

            {/* Search & Create Button */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    alignItems: 'stretch',
                }}
            >
                {/* Search Input */}
                <TextField
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="ค้นหารายวิชา (รหัสวิชา หรือ ชื่อวิชา)"
                    size="small"
                    sx={{
                        width: { xs: '100%', sm: '320px' },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '50px',
                            backgroundColor: 'white',
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Create Button */}
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onCreateClick}
                    sx={{
                        borderRadius: '50px',
                        bgcolor: '#050C9C',
                        px: 3,
                        textTransform: 'none',
                        fontSize: FONT_SIZES.medium,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        '&:hover': {
                            bgcolor: '#040879',
                        },
                    }}
                >
                    เพิ่มรายวิชา
                </Button>
            </Box>
        </Box >
    );
};
