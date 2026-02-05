/**
 * My Subjects Service
 * API client สำหรับดึงรายวิชาที่มอบหมายให้อาจารย์
 */

import * as apiClient from './apiClient';

/**
 * ดึงรายวิชาที่มอบหมายให้อาจารย์ที่ล็อกอินอยู่
 * เฉพาะ Professor เท่านั้นที่เรียกได้
 * 
 * @returns {Promise<Array>} รายวิชาที่ assigned
 */
export async function getMySubjects() {
    try {
        console.log('[mySubjectsService] Fetching my subjects...');
        const response = await apiClient.get('/my-subjects');
        console.log('[mySubjectsService] Got', response.data?.length || 0, 'subjects');
        return response.data;
    } catch (error) {
        console.error('[mySubjectsService] Error fetching my subjects:', error);
        throw error;
    }
}
