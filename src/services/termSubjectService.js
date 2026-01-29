/**
 * Term Subject Service
 * API calls สำหรับจัดการรายวิชาในภาคการศึกษา
 */

import * as apiClient from './apiClient';

const BASE_URL = '/term-subjects';

/**
 * เพิ่มรายวิชาเข้าภาคการศึกษา
 * @param {Object} data - { term_id, subject_id }
 * @returns {Promise} Created term subject
 */
export const addSubjectToTerm = async (data) => {
    const response = await apiClient.post(BASE_URL, data);
    return response;
};

/**
 * ดึงรายการวิชาทั้งหมดในภาคการศึกษา
 * @param {number} termId - Term ID
 * @returns {Promise} Array of subjects
 */
export const getTermSubjects = async (termId) => {
    const response = await apiClient.get(`${BASE_URL}/term/${termId}`);
    return response;
};

/**
 * ดึงข้อมูล term subject ตาม ID
 * @param {number} id - Term Subject ID
 * @returns {Promise} Term subject data
 */
export const getTermSubjectById = async (id) => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response;
};

/**
 * ลบรายวิชาออกจากภาคการศึกษา
 * @param {number} id - Term Subject ID
 * @returns {Promise} Response
 */
export const removeSubjectFromTerm = async (id) => {
    const response = await apiClient.del(`${BASE_URL}/${id}`);
    return response;
};

/**
 * เพิ่มหลายรายวิชาพร้อมกัน
 * @param {number} termId - Term ID
 * @param {Array} subjectIds - Array of subject IDs
 * @returns {Promise} Array of results
 */
export const addMultipleSubjects = async (termId, subjectIds) => {
    const promises = subjectIds.map(subjectId => 
        addSubjectToTerm({ term_id: termId, subject_id: subjectId })
    );
    return Promise.all(promises);
};
