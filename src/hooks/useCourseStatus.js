/**
 * Custom Hook สำหรับจัดการ Course Status
 */

import { useState, useEffect, useCallback } from 'react';
import * as courseStatusService from '../services/courseStatusService';

/**
 * Hook สำหรับดึงสถานะรายวิชาตาม term ID
 * รองรับ role-based filtering จาก backend
 * 
 * @param {number} termId - Term ID
 * @returns {Object} { subjects, loading, error, refetch }
 */
export function useCourseStatus(termId) {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!termId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await courseStatusService.getCourseStatusByTerm(termId);
            setSubjects(data || []);
        } catch (err) {
            console.error('[useCourseStatus] Error:', err);
            setError(err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลได้');
        } finally {
            setLoading(false);
        }
    }, [termId]);

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

/**
 * Hook สำหรับดึงสถานะรายวิชาของ active term
 * ใช้สำหรับ tab "สถานะรายวิชา"
 * 
 * @returns {Object} { term, subjects, loading, error, refetch }
 */
export function useActiveCourseStatus() {
    const [term, setTerm] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await courseStatusService.getActiveCourseStatus();
            setTerm(data.term);
            setSubjects(data.subjects || []);
        } catch (err) {
            console.error('[useActiveCourseStatus] Error:', err);
            
            // แยกแยะ error: ไม่มี active term vs error อื่นๆ
            if (err.response?.status === 404) {
                setError('ไม่พบภาคการศึกษาที่กำลังดำเนินการอยู่');
            } else {
                setError(err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลได้');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        term,
        subjects,
        loading,
        error,
        refetch: fetchData,
    };
}

/**
 * Hook สำหรับ assign professor
 * 
 * @returns {Object} { assignProfessor, assigning, error }
 */
export function useAssignProfessor() {
    const [assigning, setAssigning] = useState(false);
    const [error, setError] = useState(null);

    const assignProfessor = useCallback(async (termSubjectId, professorId) => {
        setAssigning(true);
        setError(null);

        try {
            const result = await courseStatusService.assignProfessor(termSubjectId, professorId);
            return result;
        } catch (err) {
            console.error('[useAssignProfessor] Error:', err);
            const errorMessage = err.response?.data?.message || 'ไม่สามารถมอบหมายอาจารย์ได้';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setAssigning(false);
        }
    }, []);

    return {
        assignProfessor,
        assigning,
        error,
    };
}
