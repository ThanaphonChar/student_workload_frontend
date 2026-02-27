/**
 * SubjectForm Component
 * ฟอร์มสำหรับเพิ่ม/แก้ไขรายวิชา (reusable)
 */

import { useState } from 'react';
import { TextInput } from '../common/TextInput';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { IOSSwitch } from '../ui';
import StudentYearSelector from './StudentYearSelector';
import { FONT_SIZES } from '../../theme';

export const SubjectForm = ({
    initialData = {},
    onSubmit,
    onCancel,
    isSubmitting = false,
    submitButtonText = 'บันทึก'
}) => {
    // Form state
    const [formData, setFormData] = useState({
        code_th: initialData.code_th || '',
        code_eng: initialData.code_eng || '',
        name_th: initialData.name_th || '',
        name_eng: initialData.name_eng || '',
        program_id: initialData.program_id || '',
        student_year_ids: initialData.student_year_ids || [],
        credit: initialData.credit || '',
        outline: initialData.outline || '',
        count_workload: initialData.count_workload !== undefined ? initialData.count_workload : true,
        is_active: initialData.is_active !== undefined ? initialData.is_active : true,
    });

    const [errors, setErrors] = useState({});

    // Static options (ในอนาคตอาจดึงจาก API)
    const programOptions = [
        { value: 1, label: '2561' },
        { value: 2, label: '2566' },
        { value: 3, label: '2570' },
    ];

    //Handle input change
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

        if (!formData.code_th.trim()) {
            newErrors.code_th = 'กรุณากรอกรหัสวิชา (อังกฤษ)';
        }

        if (!formData.name_th.trim()) {
            newErrors.name_th = 'กรุณากรอกชื่อวิชา (อังกฤษ)';
        }

        if (!formData.outline.trim()) {
            newErrors.outline = 'กรุณากรอกโครงสร้างรายวิชา';
        }

        if (!formData.program_id) {
            newErrors.program_id = 'กรุณาเลือกหลักสูตร';
        }

        if (!formData.student_year_ids || formData.student_year_ids.length === 0) {
            newErrors.student_year_ids = 'กรุณาเลือกชั้นปีอย่างน้อย 1 ชั้นปี';
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
            student_year_ids: formData.student_year_ids.map(Number),
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
                        placeholder="เช่น ทนด.101"
                        required
                        error={errors.code_th}
                    />

                    <TextInput
                        label="รหัสวิชาภาษาอังกฤษ"
                        name="code_eng"
                        value={formData.code_eng}
                        onChange={handleChange}
                        placeholder="เช่น DTI101"
                        required
                        error={errors.code_eng}
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
                        <label className="block font-medium text-gray-700 mb-2 text-2xl">
                            หลักสูตร <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="program_id"
                            value={formData.program_id}
                            onChange={handleChange}
                            style={{ fontSize: FONT_SIZES.medium }}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c50a3] ${errors.program_id ? 'border-red-500' : 'border-gray-300'
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
                            <p className="mt-1 text-red-500" style={{ fontSize: FONT_SIZES.medium }}>{errors.program_id}</p>
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
                        required
                        error={errors.name_eng}
                    />

                    <TextInput
                        label="โครงสร้างรายวิชา"
                        name="outline"
                        value={formData.outline}
                        onChange={handleChange}
                        placeholder="ตัวอย่าง 3(3-0-6)"
                        required
                        error={errors.outline}
                    />

                    {/* Student Year Selector - Tailwind CSS */}
                    <div>
                        <StudentYearSelector
                            selectedYears={formData.student_year_ids}
                            onChange={(years) => {
                                setFormData(prev => ({
                                    ...prev,
                                    student_year_ids: years
                                }));
                                // Clear error when selecting
                                if (errors.student_year_ids) {
                                    setErrors(prev => ({ ...prev, student_year_ids: '' }));
                                }
                            }}
                        />
                        {errors.student_year_ids && (
                            <p className="mt-1 text-sm text-red-500">{errors.student_year_ids}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <IOSSwitch
                        name="count_workload"
                        checked={formData.count_workload}
                        onChange={(e) => {
                            setFormData(prev => ({
                                ...prev,
                                count_workload: e.target.checked
                            }));
                        }}
                        inputProps={{ 'aria-label': 'count workload' }}
                    />
                    <span className="text-gray-700 text-2xl">นับชั่วโมงภาระงาน <span className="text-red-500">*</span></span>
                </label>
            </div>

            {/* Action Buttons */}
            <div className="flex ml-[60%] gap-4 pt-4">
                <Button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="flex-1 bg-gray-300 hover:bg-gray-400"
                >
                    <a className='text-gray-700 text-2xl'>ยกเลิก</a>
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#050C9C] text-white hover:bg-[#040879] text-2xl"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <LoadingSpinner size="small" />
                            <span>กำลังบันทึก...</span>
                        </span>
                    ) : (
                        submitButtonText
                    )}
                </Button>
            </div>
        </form>
    );
};

export default SubjectForm;
