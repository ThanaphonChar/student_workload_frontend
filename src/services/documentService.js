/**
 * Document Upload Service
 * 
 * จัดการการอัปโหลดเอกสารสำหรับ Term Subjects
 * - อัปโหลดไฟล์ไปยัง backend
 * - ดึงรายการเอกสารที่อัปโหลดแล้ว
 */

import apiClient from './api';

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

    const response = await apiClient.post(
        `/term-subjects/${termSubjectId}/upload`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return response.data;
}

/**
 * ดึงรายการเอกสารทั้งหมดของ term subject
 * 
 * @param {number} termSubjectId - ID ของ term subject
 * @returns {Promise<Array>} - รายการเอกสาร
 */
export async function getDocuments(termSubjectId) {
    const response = await apiClient.get(`/term-subjects/${termSubjectId}/documents`);
    return response.data;
}

const documentService = {
    uploadDocument,
    getDocuments,
};

export default documentService;
