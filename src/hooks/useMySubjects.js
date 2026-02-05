/**
 * Custom Hook สำหรับจัดการรายวิชาที่มอบหมายให้อาจารย์
 */

import { useState, useEffect, useCallback } from 'react';
import * as mySubjectsService from '../services/mySubjectsService';

/**
 * Hook สำหรับดึงรายวิชาที่มอบหมายให้อาจารย์ที่ล็อกอินอยู่
 * ใช้สำหรับหน้า "รายวิชาของฉัน" (My Subjects)
 * 
 * @returns {Object} { subjects, loading, error, refetch }
 */
export function useMySubjects() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await mySubjectsService.getMySubjects();
            setSubjects(data || []);
        } catch (err) {
            console.error('[useMySubjects] Error:', err);
            setError(err.response?.data?.message || 'ไม่สามารถโหลดรายวิชาได้');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        subjects,
        loading,
        error,
        refetch: fetchData,
    };
}
