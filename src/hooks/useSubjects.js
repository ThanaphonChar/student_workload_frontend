/**
 * useSubjects Hook
 * จัดการ business logic สำหรับ Subject List
 * 
 * Responsibilities:
 * - Fetch subjects จาก API
 * - Handle search/filter logic
 * - Handle delete subject
 * - Manage loading & error states
 */

import { useState, useEffect, useMemo } from 'react';
import * as subjectService from '../services/subjectService';

export const useSubjects = () => {
    // States
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Load subjects on mount
    useEffect(() => {
        loadSubjects();
    }, []);

    /**
     * ดึงรายการวิชาจาก API
     */
    const loadSubjects = async () => {
        setLoading(true);
        setError(null);

        try {
            // ดึงเฉพาะวิชาที่ active
            const response = await subjectService.getSubjects({ is_active: true });
            setSubjects(response.subjects || []);
        } catch (err) {
            console.error('[useSubjects] Error loading subjects:', err);
            setError(err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลรายวิชาได้');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Filter subjects ตาม search query
     * ใช้ useMemo เพื่อ optimize performance
     */
    const filteredSubjects = useMemo(() => {
        if (!searchQuery.trim()) {
            return subjects;
        }

        const query = searchQuery.toLowerCase();
        return subjects.filter(subject =>
            subject.code_th?.toLowerCase().includes(query) ||
            subject.code_eng?.toLowerCase().includes(query) ||
            subject.name_th?.toLowerCase().includes(query) ||
            subject.name_eng?.toLowerCase().includes(query)
        );
    }, [searchQuery, subjects]);

    /**
     * ลบรายวิชา (soft delete)
     */
    const deleteSubject = async (id) => {
        try {
            await subjectService.deleteSubject(id);

            // ลบออกจาก state (เพราะเราแสดงเฉพาะ active subjects)
            setSubjects(prev => prev.filter(s => s.id !== id));

            return { success: true };
        } catch (err) {
            console.error('[useSubjects] Error deleting subject:', err);
            const errorMessage = err.response?.data?.message || 'ไม่สามารถลบรายวิชาได้';
            return { success: false, error: errorMessage };
        }
    };

    // Return clean API
    return {
        subjects: filteredSubjects,
        totalCount: subjects.length,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        deleteSubject,
        refetch: loadSubjects,
    };
};
