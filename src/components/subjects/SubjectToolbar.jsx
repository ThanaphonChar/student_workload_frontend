/**
 * SubjectToolbar Component
 * แถบเครื่องมือสำหรับจัดการ Subject List
 * 
 * Features:
 * - Search input
 * - Create button
 * - Responsive layout
 */

export const SubjectToolbar = ({
    searchQuery,
    onSearchChange,
    onCreateClick
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* หัวข้อ */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 m-0">
                    ข้อมูลรายวิชา
                </h1>
            </div>

            {/* Search & Create Button */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        search
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="ค้นหารายวิชา (รหัสวิชา หรือ ชื่อวิชา)"
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-[#F1F1F1] focus:ring-[#050C9C] text-lg"
                    />
                </div>

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
