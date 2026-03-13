/**
 * StudentYearDropdown Component
 * Dropdown inline สำหรับเลือกชั้นปีที่เรียนวิชาแบบ multi-select
 */

import { useState, useRef, useEffect } from 'react';
import * as subjectService from '../../services/subjectService';
import { Checkbox } from '../common/Checkbox';

export function StudentYearDropdown({ subjectId, currentYears = [], onSuccess, trigger }) {
    const [isOpen, setIsOpen] = useState(false);
    const [localYears, setLocalYears] = useState(currentYears);
    const [saving, setSaving] = useState(false);
    const dropdownRef = useRef(null);

    // Sync local state with prop
    useEffect(() => {
        setLocalYears(currentYears);
    }, [currentYears]);

    // ปิด dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                onSuccess(); // Refresh เมื่อปิด dropdown
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, onSuccess]);

    const toggleYear = async (year) => {
        try {
            setSaving(true);
            const newYears = localYears.includes(year)
                ? localYears.filter(y => y !== year)
                : [...localYears, year];

            setLocalYears(newYears); // Update local state ทันที

            await subjectService.update(subjectId, {
                student_year_ids: newYears
            });
            // ไม่เรียก onSuccess() ที่นี่ เพื่อไม่ให้ dropdown หาย
        } catch (err) {
            console.error('Failed to update student years:', err);
            alert('ไม่สามารถบันทึกชั้นปีได้: ' + (err.message || 'เกิดข้อผิดพลาด'));
            setLocalYears(currentYears); // Revert on error
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {/* Custom trigger หรือปุ่ม + default */}
            {trigger ? (
                <div onClick={() => setIsOpen(!isOpen)}>
                    {trigger}
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={saving}
                    className="text-[#050C9C] hover:text-[#040A8A] disabled:text-gray-400 disabled:cursor-not-allowed"
                    title="เลือกชั้นปี"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
            )}

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                        {[1, 2, 3, 4].map((year) => (
                            <div
                                key={year}
                                className="hover:bg-gray-100 px-6 py-3"
                            >
                                <Checkbox
                                    checked={localYears.includes(year)}
                                    onChange={() => toggleYear(year)}
                                    disabled={saving}
                                    label={year.toString()}
                                    size="sm"
                                    labelClassName="text-2xl"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
