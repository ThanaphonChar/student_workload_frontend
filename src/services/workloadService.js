/**
 * Workload Service
 * API calls สำหรับจัดการภาระงาน (workload)
 */

import * as apiClient from './apiClient';

/**
 * สร้างภาระงานใหม่
 * @param {number} termSubjectId - ID ของ term_subject
 * @param {Object} data - {work_title, description, start_date, end_date, hours_per_week}
 * @returns {Promise} Created workload
 */
export const createWorkload = async (termSubjectId, data) => {
    const response = await apiClient.post(`/term-subjects/${termSubjectId}/works`, data);
    return response;
};

/**
 * ดึงภาระงานของ term_subject
 * @param {number} termSubjectId - ID ของ term_subject
 * @returns {Promise} Workload data or null
 */
export const getWorkloadByTermSubject = async (termSubjectId) => {
    const response = await apiClient.get(`/term-subjects/${termSubjectId}/works`);
    return response;
};

/**
 * ดึงภาระงานตาม ID
 * @param {number} workId - ID ของ workload
 * @returns {Promise} Workload data
 */
export const getWorkloadById = async (workId) => {
    const response = await apiClient.get(`/works/${workId}`);
    return response;
};

/**
 * อัพเดทภาระงาน
 * @param {number} termSubjectId - ID ของ term_subject
 * @param {number} workId - ID ของ workload
 * @param {Object} data - ข้อมูลที่ต้องการอัพเดท (partial object)
 * @returns {Promise} Updated workload
 */
export const updateWorkload = async (termSubjectId, workId, data) => {
    const response = await apiClient.put(`/term-subjects/${termSubjectId}/works/${workId}`, data);
    return response;
};

/**
 * ลบภาระงาน
 * @param {number} termSubjectId - ID ของ term_subject
 * @param {number} workId - ID ของ workload
 * @returns {Promise} Response
 */
export const deleteWorkload = async (termSubjectId, workId) => {
    const response = await apiClient.del(`/term-subjects/${termSubjectId}/works/${workId}`);
    return response;
};

/**
 * ดึงภาระงานทั้งหมดของ term
 * @param {number} termId - ID ของ term
 * @returns {Promise} Array of workloads
 */
export const getWorkloadsByTerm = async (termId) => {
    const response = await apiClient.get(`/terms/${termId}/works`);
    return response;
};
