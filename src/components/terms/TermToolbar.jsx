/**
 * TermToolbar Component
 * แถบเครื่องมือสำหรับหน้าภาคการศึกษา (Search + Filters + Create Button)
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DropdownMenu } from '../common/DropdownMenu';
import { getFilterOptions } from '../../services/termService';

export function TermToolbar({ filters, onFilterChange, onClearFilters, onCreateClick }) {
    const { user } = useAuth();
    const [academicYears, setAcademicYears] = useState([]);
    const [academicSectors, setAcademicSectors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Check both role formats
    const canCreate = user?.roles?.includes('ACADEMIC_OFFICER') ||
        user?.roles?.includes('Academic Officer') ||
        user?.role === 'academic_staff';

    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                const options = await getFilterOptions();

                // Format academic years
                const years = [
                    { value: '', label: 'ทั้งหมด' },
                    ...options.academic_years.map(year => ({
                        value: year.toString(),
                        label: year.toString()
                    }))
                ];

                // Format academic sectors
                const sectors = [
                    { value: '', label: 'เทอม' },
                    ...options.academic_sectors.map(sector => ({
                        value: sector.toString(),
                        label: sector.toString()
                    }))
                ];

                setAcademicYears(years);
                setAcademicSectors(sectors);
            } catch (error) {
                console.error('Failed to load filter options:', error);
                // Fallback to empty arrays
                setAcademicYears([{ value: '', label: 'ทั้งหมด' }]);
                setAcademicSectors([{ value: '', label: 'เทอม' }]);
            } finally {
                setLoading(false);
            }
        };

        loadFilterOptions();
    }, []);

    const handleChange = (field, value) => {
        onFilterChange({
            ...filters,
            [field]: value,
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[300px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#ADADAD]">
                    search
                </span>
                <input
                    type="text"
                    placeholder="ค้นหาภาคการศึกษา เช่น 1/2568..."
                    value={filters.search || ''}
                    onChange={(e) => handleChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white rounded-full focus:outline-none text-xl"
                />
            </div>

            {/* ปีการศึกษา Dropdown */}
            <DropdownMenu
                trigger={
                    <button
                        className="px-4 py-2 rounded-lg bg-white hover:bg-gray-50 focus:outline-none text-left flex items-center justify-between min-w-[120px]"
                        disabled={loading}
                    >
                        <span className="text-gray-900 text-xl">
                            {academicYears.find(y => y.value === filters.academic_year)?.label || 'ทั้งหมด'}
                        </span>
                        <span className="material-symbols-outlined text-gray-500 ml-2">
                            expand_more
                        </span>
                    </button>
                }
                items={academicYears.map((option) => ({
                    id: option.value,
                    label: option.label,
                    onClick: () => handleChange('academic_year', option.value)
                }))}
                position="left"
            />

            {/* ภาคการศึกษา Dropdown */}
            <DropdownMenu
                trigger={
                    <button
                        className="px-4 py-2 rounded-lg bg-white hover:bg-gray-50 focus:outline-none text-left flex items-center justify-between min-w-[100px]"
                        disabled={loading}
                    >
                        <span className="text-gray-900 text-xl">
                            {academicSectors.find(s => s.value === filters.academic_sector)?.label || 'เทอม'}
                        </span>
                        <span className="material-symbols-outlined text-gray-500 ml-2">
                            expand_more
                        </span>
                    </button>
                }
                items={academicSectors.map((option) => ({
                    id: option.value,
                    label: option.label,
                    onClick: () => handleChange('academic_sector', option.value)
                }))}
                position="left"
            />

            {/* ปุ่มสร้างภาคการศึกษา */}
            {canCreate && (
                <button
                    onClick={onCreateClick}
                    className="ml-auto px-4 py-2 bg-[#050C9C] hover:bg-[#040a7a] text-white rounded-lg font-semibold text-xl flex items-center gap-2 transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-xl">
                        add
                    </span>
                    เริ่มภาคการศึกษาใหม่
                </button>
            )}
        </div>
    );
}
