/**
 * TermListPage
 * หน้าแสดงรายการภาคการศึกษาทั้งหมด
 * 
 * Responsibilities:
 * - Page layout only
 * - Compose child components
 * - Handle navigation
 * - No business logic (delegated to useTerms hook)
 */

import { useNavigate } from 'react-router-dom';
import { Container, Stack, Box, CircularProgress, Alert, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { AppShell } from '../../components/layout/AppShell';
import { TermToolbar } from '../../components/terms/TermToolbar';
import { TermCardList } from '../../components/terms/TermCardList';
import { useTerms } from '../../hooks/useTerms';

export default function TermListPage() {
    const navigate = useNavigate();

    // ใช้ custom hook จัดการ business logic
    const {
        terms,
        loading,
        error,
        filters,
        setFilters,
        refetch,
    } = useTerms();

    /**
     * จัดการ navigation ไป create page
     */
    const handleCreateClick = () => {
        navigate('/terms/create');
    };

    /**
     * จัดการ navigation ไป detail page
     */
    const handleView = (id) => {
        navigate(`/terms/${id}`);
    };

    /**
     * จัดการ navigation ไป edit page
     */
    const handleEdit = (id) => {
        navigate(`/terms/edit/${id}`);
    };

    /**
     * จัดการเปลี่ยนฟิลเตอร์
     */
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    /**
     * ล้างฟิลเตอร์
     */
    const handleClearFilters = () => {
        setFilters({
            search: '',
            academic_year: '',
            academic_sector: '',
            status: '',
        });
    };

    return (
        <AppShell>
            <Container maxWidth="xl">
                <Stack spacing={3} sx={{ py: 3 }}>
                    {/* Toolbar: Filters + Create Button */}
                    <TermToolbar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                        onCreateClick={handleCreateClick}
                    />

                    {/* Loading State */}
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {/* Error State */}
                    {error && (
                        <Alert
                            severity="error"
                            action={
                                <Button
                                    color="inherit"
                                    size="small"
                                    startIcon={<RefreshIcon />}
                                    onClick={refetch}
                                >
                                    ลองอีกครั้ง
                                </Button>
                            }
                        >
                            {error}
                        </Alert>
                    )}

                    {/* Card List */}
                    {!loading && !error && (
                        <TermCardList
                            terms={terms}
                            onView={handleView}
                            onEdit={handleEdit}
                        />
                    )}
                </Stack>
            </Container>
        </AppShell>
    );
}
