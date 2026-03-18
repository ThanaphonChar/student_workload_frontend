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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Stack, Box, Typography, Button, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { AppShell } from '../../components/layout/AppShell';
import { SubjectToolbar } from '../../components/subjects/SubjectToolbar';
import { SubjectTable } from '../../components/subjects/SubjectTable';
import { useSubjects } from '../../hooks/useSubjects';
import { FONT_SIZES } from '../../theme/muiTheme';

export const SubjectListPage = () => {
    const navigate = useNavigate();
    const [deleteError, setDeleteError] = React.useState(null);

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
            setDeleteError(result.error);
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
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                            <p className="text-red-600 text-xl">{error}</p>
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                startIcon={<RefreshIcon />}
                                onClick={() => refetch()}
                            >
                                ลองอีกครั้ง
                            </Button>
                        </div>
                    )}

                    {/* Delete Error */}
                    {deleteError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                            <p className="text-red-600 text-xl">{deleteError}</p>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => setDeleteError(null)}
                            >
                                ปิด
                            </Button>
                        </div>
                    )}

                    {/* Table */}
                    {!loading && !error && (
                        <SubjectTable
                            subjects={subjects}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </Stack>
            </Container>
        </AppShell>
    );
};

export default SubjectListPage;
