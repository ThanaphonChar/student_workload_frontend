/**
 * Upload Service
 * จัดการ API calls สำหรับการอัปโหลดเอกสาร
 */

import { apiRequest } from './apiClient';
import { getAuth } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

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

/**
 * ดึงไฟล์เอกสารแบบ protected (ต้องแนบ token)
 * 
 * @param {number} termSubjectId - ID ของ term subject
 * @param {number} documentId - ID ของเอกสาร
 * @param {boolean} download - true = ดาวน์โหลด, false = ดูไฟล์
 * @returns {Promise<{blob: Blob, fileName: string}>}
 */
export async function fetchDocumentFile(termSubjectId, documentId, download = false) {
    const auth = getAuth();
    const token = auth?.token;

    const query = download ? '?download=1' : '';
    const url = `${API_BASE_URL}/term-subjects/${termSubjectId}/documents/${documentId}/file${query}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
            const data = await response.json();
            message = data.message || message;
        } catch {
            // ignore json parse error for binary response
        }
        throw new Error(message);
    }

    const blob = await response.blob();

    const disposition = response.headers.get('content-disposition') || '';
    const utf8NameMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i);
    const plainNameMatch = disposition.match(/filename="?([^";]+)"?/i);
    const fileName = decodeURIComponent(
        utf8NameMatch?.[1] || plainNameMatch?.[1] || `document-${documentId}`
    );

    return { blob, fileName };
}

export async function viewDocumentFile(termSubjectId, documentId) {
    const { blob } = await fetchDocumentFile(termSubjectId, documentId, false);
    const blobUrl = window.URL.createObjectURL(blob);
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60_000);
}

export async function downloadDocumentFile(termSubjectId, documentId) {
    const { blob, fileName } = await fetchDocumentFile(termSubjectId, documentId, true);
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
}

const uploadService = {
    uploadDocument,
    getDocuments,
    getLatestDocuments,
    fetchDocumentFile,
    viewDocumentFile,
    downloadDocumentFile,
};

export default uploadService;
