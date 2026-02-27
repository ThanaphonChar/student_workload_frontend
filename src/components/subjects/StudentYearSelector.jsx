/**
 * StudentYearSelector Component
 * Checkbox selector สำหรับเลือกชั้นปีที่เรียนวิชา
 * Fully controlled component - ไม่มี internal state
 */

import React from 'react';

const STUDENT_YEARS = [1, 2, 3, 4];

/**
 * @param {Object} props
 * @param {number[]} props.selectedYears - Array ของชั้นปีที่เลือก
 * @param {(years: number[]) => void} props.onChange - Callback เมื่อมีการเปลี่ยนแปลง
 */
export default function StudentYearSelector({ selectedYears = [], onChange }) {
    const handleToggle = (year) => {
        const isSelected = selectedYears.includes(year);
        const newYears = isSelected
            ? selectedYears.filter(y => y !== year)
            : [...selectedYears, year].sort((a, b) => a - b);

        onChange(newYears);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                ชั้นปีที่เรียน
                <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="flex gap-4">
                {STUDENT_YEARS.map(year => {
                    const isChecked = selectedYears.includes(year);

                    return (
                        <label
                            key={year}
                            className="flex items-center gap-2 cursor-pointer select-none"
                        >
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggle(year)}
                                className="w-4 h-4 text-[#050C9C] border-gray-300 rounded focus:ring-[#050C9C]"
                            />
                            <span className="text-sm text-gray-700">
                                ปี {year}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
