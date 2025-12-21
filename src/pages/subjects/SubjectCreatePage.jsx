/**
 * SubjectCreatePage
 * หน้าเพิ่มรายวิชาใหม่
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { SubjectForm } from '../../components/subjects/SubjectForm';
import * as subjectService from '../../services/subjectService';

export const SubjectCreatePage = () => {
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Handle form submission
     */
    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            // Call API to create subject
            const response = await subjectService.createSubject(formData);

            if (response.success) {
                setSuccessMessage('✅ เพิ่มรายวิชาสำเร็จ!');

                // Navigate back to list after short delay
                setTimeout(() => {
                    navigate('/subjects');
                }, 1500);
            }
        } catch (error) {
            console.error('Error creating subject:', error);

            // Handle backend validation errors
            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else if (error.message) {
                setErrorMessage(`เกิดข้อผิดพลาด: ${error.message}`);
            } else {
                setErrorMessage('ไม่สามารถเพิ่มรายวิชาได้ กรุณาลองใหม่อีกครั้ง');
            }

            // Scroll to top to show error
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handle cancel
     */
    const handleCancel = () => {
        if (window.confirm('คุณต้องการยกเลิกการเพิ่มรายวิชาใช่หรือไม่?')) {
            navigate('/subjects');
        }
    };

    return (
        <AppShell>
            <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 px-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-2xl text-gray-600">
                    <button
                        onClick={() => navigate('/subjects')}
                        className="hover:text-[#050C9C] transition-colors"
                    >
                        ข้อมูลรายวิชา
                    </button>
                    <span className="material-symbols-outlined text-base sm:text-lg">
                        chevron_right
                    </span>
                    <span className="text-[#050C9C] font-bold">เพิ่มรายวิชา</span>
                </div>

                {/* Success Alert */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                        <p className="text-sm sm:text-base text-green-800 font-medium">
                            {successMessage}
                        </p>
                    </div>
                )}

                {/* Error Alert */}
                {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                        <p className="text-sm sm:text-base text-red-800 font-medium">
                            ❌ {errorMessage}
                        </p>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
                    <h2 className="text-4xl font-semibold text-gray-900 mb-4 sm:mb-6">
                        ข้อมูลรายวิชา
                    </h2>

                    <SubjectForm
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </AppShell>
    );
};

export default SubjectCreatePage;
