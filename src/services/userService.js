/**
 * User Service
 * API client สำหรับจัดการข้อมูล users
 */

import * as apiClient from './apiClient';

/**
 * ดึงรายชื่ออาจารย์ทั้งหมด
 * เฉพาะ Academic Officer เท่านั้นที่เรียกได้
 * 
 * @returns {Promise<Array>} รายชื่ออาจารย์
 */
export async function getProfessors() {
    try {
        console.log('[userService] Fetching professors...');
        const response = await apiClient.get('/users/professors');
        console.log('[userService] Got', response.data?.length || 0, 'professors');
        return response.data;
    } catch (error) {
        console.error('[userService] Error fetching professors:', error);
        throw error;
    }
}
