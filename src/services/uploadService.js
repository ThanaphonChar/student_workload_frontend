/**
 * Upload Service
 * จัดการ API calls สำหรับการอัปโหลดเอกสาร
 */

import { apiRequest } from './apiClient';

/**
 * อัปโหลดเอกสารสำหรับ term subject
 * 
 * @param {number} termSubjectId - ID ของ term subject
 * @param {string} documentType - ประเภทเอกสาร: 'outline', 'report'
 * @param {File} file - ไฟล์ที่จะอัปโหลด
 * @returns {Promise<Object>} - Document metadata
 */
export async function uploadDocument(termSubjectId, documentType, file) {
    // สร้าง FormData สำหรับส่งไฟล์
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);

    const response = await apiRequest(
        `/term-subjects/${termSubjectId}/upload`,
        {
            method: 'POST',
            body: formData,
            headers: {
                // ไม่ต้องใส่ Content-Type เพราะ browser จะ set ให้อัตโนมัติพร้อม boundary
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
    const response = await apiRequest(`/term-subjects/${termSubjectId}/documents`);
    return response.data;
}

/**
 * ดึงเอกสารล่าสุดของแต่ละประเภท (outline, report)
 * ใช้สำหรับแสดงสถานะว่าอัปโหลดแล้วหรือยัง
 * 
 * @param {number} termSubjectId - ID ของ term subject
 * @returns {Promise<Object>} - Object ที่มี key: outline, report
 */
export async function getLatestDocuments(termSubjectId) {
    const response = await apiRequest(`/term-subjects/${termSubjectId}/documents/latest`);
    return response.data;
}

const uploadService = {
    uploadDocument,
    getDocuments,
    getLatestDocuments,
};

export default uploadService;
