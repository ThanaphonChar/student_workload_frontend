/**
 * Document Upload Service
 * 
 * จัดการการอัปโหลดเอกสารสำหรับ Term Subjects
 * - อัปโหลดไฟล์ไปยัง backend
 * - ดึงรายการเอกสารที่อัปโหลดแล้ว
 */

import * as apiClient from './apiClient';

/**
 * อัปโหลดเอกสารสำหรับ term subject
 * 
 * @param {number} termSubjectId - ID ของ term subject
 * @param {string} documentType - ประเภทเอกสาร: 'outline', 'workload', 'report'
 * @param {File} file - ไฟล์ที่จะอัปโหลด
 * @returns {Promise<Object>} - Document metadata
 */
export async function uploadDocument(termSubjectId, documentType, file) {
    // สร้าง FormData สำหรับ multipart/form-data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);

    const response = await apiClient.apiRequest(`/term-subjects/${termSubjectId}/upload`, {
        method: 'POST',
        body: formData,
    });

    return response?.data || response;
}

/**
 * ดึงรายการเอกสารทั้งหมดของ term subject
 * 
 * @param {number} termSubjectId - ID ของ term subject
 * @returns {Promise<Array>} - รายการเอกสาร
 */
export async function getDocuments(termSubjectId) {
    const response = await apiClient.get(`/term-subjects/${termSubjectId}/documents`);
    if (response?.data !== undefined) {
        return response.data;
    }
    // ถ้า response?.data is undefined, return undefined ถ้า response is empty object
    return Object.keys(response).length > 0 ? response : undefined;
}

const documentService = {
    uploadDocument,
    getDocuments,
};

export default documentService;
