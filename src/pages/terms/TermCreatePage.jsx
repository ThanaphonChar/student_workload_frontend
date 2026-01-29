/**
 * TermCreatePage
 * หน้าสร้างภาคการศึกษาใหม่
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { TermForm } from '../../components/terms/TermForm';
import * as termService from '../../services/termService';
import * as termSubjectService from '../../services/termSubjectService';

export default function TermCreatePage() {
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
            console.log('[TermCreatePage] Submitting formData:', formData);
            console.log('[TermCreatePage] subject_ids:', formData.subject_ids);

            // Create term with all data including subject_ids
            const createdTerm = await termService.createTerm(formData);
            
            setSuccessMessage('✅ สร้างภาคการศึกษาและเพิ่มรายวิชาสำเร็จ!');

            // Navigate back to list after short delay
            setTimeout(() => {
                navigate('/terms');
            }, 1500);
        } catch (error) {
            console.error('Error creating term:', error);

            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else if (error.message) {
                setErrorMessage(`เกิดข้อผิดพลาด: ${error.message}`);
            } else {
                setErrorMessage('ไม่สามารถสร้างภาคการศึกษาได้ กรุณาลองใหม่อีกครั้ง');
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
        if (window.confirm('คุณต้องการยกเลิกการสร้างภาคการศึกษาใช่หรือไม่?')) {
            navigate('/terms');
        }
    };

    return (
        <AppShell>
            <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 px-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-2xl text-gray-600">
                    <button
                        onClick={() => navigate('/terms')}
                        className="hover:text-blue-600 transition-colors"
                    >
                        จัดการปีการศึกษา
                    </button>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-blue-600 font-bold">เริ่มภาคการศึกษาใหม่</span>
                </div>

                {/* Success Alert */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                        <p className="text-2xl text-green-800 font-medium">
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
                        ข้อมูลภาคการศึกษา
                    </h2>

                    <TermForm
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        isSubmitting={isSubmitting}
                        submitButtonText="บันทึก"
                    />
                </div>
            </div>
        </AppShell>
    );
}
