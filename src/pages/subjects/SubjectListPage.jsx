/**
 * SubjectListPage
 * หน้าแสดงรายการวิชาทั้งหมด
 * 
 * Responsibilities:
 * - Page layout only
 * - Compose child components
 * - Handle navigation
 * - No business logic (delegated to useSubjects hook)
 */

import { useNavigate } from 'react-router-dom';
import { Container, Stack, Box, Typography, Alert, Button, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { AppShell } from '../../components/layout/AppShell';
import { SubjectToolbar } from '../../components/subjects/SubjectToolbar';
import { SubjectTable } from '../../components/subjects/SubjectTable';
import { useSubjects } from '../../hooks/useSubjects';
import { FONT_SIZES } from '../../theme/muiTheme';

export const SubjectListPage = () => {
    const navigate = useNavigate();

    // ใช้ custom hook จัดการ business logic
    const {
        subjects,
        totalCount,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        deleteSubject,
        refetch,
    } = useSubjects();

    /**
     * จัดการ navigation ไป create page
     */
    const handleCreateClick = () => {
        navigate('/subjects/create');
    };

    /**
     * จัดการ navigation ไป edit page
     */
    const handleEdit = (id) => {
        navigate(`/subjects/edit/${id}`);
    };

    /**
     * จัดการ delete subject
     */
    const handleDelete = async (id) => {
        const result = await deleteSubject(id);

        if (!result.success) {
            alert(result.error);
        }
    };

    return (
        <AppShell>
            <Container maxWidth="xl">
                <Stack spacing={3} sx={{ py: 3 }}>
                    {/* Toolbar: Search + Create Button */}
                    <SubjectToolbar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
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

                    {/* Table */}
                    {!loading && !error && (
                        <SubjectTable
                            subjects={subjects}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}

                    {/* Summary */}
                    {!loading && !error && subjects.length > 0 && (
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: FONT_SIZES.medium }}>
                                แสดง {subjects.length} {searchQuery && `จาก ${totalCount}`} รายวิชา
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </Container>
        </AppShell>
    );
};

export default SubjectListPage;
