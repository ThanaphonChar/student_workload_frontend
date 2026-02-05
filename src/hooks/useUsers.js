/**
 * Custom Hook สำหรับจัดการข้อมูล users
 */

import { useState, useEffect, useCallback } from 'react';
import * as userService from '../services/userService';

/**
 * Hook สำหรับดึงรายชื่ออาจารย์ทั้งหมด
 * ใช้สำหรับ dropdown ในการ assign professor
 * 
 * @returns {Object} { professors, loading, error, refetch }
 */
export function useProfessors() {
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await userService.getProfessors();
            setProfessors(data || []);
        } catch (err) {
            console.error('[useProfessors] Error:', err);
            setError(err.response?.data?.message || 'ไม่สามารถโหลดรายชื่ออาจารย์ได้');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        professors,
        loading,
        error,
        refetch: fetchData,
    };
}
