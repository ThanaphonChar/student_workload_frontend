/**
 * SubjectForm Component
 * ฟอร์มสำหรับเพิ่ม/แก้ไขรายวิชา (reusable)
 */

import { useState } from 'react';
import { TextInput } from '../common/TextInput';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const SubjectForm = ({ initialData = {}, onSubmit, onCancel, isSubmitting = false }) => {
    // Form state
    const [formData, setFormData] = useState({
        code_th: initialData.code_th || '',
        code_eng: initialData.code_eng || '',
        name_th: initialData.name_th || '',
        name_eng: initialData.name_eng || '',
        program_id: initialData.program_id || '',
        student_year_id: initialData.student_year_id || '',
        credit: initialData.credit || '',
        outline: initialData.outline || '',
        count_workload: initialData.count_workload !== undefined ? initialData.count_workload : true,
        is_active: initialData.is_active !== undefined ? initialData.is_active : true,
    });

    const [errors, setErrors] = useState({});

    // Static options (ในอนาคตอาจดึงจาก API)
    const programOptions = [
        { value: 1, label: '2566' },
        { value: 2, label: '2567' },
        { value: 3, label: '2570' },
    ];

    const studentYearOptions = [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
    ];

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Clear error when typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate form
    const validate = () => {
        const newErrors = {};

        if (!formData.code_th.trim()) {
            newErrors.code_th = 'กรุณากรอกรหัสวิชา (ไทย)';
        }

        if (!formData.name_th.trim()) {
            newErrors.name_th = 'กรุณากรอกชื่อวิชา (ไทย)';
        }

        if (!formData.program_id) {
            newErrors.program_id = 'กรุณาเลือกหลักสูตร';
        }

        if (!formData.student_year_id) {
            newErrors.student_year_id = 'กรุณาเลือกชั้นปี';
        }

        if (!formData.credit || formData.credit === '') {
            newErrors.credit = 'กรุณากรอกหน่วยกิต';
        } else if (isNaN(formData.credit) || Number(formData.credit) < 0) {
            newErrors.credit = 'หน่วยกิตต้องเป็นตัวเลขที่ >= 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        // Prepare data - convert to correct types
        const payload = {
            code_th: formData.code_th.trim(),
            code_eng: formData.code_eng.trim() || undefined,
            name_th: formData.name_th.trim(),
            name_eng: formData.name_eng.trim() || undefined,
            program_id: Number(formData.program_id),
            student_year_id: Number(formData.student_year_id),
            credit: Number(formData.credit),
            outline: formData.outline.trim() || undefined,
            count_workload: formData.count_workload,
            is_active: formData.is_active,
        };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                    <TextInput
                        label="รหัสวิชาภาษาไทย"
                        name="code_th"
                        value={formData.code_th}
                        onChange={handleChange}
                        placeholder="เช่น ท123"
                        required
                        error={errors.code_th}
                    />

                    <TextInput
                        label="รหัสวิชาภาษาอังกฤษ"
                        name="code_eng"
                        value={formData.code_eng}
                        onChange={handleChange}
                        placeholder="เช่น CS101"
                    />

                    <TextInput
                        label="หน่วยกิต"
                        name="credit"
                        type="number"
                        value={formData.credit}
                        onChange={handleChange}
                        placeholder="3"
                        min="0"
                        required
                        error={errors.credit}
                    />

                    {/* Program Dropdown */}
                    <div>
                        <label className="block text-[16px] font-medium text-gray-700 mb-2">
                            หลักสูตร <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="program_id"
                            value={formData.program_id}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 text-[16px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#050C9C] ${errors.program_id ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">-- เลือกหลักสูตร --</option>
                            {programOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.program_id && (
                            <p className="mt-1 text-[14px] text-red-500">{errors.program_id}</p>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <TextInput
                        label="ชื่อวิชาภาษาไทย"
                        name="name_th"
                        value={formData.name_th}
                        onChange={handleChange}
                        placeholder="วิทยาการคอมพิวเตอร์เบื้องต้น"
                        required
                        error={errors.name_th}
                    />

                    <TextInput
                        label="ชื่อวิชาภาษาอังกฤษ"
                        name="name_eng"
                        value={formData.name_eng}
                        onChange={handleChange}
                        placeholder="Introduction to Computer Science"
                    />

                    {/* Student Year - Radio buttons */}
                    <div>
                        <label className="block text-[16px] font-medium text-gray-700 mb-2">
                            ชั้นปี <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4">
                            {studentYearOptions.map(opt => (
                                <label key={opt.value} className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="student_year_id"
                                        value={opt.value}
                                        checked={Number(formData.student_year_id) === opt.value}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#050C9C] focus:ring-[#050C9C] cursor-pointer"
                                    />
                                    <span className="ml-2 text-[16px] text-gray-700">
                                        ชั้นปีที่ {opt.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {errors.student_year_id && (
                            <p className="mt-1 text-[14px] text-red-500">{errors.student_year_id}</p>
                        )}
                    </div>

                    {/* Outline */}
                    <div>
                        <label className="block text-[16px] font-medium text-gray-700 mb-2">
                            โครงร่างรายวิชา
                        </label>
                        <textarea
                            name="outline"
                            value={formData.outline}
                            onChange={handleChange}
                            placeholder="outline-01"
                            rows="3"
                            className="w-full px-4 py-3 text-[16px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#050C9C] resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="count_workload"
                        checked={formData.count_workload}
                        onChange={handleChange}
                        className="w-5 h-5 text-[#050C9C] border-gray-300 rounded focus:ring-[#050C9C] cursor-pointer"
                    />
                    <span className="text-[16px] text-gray-700">นับชั่วโมงภาระงาน</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="w-5 h-5 text-[#050C9C] border-gray-300 rounded focus:ring-[#050C9C] cursor-pointer"
                    />
                    <span className="text-[16px] text-gray-700">เปิดใช้รายวิชา</span>
                </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
                <Button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="flex-1 bg-gray-200 text-gray-700 text-[18px] hover:bg-gray-300"
                >
                    ยกเลิก
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#050C9C] text-white text-[18px] hover:bg-[#040879]"
                >
                    {isSubmitting ? (
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
    );
};

export default SubjectForm;
