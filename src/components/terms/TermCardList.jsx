/**
 * TermCardList Component
 * แสดงรายการภาคการศึกษาในรูปแบบ Card
 */

import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/roleConfig';

// Format Thai date
const formatThaiDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('th-TH', { month: 'long' });
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
};

// Get sector label
const getSectorLabel = (sector) => {
    const sectorMap = {
        '1': '1',
        '2': '2',
        '3': '3',
    };
    return sectorMap[sector] || sector;
};

// Get status config with color
const getStatusConfig = (status) => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus === 'active' || lowerStatus === 'ดำเนินการ') {
        return {
            label: 'ดำเนินการ',
            color: 'text-green-700',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500',
        };
    }
    return {
        label: 'สิ้นสุด',
        color: 'text-gray-700',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-400',
    };
};

export const TermCardList = ({ terms, onView, onEdit }) => {
    const { user } = useAuth();
    const isAcademicOfficer = user?.roles?.some(
        role => role === ROLES.ACADEMIC_OFFICER || role === 'Academic Officer' || role === 'academic_staff'
    );

    // Empty state
    if (!terms || terms.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                    ไม่พบภาคการศึกษา
                </h3>
                <p className="text-sm text-gray-500">
                    ลองเปลี่ยนเงื่อนไขการค้นหา หรือเพิ่มภาคการศึกษาใหม่
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {terms.map((term) => {
                const statusConfig = getStatusConfig(term.status);

                return (
                    <div
                        key={term.id}
                        className={`
                            bg-white rounded-lg shadow-sm border-l-4 ${statusConfig.borderColor}
                            hover:shadow-md transition-all duration-200
                            overflow-hidden
                        `}
                    >
                        <div className="flex items-center p-4">
                            {/* Content - clickable */}
                            <div
                                className="flex-1 cursor-pointer"
                                onClick={() => onView(term.id)}
                            >
                                <div className="flex items-center gap-4">
                                    {/* ชื่อภาคการศึกษา */}
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        ปีการศึกษา {getSectorLabel(term.academic_sector)}/{term.academic_year}
                                    </h3>

                                    {/* วันที่ */}
                                    <p className="text-sm text-gray-600">
                                        {formatThaiDate(term.term_start_date)} - {formatThaiDate(term.term_end_date)}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                {/* Edit Button - เฉพาะ Academic Officer */}
                                {isAcademicOfficer && onEdit && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(term.id);
                                        }}
                                        className="
                                            px-4 py-2
                                            text-sm font-medium text-[#050C9C]
                                            bg-[#ffffff] hover:bg-[#dee1ff]
                                            border border-[#050C9C]
                                            rounded-lg
                                            transition-colors duration-200
                                        "
                                        title="แก้ไข"
                                    >
                                        แก้ไข
                                    </button>
                                )}

                                {/* Status Badge */}
                                <span className={`
                                    px-4 py-2
                                    text-sm font-semibold
                                    ${statusConfig.color}
                                    ${statusConfig.bgColor}
                                    border ${statusConfig.borderColor}
                                    rounded-lg
                                `}>
                                    {statusConfig.label}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
