/**
 * WorkloadForm Component
 * ฟอร์มสำหรับเพิ่ม/แก้ไขภาระงาน
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, DateInputField, LoadingSpinner, TextAreaInput } from './common';
import { TextInput } from './common/TextInput';
import { formatDateToString, parseDate } from '../utils/dateUtils';
import { useAlert } from '../hooks/useAlert';

const WorkloadForm = ({ termSubjectId, termSubjectData, onSuccess, onCancel, editData = null }) => {
    const navigate = useNavigate();
    const { alert, AlertDialog } = useAlert();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Form state
    const [formData, setFormData] = useState({
        work_title: '',
        description: '',
        start_date: '',
        end_date: '',
        hours_per_week: ''
    });

    // ถ้ามี editData ให้เซ็ตค่าเริ่มต้น
    useEffect(() => {
        if (editData) {
            setFormData({
                work_title: editData.work_title || '',
                description: editData.description || '',
                start_date: editData.start_date ? formatDateToString(parseDate(editData.start_date)) : '',
                end_date: editData.end_date ? formatDateToString(parseDate(editData.end_date)) : '',
                hours_per_week: editData.hours_per_week || ''
            });
        }
    }, [editData]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // ลบ error ของฟิลด์ที่แก้ไข
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleDateChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value ? formatDateToString(value) : ''
        }));

        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // work_title
        if (!formData.work_title.trim()) {
            newErrors.work_title = 'กรุณากรอกชื่องาน';
        } else if (formData.work_title.length > 255) {
            newErrors.work_title = 'ชื่องานต้องไม่เกิน 255 ตัวอักษร';
        }

        // start_date
        if (!formData.start_date) {
            newErrors.start_date = 'กรุณาเลือกวันเริ่มงาน';
        }

        // end_date
        if (!formData.end_date) {
            newErrors.end_date = 'กรุณาเลือกวันสิ้นสุด';
        } else if (formData.start_date && formData.end_date < formData.start_date) {
            newErrors.end_date = 'วันสิ้นสุดต้องมากกว่าหรือเท่ากับวันเริ่มงาน';
        }

        // hours_per_week
        if (!formData.hours_per_week) {
            newErrors.hours_per_week = 'กรุณากรอกจำนวนชั่วโมงต่อสัปดาห์';
        } else if (isNaN(formData.hours_per_week) || formData.hours_per_week <= 0) {
            newErrors.hours_per_week = 'จำนวนชั่วโมงต้องมากกว่า 0';
        } else if (formData.hours_per_week > 168) {
            newErrors.hours_per_week = 'จำนวนชั่วโมงต้องไม่เกิน 168 (7 วัน x 24 ชั่วโมง)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const submitData = {
                ...formData,
                hours_per_week: parseInt(formData.hours_per_week)
            };

            if (onSuccess) {
                await onSuccess(submitData);
            }
        } catch (error) {
            console.error('Error submitting workload:', error);

            // แสดง validation errors จาก backend
            if (error.data?.details && Array.isArray(error.data.details)) {
                const backendErrors = {};
                error.data.details.forEach(err => {
                    backendErrors[err.field] = err.message;
                });
                setErrors(backendErrors);
            } else {
                await alert({
                    title: 'เกิดข้อผิดพลาด',
                    message: error.message || 'ไม่สามารถบันทึกข้อมูลได้',
                    variant: 'error',
                    buttonText: 'ตกลง'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate(-1);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ข้อมูลพื้นฐานของงาน */}
                <div className="mb-6">
                    <h3 className="text-3xl font-bold text-[#7A7A7A] mb-4">
                        ข้อมูลพื้นฐานของงาน
                    </h3>

                    {/* ชื่องาน */}
                    <TextInput
                        label="ชื่องาน"
                        name="work_title"
                        value={formData.work_title}
                        onChange={handleChange}
                        placeholder="ระบุชื่องาน"
                        required
                        error={errors.work_title}
                        disabled={loading}
                    />

                    {/* รายละเอียดงาน */}
                    <TextAreaInput
                        label="รายละเอียดงาน"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="ระบุรายละเอียดเพิ่มเติม (ถ้ามี)"
                        disabled={loading}
                    />
                </div>

                {/* ระยะเวลาและชั่วโมง */}
                <div className="mb-6">
                    <h3 className="text-3xl font-bold text-[#7A7A7A] mb-4">
                        ระยะเวลาและชั่วโมง
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* วันที่เริ่มงาน */}
                        <div>
                            <DateInputField
                                label="วันที่เริ่มงาน"
                                value={parseDate(formData.start_date)}
                                onChange={(value) => handleDateChange('start_date', value)}
                                required
                                error={!!errors.start_date}
                            />
                            {errors.start_date && (
                                <p className="mt-1 text-xl text-red-500">{errors.start_date}</p>
                            )}
                        </div>

                        {/* วันที่สิ้นสุด (Deadline) */}
                        <div>
                            <DateInputField
                                label="วันที่สิ้นสุด (Deadline)"
                                value={parseDate(formData.end_date)}
                                onChange={(value) => handleDateChange('end_date', value)}
                                required
                                error={!!errors.end_date}
                            />
                            {errors.end_date && (
                                <p className="mt-1 text-xl text-red-500">{errors.end_date}</p>
                            )}
                        </div>
                    </div>

                    {/* จำนวนชั่วโมงต่อสัปดาห์ */}
                    <TextInput
                        label="จำนวนชั่วโมงต่อสัปดาห์"
                        name="hours_per_week"
                        type="number"
                        value={formData.hours_per_week}
                        onChange={handleChange}
                        min="1"
                        max="168"
                        placeholder="ระบุจำนวนชั่วโมง"
                        required
                        error={errors.hours_per_week}
                        disabled={loading}
                        className="mt-4 md:w-1/2 md:pr-2"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex ml-[60%] gap-4 pt-4">
                    <Button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1 bg-[#F1F1F1] hover:bg-[#E1E1E1] text-[#3B3B3B] text-2xl"
                    >
                        <span className="text-gray-700 text-2xl">ยกเลิก</span>
                    </Button>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-[#050C9C] text-white hover:bg-[#040879] text-2xl"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <LoadingSpinner size="small" />
                                <span>กำลังบันทึก...</span>
                            </span>
                        ) : (
                            'บันทึก'
                        )}
                    </Button>
                </div>
            </form>

            {/* Alert Dialog */}
            <AlertDialog />
        </>
    );
};

export default WorkloadForm;
