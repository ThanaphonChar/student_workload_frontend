/**
 * StudentYearDropdown Component
 * Dropdown inline สำหรับเลือกชั้นปีที่เรียนวิชาแบบ multi-select
 */

import { useState, useRef, useEffect } from 'react';
import * as subjectService from '../../services/subjectService';

export function StudentYearDropdown({ subjectId, currentYears = [], onSuccess }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedYears, setSelectedYears] = useState(currentYears);
    const [saving, setSaving] = useState(false);
    const dropdownRef = useRef(null);

    // อัพเดทเมื่อ currentYears เปลี่ยน
    useEffect(() => {
        setSelectedYears(currentYears);
    }, [currentYears]);

    // ปิด dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const toggleYear = (year) => {
        setSelectedYears(prev => {
            if (prev.includes(year)) {
                return prev.filter(y => y !== year);
            } else {
                return [...prev, year];
            }
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await subjectService.update(subjectId, {
                student_year_ids: selectedYears
            });
            setIsOpen(false);
            onSuccess();
        } catch (err) {
            console.error('Failed to update student years:', err);
            alert('ไม่สามารถบันทึกชั้นปีได้: ' + (err.message || 'เกิดข้อผิดพลาด'));
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setSelectedYears(currentYears);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {/* ปุ่ม + */}
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

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4">
                        <div className="space-y-2">
                            {[1, 2, 3, 4].map((year) => (
                                <label
                                    key={year}
                                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedYears.includes(year)}
                                        onChange={() => toggleYear(year)}
                                        disabled={saving}
                                        className="w-4 h-4 text-[#050C9C] bg-gray-100 border-gray-300 rounded focus:ring-[#050C9C] focus:ring-2"
                                    />
                                    <span className="text-sm text-gray-900">{year}</span>
                                </label>
                            ))}
                        </div>

                        {/* ปุ่ม Save/Cancel */}
                        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end space-x-2">
                            <button
                                onClick={handleCancel}
                                disabled={saving}
                                className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-3 py-1.5 text-sm bg-[#050C9C] text-white rounded hover:bg-[#040A8A] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
