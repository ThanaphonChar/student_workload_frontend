/**
 * Course Status Service
 * API client สำหรับจัดการ Course Status (สถานะรายวิชา)
 */

import * as apiClient from './apiClient';

/**
 * ดึงสถานะรายวิชาตาม term ID
 * Backend จะ filter ตาม role อัตโนมัติ:
 * - Academic Officer/Program Chair: ได้ทั้งหมด
 * - Professor: ได้เฉพาะที่ assigned
 * 
 * @param {number} termId - Term ID
 * @returns {Promise<Array>} รายการวิชาพร้อมสถานะ
 */
export async function getCourseStatusByTerm(termId) {
    try {
        console.log('[courseStatusService] Fetching course status for term:', termId);
        const response = await apiClient.get(`/terms/${termId}/subjects/status`);
        console.log('[courseStatusService] Got', response.data?.length || 0, 'subjects');
        return response.data;
    } catch (error) {
        console.error('[courseStatusService] Error fetching course status:', error);
        throw error;
    }
}

/**
 * ดึงสถานะรายวิชาของ active term
 * ใช้สำหรับ tab "สถานะรายวิชา" ที่แสดงเฉพาะ current term
 * 
 * @returns {Promise<Object>} { term: {...}, subjects: [...] }
 */
export async function getActiveCourseStatus() {
    try {
        console.log('[courseStatusService] Fetching active term course status');
        const response = await apiClient.get('/terms/active/subjects/status');
        console.log('[courseStatusService] Active term:', response.term);
        console.log('[courseStatusService] Got', response.data?.length || 0, 'subjects');
        return {
            term: response.term,
            subjects: response.data,
        };
    } catch (error) {
        console.error('[courseStatusService] Error fetching active course status:', error);
        throw error;
    }
}

/**
 * ดึงข้อมูล term subject โดยละเอียด
 * Backend จะเช็คสิทธิ์ว่า user มีสิทธิ์ดูหรือไม่
 * 
 * @param {number} termSubjectId - Term Subject ID
 * @returns {Promise<Object>} ข้อมูล term subject พร้อม professors
 */
export async function getTermSubjectDetail(termSubjectId) {
    try {
        console.log('[courseStatusService] Fetching term subject detail:', termSubjectId);
        const response = await apiClient.get(`/term-subjects/${termSubjectId}/detail`);
        return response.data;
    } catch (error) {
        console.error('[courseStatusService] Error fetching term subject detail:', error);
        throw error;
    }
}

/**
 * มอบหมายอาจารย์ให้สอนวิชา
 * เฉพาะ Academic Officer เท่านั้น (backend จะเช็คสิทธิ์)
 * 
 * @param {number} termSubjectId - Term Subject ID
 * @param {number} professorId - User ID ของอาจารย์
 * @returns {Promise<Object>} ข้อมูลการ assign
 */
export async function assignProfessor(termSubjectId, professorId) {
    try {
        console.log('[courseStatusService] Assigning professor:', { termSubjectId, professorId });
        const response = await apiClient.post(`/term-subjects/${termSubjectId}/assign-professor`, {
            professor_id: professorId,
        });
        console.log('[courseStatusService] Professor assigned successfully');
        return response.data;
    } catch (error) {
        console.error('[courseStatusService] Error assigning professor:', error);
        throw error;
    }
}
