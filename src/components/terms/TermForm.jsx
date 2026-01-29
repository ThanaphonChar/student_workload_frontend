/**
 * TermForm Component
 * ฟอร์มสำหรับเพิ่ม/แก้ไขภาคการศึกษา (reusable)
 */

import { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { DatePickerField, TextField, SearchInput } from '../common';
import { SEMESTERS } from '../../constants/academicYear';
import * as subjectService from '../../services/subjectService';
import * as termService from '../../services/termService';

export const TermForm = ({
    initialData = {},
    onSubmit,
    onCancel,
    isSubmitting = false,
    submitButtonText = 'บันทึก'
}) => {
    // Form state
    const [formData, setFormData] = useState({
        academic_year: initialData.academic_year || '',
        academic_sector: initialData.academic_sector || '',
        term_start_date: initialData.term_start_date || '',
        term_end_date: initialData.term_end_date || '',
        midterm_start_date: initialData.midterm_start_date || '',
        midterm_end_date: initialData.midterm_end_date || '',
        final_start_date: initialData.final_start_date || '',
        final_end_date: initialData.final_end_date || '',
    });

    const [errors, setErrors] = useState({});

    // Subject selection state
    const [allSubjects, setAllSubjects] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
    const [isLoadingExistingSubjects, setIsLoadingExistingSubjects] = useState(false);
    const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

    /**
     * Convert ISO date string to YYYY-MM-DD format
     * @param {string} isoDate - ISO date string from API
     * @returns {string} - Date in YYYY-MM-DD format or empty string
     */
    const formatDateForInput = (isoDate) => {
        if (!isoDate) return '';
        try {
            const date = new Date(isoDate);
            return date.toISOString().split('T')[0];
        } catch (error) {
            console.error('[TermForm] Error formatting date:', error);
            return '';
        }
    };

    // Update form data when initialData changes (only for edit mode)
    useEffect(() => {
        // Only update if initialData has an ID (edit mode)
        if (initialData.id) {
            setFormData({
                academic_year: initialData.academic_year || '',
                academic_sector: initialData.academic_sector || '',
                term_start_date: formatDateForInput(initialData.term_start_date),
                term_end_date: formatDateForInput(initialData.term_end_date),
                midterm_start_date: formatDateForInput(initialData.midterm_start_date),
                midterm_end_date: formatDateForInput(initialData.midterm_end_date),
                final_start_date: formatDateForInput(initialData.final_start_date),
                final_end_date: formatDateForInput(initialData.final_end_date),
            });
            console.log('[TermForm] Updated formData with initialData:', {
                raw: initialData,
                formatted: {
                    term_start_date: formatDateForInput(initialData.term_start_date),
                    term_end_date: formatDateForInput(initialData.term_end_date),
                }
            });
        }
    }, [initialData.id]);

    // Load subjects on mount
    useEffect(() => {
        loadSubjects();
    }, []);

    // Load existing subjects if editing (when term has an ID)
    useEffect(() => {
        if (initialData.id) {
            loadExistingTermSubjects(initialData.id);
        }
    }, [initialData.id]);

    /**
     * Load all active subjects
     */
    const loadSubjects = async () => {
        setIsLoadingSubjects(true);
        try {
            console.log('[TermForm] Calling API: /api/subjects?is_active=true');
            const response = await subjectService.getSubjects({ is_active: true });
            console.log('[TermForm] Raw API response:', response);

            // Handle response structure: { success: true, subjects: [...] } or { success: true, data: [...] }
            const subjects = response?.subjects || response?.data || response;
            console.log('[TermForm] Extracted subjects:', subjects);
            console.log('[TermForm] Is array?', Array.isArray(subjects));

            const subjectArray = Array.isArray(subjects) ? subjects : [];
            setAllSubjects(subjectArray);

            // Log for debugging
            console.log(`[TermForm] ✅ Loaded ${subjectArray.length} subjects`);
            if (subjectArray.length > 0) {
                console.log('[TermForm] Sample subject:', subjectArray[0]);
            }
        } catch (error) {
            console.error('[TermForm] ❌ Failed to load subjects:', error);
            console.error('[TermForm] Error details:', error.message, error.response);
            setAllSubjects([]);
        } finally {
            setIsLoadingSubjects(false);
        }
    };

    /**
     * Load existing subjects in the term (for edit mode)
     */
    const loadExistingTermSubjects = async (termId) => {
        setIsLoadingExistingSubjects(true);
        console.log(`[TermForm] Loading existing subjects for term ID: ${termId}`);
        try {
            const response = await termService.getSubjectsInTerm(termId);
            // Handle response structure: { success: true, data: [...] }
            const termSubjects = response?.data || response;

            if (Array.isArray(termSubjects)) {
                // Map term_subjects data to subject objects
                // term_subjects has: id, term_id, subject_id, and joined subject data
                const subjects = termSubjects.map(ts => ({
                    id: ts.subject_id,
                    code_th: ts.code_th,
                    code_eng: ts.code_eng || ts.subject_code,
                    name_th: ts.name_th,
                    name_eng: ts.name_eng,
                    credit: ts.credit || ts.credits,
                }));

                setSelectedSubjects(subjects);
                console.log(`[TermForm] Loaded ${subjects.length} existing subjects for term`);
            }
        } catch (error) {
            console.error('[TermForm] Failed to load existing term subjects:', error);
            // Don't fail silently - but don't block the form either
            setSelectedSubjects([]);
        } finally {
            setIsLoadingExistingSubjects(false);
        }
    };

    // Filter subjects based on search term
    const filteredSubjects = allSubjects.filter(subject => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            subject.code_th?.toLowerCase().includes(search) ||
            subject.code_eng?.toLowerCase().includes(search) ||
            subject.name_th?.toLowerCase().includes(search) ||
            subject.name_eng?.toLowerCase().includes(search)
        );
    });

    /**
     * Add subject to selected list
     */
    const handleAddSubject = (subject) => {
        // Check if already selected
        if (selectedSubjects.find(s => s.id === subject.id)) {
            console.log(`[TermForm] Subject ${subject.code_eng} already selected`);
            return;
        }
        setSelectedSubjects(prev => [...prev, subject]);
        console.log(`[TermForm] Added subject ${subject.code_eng}`);
    };

    /**
     * Remove subject from selected list
     */
    const handleRemoveSubject = (subjectId) => {
        const subject = selectedSubjects.find(s => s.id === subjectId);
        setSelectedSubjects(prev => prev.filter(s => s.id !== subjectId));
        console.log(`[TermForm] Removed subject ${subject?.code_eng || subjectId}`);
    };

    // Handle input change
    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Validate form
    const validate = () => {
        const newErrors = {};

        if (!formData.academic_year) {
            newErrors.academic_year = 'กรุณากรอกปีการศึกษา';
        } else if (isNaN(formData.academic_year) || Number(formData.academic_year) < 2500) {
            newErrors.academic_year = 'ปีการศึกษาไม่ถูกต้อง';
        }

        if (!formData.academic_sector) {
            newErrors.academic_sector = 'กรุณาเลือกภาคการศึกษา';
        }

        if (!formData.term_start_date) {
            newErrors.term_start_date = 'กรุณาเลือกวันเริ่มภาคการศึกษา';
        }

        if (!formData.term_end_date) {
            newErrors.term_end_date = 'กรุณาเลือกวันสิ้นสุดภาคการศึกษา';
        }

        // Validate date ranges
        if (formData.term_start_date && formData.term_end_date) {
            if (new Date(formData.term_end_date) < new Date(formData.term_start_date)) {
                newErrors.term_end_date = 'วันสิ้นสุดต้องมาหลังวันเริ่มต้น';
            }
        }

        if (formData.midterm_start_date && formData.midterm_end_date) {
            if (new Date(formData.midterm_end_date) < new Date(formData.midterm_start_date)) {
                newErrors.midterm_end_date = 'วันสิ้นสุดต้องมาหลังวันเริ่มต้น';
            }
        }

        if (formData.final_start_date && formData.final_end_date) {
            if (new Date(formData.final_end_date) < new Date(formData.final_start_date)) {
                newErrors.final_end_date = 'วันสิ้นสุดต้องมาหลังวันเริ่มต้น';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Prepare payload
        const subjectIds = selectedSubjects.map(s => parseInt(s.id, 10)); // แปลงเป็น number เพื่อความแน่ใจ
        
        const payload = {
            academic_year: Number(formData.academic_year),
            academic_sector: Number(formData.academic_sector),
            term_start_date: formData.term_start_date,
            term_end_date: formData.term_end_date,
            midterm_start_date: formData.midterm_start_date || null,
            midterm_end_date: formData.midterm_end_date || null,
            final_start_date: formData.final_start_date || null,
            final_end_date: formData.final_end_date || null,
            subject_ids: subjectIds,
        };

        console.log('[TermForm] 📤 Submitting term...');
        console.log('[TermForm] Selected subjects count:', selectedSubjects.length);
        console.log('[TermForm] Selected subjects:', selectedSubjects.map(s => ({ id: s.id, code: s.code_eng || s.code_th, name: s.name_th })));
        console.log('[TermForm] Subject IDs being sent:', subjectIds);
        console.log('[TermForm] Subject IDs type check:', subjectIds.map(id => ({ id, type: typeof id })));
        console.log('[TermForm] Full payload:', JSON.stringify(payload, null, 2));
        
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: ข้อมูลพื้นฐาน */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                    ข้อมูลพื้นฐาน
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ปีการศึกษา */}
                    <TextField
                        label="ปีการศึกษา"
                        value={formData.academic_year}
                        onChange={(value) => handleChange('academic_year', value)}
                        placeholder="เช่น 2568"
                        required
                        error={!!errors.academic_year}
                        helperText={errors.academic_year}
                    />

                    {/* ภาคการศึกษา */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ภาคการศึกษา
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                            value={formData.academic_sector}
                            onChange={(e) => handleChange('academic_sector', e.target.value)}
                            required
                            className={`
                                w-full px-4 py-2
                                bg-white border rounded-lg
                                text-sm text-gray-900
                                focus:outline-none focus:ring-2
                                transition-colors duration-200
                                ${errors.academic_sector
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                }
                            `}
                        >
                            <option value="">เลือกภาคการศึกษา</option>
                            {SEMESTERS.map((sem) => (
                                <option key={sem.value} value={sem.value}>
                                    {sem.label}
                                </option>
                            ))}
                        </select>
                        {errors.academic_sector && (
                            <p className="mt-1 text-xs text-red-500">{errors.academic_sector}</p>
                        )}
                    </div>
                </div>

                {/* วันที่เริ่มต้น - สิ้นสุด */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DatePickerField
                        label="วันเริ่มภาคการศึกษา"
                        value={formData.term_start_date}
                        onChange={(value) => handleChange('term_start_date', value)}
                        required
                        error={!!errors.term_start_date}
                        helperText={errors.term_start_date}
                    />

                    <DatePickerField
                        label="วันสิ้นสุดภาคการศึกษา"
                        value={formData.term_end_date}
                        onChange={(value) => handleChange('term_end_date', value)}
                        required
                        error={!!errors.term_end_date}
                        helperText={errors.term_end_date}
                    />
                </div>
            </div>

            {/* Section 2: ช่วงสอบกลางภาค */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                    ช่วงสอบกลางภาค
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DatePickerField
                        label="วันเริ่มสอบกลางภาค"
                        value={formData.midterm_start_date}
                        onChange={(value) => handleChange('midterm_start_date', value)}
                        error={!!errors.midterm_start_date}
                        helperText={errors.midterm_start_date}
                    />

                    <DatePickerField
                        label="วันสิ้นสุดสอบกลางภาค"
                        value={formData.midterm_end_date}
                        onChange={(value) => handleChange('midterm_end_date', value)}
                        error={!!errors.midterm_end_date}
                        helperText={errors.midterm_end_date}
                    />
                </div>
            </div>

            {/* Section 3: ช่วงสอบปลายภาค */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                    ช่วงสอบปลายภาค
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DatePickerField
                        label="วันเริ่มสอบปลายภาค"
                        value={formData.final_start_date}
                        onChange={(value) => handleChange('final_start_date', value)}
                        error={!!errors.final_start_date}
                        helperText={errors.final_start_date}
                    />

                    <DatePickerField
                        label="วันสิ้นสุดสอบปลายภาค"
                        value={formData.final_end_date}
                        onChange={(value) => handleChange('final_end_date', value)}
                        error={!!errors.final_end_date}
                        helperText={errors.final_end_date}
                    />
                </div>
            </div>

            {/* Section 4: เลือกรายวิชา */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                    เลือกรายวิชา
                </h3>

                {/* Loading existing subjects indicator */}
                {isLoadingExistingSubjects && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        <span className="text-sm text-blue-700">กำลังโหลดรายวิชาที่มีอยู่...</span>
                    </div>
                )}

                {/* Search and Subject List */}
                <div className="space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                        <SearchInput
                            value={searchTerm}
                            onChange={(value) => {
                                setSearchTerm(value);
                                setShowSubjectDropdown(true);
                            }}
                            onFocus={() => setShowSubjectDropdown(true)}
                            placeholder="ค้นหารายวิชา (รหัสวิชา, ชื่อวิชา) - คลิกเพื่อเลือกรายวิชา"
                        />

                        {/* Available Subjects Dropdown Table - Show only when focused or searching */}
                        {showSubjectDropdown && (
                            <>
                                {/* Backdrop to close dropdown */}
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowSubjectDropdown(false)}
                                />

                                {/* Debug Info */}
                                {!isLoadingSubjects && (
                                    <div className="relative z-20 text-xs text-gray-500 mt-1">
                                        แสดง {filteredSubjects.length} จาก {allSubjects.length} รายวิชา
                                    </div>
                                )}

                                {/* Dropdown */}
                                <div className="absolute z-20 w-full mt-1 border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white">
                                    <div className="max-h-80 overflow-y-auto">
                                        {isLoadingSubjects ? (
                                            <div className="flex justify-center items-center py-8">
                                                <LoadingSpinner size="sm" />
                                                <span className="ml-2 text-sm text-gray-500">กำลังโหลดรายวิชา...</span>
                                            </div>
                                        ) : filteredSubjects.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                {searchTerm ? (
                                                    <>
                                                        <p>ไม่พบรายวิชาที่ค้นหา "{searchTerm}"</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSearchTerm('')}
                                                            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                                        >
                                                            ล้างการค้นหา
                                                        </button>
                                                    </>
                                                ) : (
                                                    <p>ไม่มีรายวิชาในระบบ</p>
                                                )}
                                            </div>
                                        ) : (
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-blue-600 sticky top-0">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                            รหัสวิชา
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                            ชื่อวิชา
                                                        </th>
                                                        <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                                            หน่วยกิต
                                                        </th>
                                                        <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                                            จัดการ
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {filteredSubjects.map((subject) => {
                                                        const isSelected = selectedSubjects.find(s => s.id === subject.id);
                                                        return (
                                                            <tr
                                                                key={subject.id}
                                                                className={`hover:bg-gray-50 ${isSelected ? 'bg-green-50' : ''}`}
                                                            >
                                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                                    {subject.code_eng}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                                    {subject.name_th}
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                                                                    {subject.credit}
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            handleAddSubject(subject);
                                                                            setSearchTerm('');
                                                                            setShowSubjectDropdown(false);
                                                                        }}
                                                                        disabled={isSelected}
                                                                        className={`
                                                                            px-3 py-1 text-xs font-medium rounded
                                                                            transition-colors
                                                                            ${isSelected
                                                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                                            }
                                                                        `}
                                                                    >
                                                                        {isSelected ? 'เลือกแล้ว' : 'เลือก'}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Selected Subjects Summary */}
                {selectedSubjects.length > 0 && (
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-900">
                                รายวิชาที่เลือก ({selectedSubjects.length} วิชา)
                            </h4>
                            {/* {initialData.id && !isLoadingExistingSubjects && (
                                <span className="text-xs text-blue-600">
                                    ✓ โหลดรายวิชาที่มีอยู่แล้วเรียบร้อย
                                </span>
                            )} */}
                        </div>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                                            รหัสวิชา
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                                            ชื่อวิชา
                                        </th>
                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                                            หน่วยกิต
                                        </th>
                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                                            ลบ
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {selectedSubjects.map((subject) => (
                                        <tr key={subject.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {subject.code_eng}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-900">
                                                {subject.name_th}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
                                                {subject.credit}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSubject(subject.id)}
                                                    className="text-red-600 hover:text-red-800 font-medium"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    ยกเลิก
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <LoadingSpinner size="sm" text="" />
                            <span>กำลังบันทึก...</span>
                        </div>
                    ) : (
                        submitButtonText
                    )}
                </Button>
            </div>
        </form>
    );
};
