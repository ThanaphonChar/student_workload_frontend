/**
 * WorkloadForm Component
 * ฟอร์มสำหรับเพิ่ม/แก้ไขภาระงาน
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkloadForm = ({ termSubjectId, termSubjectData, onSuccess, onCancel, editData = null }) => {
    const navigate = useNavigate();
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
                start_date: editData.start_date || '',
                end_date: editData.end_date || '',
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
            if (error.details && Array.isArray(error.details)) {
                const backendErrors = {};
                error.details.forEach(err => {
                    backendErrors[err.field] = err.message;
                });
                setErrors(backendErrors);
            } else {
                alert('เกิดข้อผิดพลาด: ' + (error.message || 'ไม่สามารถบันทึกข้อมูลได้'));
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
        <form onSubmit={handleSubmit} className="space-y-6">
                {/* ข้อมูลพื้นฐานของงาน */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                        ข้อมูลพื้นฐานของงาน
                    </h3>

                    {/* ชื่องาน */}
                    <div className="mb-4">
                        <label htmlFor="work_title" className="block text-sm font-medium text-gray-700 mb-1">
                            ชื่องาน <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="work_title"
                            name="work_title"
                            value={formData.work_title}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#050C9C] focus:border-transparent ${
                                errors.work_title ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="ระบุชื่องาน"
                            disabled={loading}
                        />
                        {errors.work_title && (
                            <p className="mt-1 text-sm text-red-500">{errors.work_title}</p>
                        )}
                    </div>

                    {/* รายละเอียดงาน */}
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            รายละเอียดงาน
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#050C9C] focus:border-transparent resize-none"
                            placeholder="ระบุรายละเอียดเพิ่มเติม (ถ้ามี)"
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* ระยะเวลาและชั่วโมง */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                        ระยะเวลาและชั่วโมง
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* วันที่เริ่มงาน */}
                        <div>
                            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                                วันที่เริ่มงาน <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="start_date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.start_date ? 'border-red-500' : 'border-gray-300'
                                }`}
                                disabled={loading}
                            />
                            {errors.start_date && (
                                <p className="mt-1 text-sm text-red-500">{errors.start_date}</p>
                            )}
                        </div>

                        {/* วันที่สิ้นสุด (Deadline) */}
                        <div>
                            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                                วันที่สิ้นสุด (Deadline) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="end_date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.end_date ? 'border-red-500' : 'border-gray-300'
                                }`}
                                disabled={loading}
                            />
                            {errors.end_date && (
                                <p className="mt-1 text-sm text-red-500">{errors.end_date}</p>
                            )}
                        </div>
                    </div>

                    {/* จำนวนชั่วโมงต่อสัปดาห์ */}
                    <div className="mt-4">
                        <label htmlFor="hours_per_week" className="block text-sm font-medium text-gray-700 mb-1">
                            จำนวนชั่วโมงต่อสัปดาห์ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="hours_per_week"
                            name="hours_per_week"
                            value={formData.hours_per_week}
                            onChange={handleChange}
                            min="1"
                            max="168"
                            className={`w-full md:w-1/2 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.hours_per_week ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="ระบุจำนวนชั่วโมง"
                            disabled={loading}
                        />
                        {errors.hours_per_week && (
                            <p className="mt-1 text-sm text-red-500">{errors.hours_per_week}</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        disabled={loading}
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-[#050C9C] text-white rounded-md hover:bg-[#040a7a] font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                    </button>
                </div>
        </form>
    );
};

export default WorkloadForm;
