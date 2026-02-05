/**
 * ProfessorDropdown Component
 * Dropdown inline สำหรับเลือกอาจารย์และ assign ทันที
 */

import { useState, useRef, useEffect } from 'react';
import { useProfessors } from '../../hooks/useUsers';
import { useAssignProfessor } from '../../hooks/useCourseStatus';

export function ProfessorDropdown({ termSubjectId, onSuccess }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Hooks ต้องอยู่ที่ top level เสมอ
    const { professors, loading: loadingProfessors } = useProfessors();
    const { assignProfessor, assigning } = useAssignProfessor();

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

    const handleAssign = async (professorId) => {
        try {
            await assignProfessor(termSubjectId, professorId);
            setIsOpen(false);
            onSuccess();
        } catch (err) {
            console.error('Failed to assign professor:', err);
            alert('ไม่สามารถมอบหมายอาจารย์ได้: ' + (err.message || 'เกิดข้อผิดพลาด'));
        }
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {/* ปุ่ม + */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={assigning || loadingProfessors}
                className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                title="มอบหมายอาจารย์"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
                    {loadingProfessors ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            กำลังโหลด...
                        </div>
                    ) : professors.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            ไม่มีอาจารย์ในระบบ
                        </div>
                    ) : (
                        <div className="py-1">
                            {professors.map((prof) => (
                                <button
                                    key={prof.id}
                                    onClick={() => handleAssign(prof.id)}
                                    disabled={assigning}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="font-medium text-gray-900">
                                        {prof.first_name_th} {prof.last_name_th}
                                    </div>
                                    <div className="text-xs text-gray-500">{prof.email}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
