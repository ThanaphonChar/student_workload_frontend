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
import { Alert } from '../../components/common/Alert';
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
                        <Alert
                            type="error"
                            message={error}
                            onClose={() => refetch()}
                        />
                    )}

                    {/* Delete Error */}
                    {deleteError && (
                        <Alert
                            type="error"
                            message={deleteError}
                            onClose={() => setDeleteError(null)}
                        />
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
