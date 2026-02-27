/**
 * Subject Service
 * API calls สำหรับจัดการรายวิชา
 */

import * as apiClient from './apiClient';

const BASE_URL = '/subjects';

/**
 * ดึงรายการวิชาทั้งหมด พร้อม filter
 * @param {Object} params - { program_id, student_year_id, is_active }
 * @returns {Promise} Response data
 */
export const getSubjects = async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.program_id) queryParams.append('program_id', params.program_id);
    if (params.student_year_id) queryParams.append('student_year_id', params.student_year_id);
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active);

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

    const response = await apiClient.get(url);
    return response;
};

/**
 * ดึงข้อมูลรายวิชาตาม ID
 * @param {number} id - Subject ID
 * @returns {Promise} Subject data
 */
export const getSubjectById = async (id) => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response;
};

/**
 * สร้างรายวิชาใหม่
 * @param {Object} data - Subject data
 * @returns {Promise} Created subject
 */
export const createSubject = async (data) => {
    const response = await apiClient.post(BASE_URL, data);
    return response;
};

/**
 * อัพเดทรายวิชา
 * @param {number} id - Subject ID
 * @param {Object} data - Update data
 * @returns {Promise} Updated subject
 */
export const updateSubject = async (id, data) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response;
};

/**
 * ลบรายวิชา (soft delete)
 * @param {number} id - Subject ID
 * @returns {Promise} Delete response
 */
export const deleteSubject = async (id) => {
    const response = await apiClient.deleteRequest(`${BASE_URL}/${id}`);
    return response;
};

/**
 * ดึงรายการ student year IDs ของวิชา
 * @param {number} id - Subject ID
 * @returns {Promise<Array<number>>} Array of student year IDs
 */
export const getStudentYears = async (id) => {
    const response = await apiClient.get(`${BASE_URL}/${id}/student-years`);
    return response.data;
};

// Alias for updateSubject (for consistency)
export const update = updateSubject;

export default {
    getSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    update,
    deleteSubject,
    getStudentYears,
};
