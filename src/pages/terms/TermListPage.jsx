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
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/common/Button';
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
        <AppShell title="ปีการศึกษา">
            <div className="space-y-6">
                {/* Header */}

                <h1 className="pt-4 text-4xl font-bold text-gray-900">
                    ปีการศึกษา
                </h1>

                <div className="bg-[#F1F1F1] rounded-lg p-6 shadow-lg">
                    {/* Toolbar: Filters + Create Button */}
                    <div className="pb-4 m-4">
                        <TermToolbar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={handleClearFilters}
                            onCreateClick={handleCreateClick}
                        />
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050C9C]"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                            <p className="text-red-600">{error}</p>
                            <Button
                                onClick={refetch}
                                variant="danger"
                                size="sm"
                                className="text-xl flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                ลองอีกครั้ง
                            </Button>
                        </div>
                    )}

                    {/* Card List */}
                    {!loading && !error && (
                        <TermCardList
                            terms={terms}
                            onView={handleView}
                            onEdit={handleEdit}
                        />
                    )}
                </div>
            </div>
        </AppShell>
    );
}
