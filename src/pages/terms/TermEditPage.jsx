/**
 * TermEditPage
 * หน้าแก้ไขภาคการศึกษา
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { TermForm } from '../../components/terms/TermForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import * as termService from '../../services/termService';
import * as termSubjectService from '../../services/termSubjectService';

export const TermEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Load term data on mount
     */
    useEffect(() => {
        loadTermData();
    }, [id]);

    /**
     * Load term data by ID
     */
    const loadTermData = async () => {
        setLoading(true);
        setErrorMessage('');

        try {
            const data = await termService.getTermById(id);

            if (data) {
                setInitialData(data);
            } else {
                setErrorMessage('ไม่พบข้อมูลภาคการศึกษา');
            }
        } catch (error) {
            console.error('Error loading term:', error);
            setErrorMessage(error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลภาคการศึกษาได้');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            console.log('[TermEditPage] Submitting formData:', formData);
            console.log('[TermEditPage] subject_ids:', formData.subject_ids);

            // Update term with all data including subject_ids
            await termService.updateTerm(id, formData);
            
            setSuccessMessage('✅ แก้ไขภาคการศึกษาสำเร็จ!');

            // Navigate back to list after short delay
            setTimeout(() => {
                navigate('/terms');
            }, 1500);
        } catch (error) {
            console.error('Error updating term:', error);

            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else if (error.message) {
                setErrorMessage(`เกิดข้อผิดพลาด: ${error.message}`);
            } else {
                setErrorMessage('ไม่สามารถแก้ไขภาคการศึกษาได้ กรุณาลองใหม่อีกครั้ง');
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
        if (window.confirm('คุณต้องการยกเลิกการแก้ไขภาคการศึกษาใช่หรือไม่?')) {
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
                    <span className="text-blue-600 font-bold">แก้ไขภาคการศึกษา</span>
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

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <LoadingSpinner />
                    </div>
                ) : initialData ? (
                    /* Form Card */
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
                        <h2 className="text-4xl font-semibold text-gray-900 mb-4 sm:mb-6">
                            ข้อมูลภาคการศึกษา
                        </h2>

                        <TermForm
                            initialData={initialData}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isSubmitting={isSubmitting}
                            submitButtonText="บันทึกการแก้ไข"
                        />
                    </div>
                ) : (
                    /* Not Found */
                    <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
                        <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-600 text-2xl mb-4">
                            ไม่พบข้อมูลภาคการศึกษา
                        </p>
                        <button
                            onClick={() => navigate('/terms')}
                            className="bg-blue-600 text-white px-4 sm:px-6 py-2 text-2xl rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            กลับไปหน้ารายการ
                        </button>
                    </div>
                )}
            </div>
        </AppShell>
    );
};

export default TermEditPage;
