/**
 * SubjectEditPage
 * หน้าแก้ไขรายวิชา
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { SubjectForm } from '../../components/subjects/SubjectForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import * as subjectService from '../../services/subjectService';

export const SubjectEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Load subject data on mount
     */
    useEffect(() => {
        loadSubjectData();
    }, [id]);

    /**
     * Load subject data by ID
     */
    const loadSubjectData = async () => {
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await subjectService.getSubjectById(id);

            if (response.success && response.subject) {
                setInitialData(response.subject);
            } else {
                setErrorMessage('ไม่พบข้อมูลรายวิชา');
            }
        } catch (error) {
            console.error('Error loading subject:', error);
            setErrorMessage(error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลรายวิชาได้');
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
            const response = await subjectService.updateSubject(id, formData);

            if (response.success) {
                setSuccessMessage('✅ แก้ไขรายวิชาสำเร็จ!');

                // Navigate back to list after short delay
                setTimeout(() => {
                    navigate('/subjects');
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating subject:', error);

            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else if (error.message) {
                setErrorMessage(`เกิดข้อผิดพลาด: ${error.message}`);
            } else {
                setErrorMessage('ไม่สามารถแก้ไขรายวิชาได้ กรุณาลองใหม่อีกครั้ง');
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
        if (window.confirm('คุณต้องการยกเลิกการแก้ไขรายวิชาใช่หรือไม่?')) {
            navigate('/subjects');
        }
    };

    return (
        <AppShell>
            <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 px-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                    <button
                        onClick={() => navigate('/subjects')}
                        className="hover:text-[#050C9C] transition-colors"
                    >
                        ข้อมูลรายวิชา
                    </button>
                    <span className="material-symbols-outlined text-base sm:text-lg">
                        chevron_right
                    </span>
                    <span className="text-gray-900 font-medium">แก้ไขรายวิชา</span>
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

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <LoadingSpinner />
                    </div>
                ) : initialData ? (
                    /* Form Card */
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-4 sm:mb-6">
                            ข้อมูลรายวิชา
                        </h2>

                        <SubjectForm
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
                        <span className="material-symbols-outlined text-5xl sm:text-6xl text-gray-300 mb-4">
                            error_outline
                        </span>
                        <p className="text-gray-600 text-sm sm:text-base mb-4">
                            ไม่พบข้อมูลรายวิชา
                        </p>
                        <button
                            onClick={() => navigate('/subjects')}
                            className="bg-[#050C9C] text-white px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg hover:bg-[#040879]"
                        >
                            กลับไปหน้ารายการ
                        </button>
                    </div>
                )}
            </div>
        </AppShell>
    );
};

export default SubjectEditPage;
