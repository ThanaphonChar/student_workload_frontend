/**
 * AssignProfessorModal Component
 * Modal สำหรับมอบหมายอาจารย์ผู้สอน
 */

import { useState } from 'react';
import { useAssignProfessor } from '../../hooks/useCourseStatus';
import { useProfessors } from '../../hooks/useUsers';

export function AssignProfessorModal({ isOpen, onClose, termSubject, onSuccess }) {
    const [professorId, setProfessorId] = useState('');

    // Hooks ต้องอยู่ที่ top level เสมอ - ไม่ใช้ conditional
    const { professors, loading: loadingProfessors } = useProfessors();
    const { assignProfessor, assigning, error } = useAssignProfessor();

    // Early return หลังจาก hooks ทั้งหมด
    if (!isOpen || !termSubject) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        if (!professorId) {
            alert('กรุณาเลือกอาจารย์');
            return;
        }

        try {
            await assignProfessor(termSubject.id, parseInt(professorId, 10));
            onSuccess();
            handleClose();
        } catch (err) {
            console.error('Failed to assign professor:', err);
        }
    };

    const handleClose = () => {
        setProfessorId('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">
                            มอบหมายอาจารย์ผู้สอน
                        </h3>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-4">
                            {/* รายวิชา */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    รายวิชา
                                </label>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="text-sm font-medium text-gray-900">
                                        {termSubject.code_eng || termSubject.code_th}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {termSubject.name_th || termSubject.name_eng}
                                    </div>
                                </div>
                            </div>

                            {/* อาจารย์ปัจจุบัน */}
                            {termSubject.professors && termSubject.professors.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        อาจารย์ปัจจุบัน
                                    </label>
                                    <div className="space-y-1">
                                        {termSubject.professors.map((prof, idx) => (
                                            <div key={idx} className="text-sm text-gray-600">
                                                • {prof.first_name_th} {prof.last_name_th}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* เลือกอาจารย์ใหม่ */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    เพิ่มอาจารย์ผู้สอน <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={professorId}
                                    onChange={(e) => setProfessorId(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={assigning || loadingProfessors}
                                >
                                    <option value="">
                                        {loadingProfessors ? 'กำลังโหลด...' : '-- เลือกอาจารย์ --'}
                                    </option>
                                    {professors.map((prof) => (
                                        <option key={prof.id} value={prof.id}>
                                            {prof.first_name_th} {prof.last_name_th} ({prof.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            {/* Note */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-800">
                                    <strong>หมายเหตุ:</strong> การเพิ่มอาจารย์ใหม่จะไม่ลบอาจารย์เดิม
                                    สามารถมีอาจารย์ผู้สอนหลายคนได้
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                disabled={assigning}
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={assigning || loadingProfessors}
                            >
                                {assigning ? 'กำลังบันทึก...' : 'บันทึก'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
