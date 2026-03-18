/**
 * PaginatedTable Component
 * ตารางที่รองรับ pagination และเลือกจำนวนแสดงต่อหน้า
 */

import { useState } from 'react';
import { DropdownMenu } from './DropdownMenu';

export const PaginatedTable = ({
    data = [],
    columns = [],
    defaultRowsPerPage = 5,
    renderRow,
    className = ''
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

    // คำนวณข้อมูลสำหรับหน้าปัจจุบัน
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle rows per page change
    const handleRowsPerPageChange = (value) => {
        setRowsPerPage(value);
        setCurrentPage(1); // Reset to first page
    };

    // สร้างปุ่ม pagination
    const renderPaginationButtons = () => {
        const buttons = [];
        const maxButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        // ปรับ startPage ถ้า endPage ไปถึงหน้าสุดท้ายแล้ว
        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded-md text-xl ${i === currentPage
                        ? 'bg-[#050C9C] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                >
                    {i}
                </button>
            );
        }

        return buttons;
    };

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg
                    className="mx-auto h-12 w-12 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                </svg>
                <p className="mt-2 text-xl text-gray-500">ไม่พบข้อมูล</p>
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Main Container */}
            <div className="bg-[#F1F1F1] rounded-xl pb-2">
                {/* Header */}
                <div className="bg-[#050C9C] rounded-t-xl shadow-md">
                    <div className="grid px-6 py-3 mr-4 ml-4" style={{ gridTemplateColumns: columns.map(c => c.width || '1fr').join(' ') }}>
                        {columns.map((column, index) => (
                            <div
                                key={index}
                                className={`text-2xl font-bold text-white ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-center' : 'text-center'}`}
                            >
                                {column.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Body - Card-like rows with gaps */}
                <div className="space-y-3">
                    {currentData.map((row, index) => (
                        <div key={startIndex + index} className="bg-white m-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            {renderRow(row, startIndex + index)}
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
                {/* Left: Rows per page selector */}
                <div className="flex items-center gap-3">
                    <span className="text-xl text-gray-700">แสดง</span>
                    <DropdownMenu
                        trigger={
                            <button className="px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-xl flex items-center gap-2">
                                <span>{rowsPerPage}</span>
                                <span className="material-symbols-outlined text-xl">
                                    expand_more
                                </span>
                            </button>
                        }
                        items={[5, 10, 20, 50, 100].map(value => ({
                            id: value,
                            label: `${value} รายการ`,
                            onClick: () => handleRowsPerPageChange(value)
                        }))}
                        position="left"
                        className="w-32"
                    />
                    <span className="text-xl text-gray-700">
                        รายการต่อหน้า
                    </span>
                </div>

                {/* Center: Page info */}
                <div className="text-xl text-gray-700">
                    แสดง {Math.min(endIndex, data.length)} จาก {data.length} รายการ
                </div>

                {/* Right: Pagination buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md text-xl bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ก่อนหน้า
                    </button>

                    {renderPaginationButtons()}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md text-xl bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ถัดไป
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaginatedTable;
