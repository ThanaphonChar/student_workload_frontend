/**
 * TermCreatePage
 * หน้าสร้างภาคการศึกษาใหม่
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { TermForm } from '../../components/terms/TermForm';
import * as termService from '../../services/termService';
import { useConfirm } from '../../hooks/useConfirm';
import * as termSubjectService from '../../services/termSubjectService';

export default function TermCreatePage() {
    const navigate = useNavigate();
    const { confirm, ConfirmDialog } = useConfirm();
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
            console.log('[TermCreatePage] 📤 Submitting formData:', formData);
            console.log('[TermCreatePage] subject_ids:', formData.subject_ids);
            console.log('[TermCreatePage] subject_ids count:', formData.subject_ids?.length);

            // Validate subject IDs first (ถ้ามีรายวิชา)
            if (formData.subject_ids && formData.subject_ids.length > 0) {
                console.log('[TermCreatePage] 🔍 Validating subject IDs before submission...');

                try {
                    const validation = await termService.validateSubjectIds(formData.subject_ids);
                    console.log('[TermCreatePage] Validation result:', validation);

                    if (!validation.valid) {
                        const invalidIdsStr = validation.invalid_ids.join(', ');
                        setErrorMessage(
                            `❌ รายวิชาที่มี ID: ${invalidIdsStr} ไม่มีอยู่ในระบบ\n` +
                            `กรุณาเลือกรายวิชาใหม่อีกครั้ง หรือรีเฟรชหน้าเว็บ (Ctrl+Shift+R)`
                        );
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setIsSubmitting(false);
                        return;
                    }

                    console.log('[TermCreatePage] ✅ All subject IDs are valid');
                } catch (validationError) {
                    console.error('[TermCreatePage] ❌ Validation request failed:', validationError);
                    // ถ้า validation API fail ให้ลองส่งต่อไปได้ (backend จะ validate อีกทีอยู่แล้ว)
                }
            }

            // Create term with all data including subject_ids
            console.log('[TermCreatePage] 🚀 Creating term...');
            const createdTerm = await termService.createTerm(formData);

            console.log('[TermCreatePage] ✅ Term created successfully:', createdTerm);
            setSuccessMessage('✅ สร้างภาคการศึกษาและเพิ่มรายวิชาสำเร็จ!');

            // Navigate back to list after short delay
            setTimeout(() => {
                navigate('/terms');
            }, 1500);
        } catch (error) {
            console.error('[TermCreatePage] ❌ Error creating term:', error);
            console.error('[TermCreatePage] Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

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
    const handleCancel = async () => {
        const confirmed = await confirm({
            title: 'ยกเลิกการสร้าง',
            message: 'คุณต้องการยกเลิกการสร้างภาคการศึกษาใช่หรือไม่?',
            variant: 'warning'
        });
        if (confirmed) {
            navigate('/terms');
        }
    };

    return (
        <>
            <ConfirmDialog />
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
                        <span className="text-[#050C9C] font-bold">เริ่มภาคการศึกษาใหม่</span>
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
                            <p className="text-xl sm:text-xl text-red-800 font-medium">
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
        </>
    );
}
