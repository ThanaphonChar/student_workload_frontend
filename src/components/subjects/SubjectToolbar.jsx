/**
 * SubjectToolbar Component
 * แถบเครื่องมือสำหรับจัดการ Subject List
 * 
 * Features:
 * - Search input
 * - Create button
 * - Responsive layout
 */

import { SearchInput } from '../common/SearchInput';

export const SubjectToolbar = ({
    searchQuery,
    onSearchChange,
    onCreateClick
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* หัวข้อ */}
            <div>
                <h1 className="text-4xl font-bold text-gray-900 m-0">
                    ข้อมูลรายวิชา
                </h1>
            </div>

            {/* Search & Create Button */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <SearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="ค้นหารายวิชา (รหัสวิชา หรือ ชื่อวิชา)"
                    className="w-full sm:w-80"
                />

                {/* Create Button */}
                <button
                    onClick={onCreateClick}
                    className="px-6 py-2 bg-[#050C9C] hover:bg-[#040879] text-white rounded-lg font-bold text-xl flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">
                        add
                    </span>
                    เพิ่มรายวิชา
                </button>
            </div>
        </div>
    );
};
