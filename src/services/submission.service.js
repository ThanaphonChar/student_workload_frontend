/**
 * Submission Service
 * API calls for My Subjects submission workflow
 */

import * as apiClient from './apiClient';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ['pdf', 'doc', 'docx'];
const ACCEPTED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function normalizeApiData(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return [];
}

function normalizeHistoryEvents(rows) {
    if (!Array.isArray(rows) || rows.length === 0) return [];

    const isEventShape = rows.some((row) => row?.event_type);
    if (isEventShape) {
        return [...rows].sort((a, b) => {
            const timeA = new Date(a?.event_time || 0).getTime();
            const timeB = new Date(b?.event_time || 0).getTime();
            if (timeA !== timeB) return timeA - timeB;
            return (a?.round_number || 0) - (b?.round_number || 0);
        });
    }

    const events = [];

    rows.forEach((row) => {
        events.push({
            round_number: row?.round_number ?? null,
            submission_id: row?.submission_id ?? null,
            event_type: 'submitted',
            event_time: row?.submitted_at || null,
            file_url: row?.file_url || null,
            original_name: row?.original_name || null,
            status: row?.status || null,
            action: null,
            note: null,
            reason: null,
            reviewer_name: null,
            actor_name: 'อาจารย์',
        });

        if (row?.review) {
            events.push({
                round_number: row?.round_number ?? null,
                submission_id: row?.submission_id ?? null,
                event_type: 'reviewed',
                event_time: row.review?.reviewed_at || null,
                file_url: row?.file_url || null,
                original_name: row?.original_name || null,
                status: row?.status || null,
                action: row.review?.action || row?.status || null,
                note: row.review?.note || null,
                reason: row.review?.reason || null,
                reviewer_name: row.review?.reviewer_name || 'เจ้าหน้าที่',
                actor_name: null,
            });
        }
    });

    return events.sort((a, b) => {
        const timeA = new Date(a?.event_time || 0).getTime();
        const timeB = new Date(b?.event_time || 0).getTime();
        if (timeA !== timeB) return timeA - timeB;
        return (a?.round_number || 0) - (b?.round_number || 0);
    });
}

function validateTermId(termId) {
    const parsed = Number(termId);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error('รหัสภาคการศึกษาไม่ถูกต้อง');
    }
    return parsed;
}

function validateTermSubjectId(termSubjectId) {
    const parsed = Number(termSubjectId);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error('รหัสรายวิชาไม่ถูกต้อง');
    }
    return parsed;
}

function validateDocumentType(documentType) {
    if (!['outline', 'report'].includes(documentType)) {
        throw new Error('ประเภทเอกสารไม่ถูกต้อง');
    }
}

function validateFile(file) {
    if (!file) {
        throw new Error('กรุณาเลือกไฟล์ก่อนส่งเอกสาร');
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error('ไฟล์มีขนาดเกิน 10MB');
    }

    const extension = file.name?.split('.').pop()?.toLowerCase() || '';
    const isAllowedExtension = ACCEPTED_EXTENSIONS.includes(extension);
    const isAllowedMimeType = ACCEPTED_MIME_TYPES.includes(file.type);

    if (!isAllowedExtension || !isAllowedMimeType) {
        throw new Error('รองรับเฉพาะไฟล์ PDF, DOC, DOCX เท่านั้น');
    }
}

export async function getAssignedSubjects() {
    const response = await apiClient.get('/my-subjects');
    return normalizeApiData(response);
}

export async function getMySubjects(termId) {
    const parsedTermId = validateTermId(termId);
    const response = await apiClient.get(`/submissions/my-subjects/${parsedTermId}`);
    return normalizeApiData(response);
}

export async function submitDocument({ termSubjectId, documentType, file }) {
    const parsedTermSubjectId = validateTermSubjectId(termSubjectId);
    validateDocumentType(documentType);
    validateFile(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);

    const uploadResponse = await apiClient.apiRequest(`/term-subjects/${parsedTermSubjectId}/upload`, {
        method: 'POST',
        body: formData,
    });

    const uploadedFile = uploadResponse?.data || {};
    const fileUrl =
        uploadedFile.file_path ||
        uploadedFile.file_url ||
        uploadedFile.path ||
        uploadedFile.url ||
        '';

    const originalName = uploadedFile.original_name || file.name;

    if (!fileUrl) {
        throw new Error('ไม่สามารถอัปโหลดไฟล์ได้');
    }

    const submissionPayload = {
        term_subject_id: parsedTermSubjectId,
        document_type: documentType,
        file_url: fileUrl,
        original_name: originalName,
    };

    const submissionResponse = await apiClient.post('/submissions', submissionPayload);
    return submissionResponse?.data || submissionResponse;
}

export async function getSubmissionHistory(termSubjectId, documentType) {
    const parsedTermSubjectId = validateTermSubjectId(termSubjectId);
    validateDocumentType(documentType);

    const response = await apiClient.get(`/submissions/${parsedTermSubjectId}/history/${documentType}`);
    const rows = normalizeApiData(response);
    return normalizeHistoryEvents(rows);
}

/**
 * เจ้าหน้าที่ approve หรือ reject เอกสาร
 * @param {number} submissionId
 * @param {{ action: 'approved'|'rejected', note?: string, reason?: string }} data
 */
export async function reviewDocument(submissionId, data) {
    const parsedSubmissionId = Number(submissionId);
    if (!Number.isInteger(parsedSubmissionId) || parsedSubmissionId <= 0) {
        throw new Error('รหัสการส่งเอกสารไม่ถูกต้อง');
    }

    return apiClient.patch(`/submissions/${parsedSubmissionId}/review`, data);
}

/**
 * ดึง submission ล่าสุดของ term_subject + document_type
 * @param {number} termSubjectId
 * @param {'outline'|'report'} documentType
 */
export async function getLatestSubmission(termSubjectId, documentType) {
    const parsedTermSubjectId = validateTermSubjectId(termSubjectId);
    validateDocumentType(documentType);

    const history = await getSubmissionHistory(parsedTermSubjectId, documentType);
    if (!Array.isArray(history) || history.length === 0) return null;

    const submittedEvents = history.filter((event) => event?.event_type === 'submitted');
    if (submittedEvents.length === 0) return null;

    const latestSubmitted = [...submittedEvents].sort((a, b) => {
        if ((b?.round_number || 0) !== (a?.round_number || 0)) {
            return (b?.round_number || 0) - (a?.round_number || 0);
        }

        const timeA = new Date(a?.event_time || 0).getTime();
        const timeB = new Date(b?.event_time || 0).getTime();
        return timeB - timeA;
    })[0];

    if (latestSubmitted?.submission_id) {
        return latestSubmitted;
    }

    return latestSubmitted;
}

/**
 * ดึง submission ล่าสุดโดยพยายามเติม submission_id จาก status endpoint
 * ใช้ในกรณี backend history ยังเป็น shape เก่าที่ไม่มี submission_id
 */
export async function getLatestSubmissionWithFallback(termSubjectId, documentType, termId) {
    const history = await getSubmissionHistory(termSubjectId, documentType);
    if (!Array.isArray(history) || history.length === 0) return null;

    const submittedEvents = history.filter((event) => event?.event_type === 'submitted');
    if (submittedEvents.length === 0) return null;

    const latestSubmitted = [...submittedEvents].sort((a, b) => {
        if ((b?.round_number || 0) !== (a?.round_number || 0)) {
            return (b?.round_number || 0) - (a?.round_number || 0);
        }

        const timeA = new Date(a?.event_time || 0).getTime();
        const timeB = new Date(b?.event_time || 0).getTime();
        return timeB - timeA;
    })[0];

    if (latestSubmitted?.submission_id) {
        return latestSubmitted;
    }

    const parsedTermId = validateTermId(termId);
    const statusRows = await getMySubjects(parsedTermId);
    const matched = statusRows.find((row) => Number(row?.term_subject_id) === Number(termSubjectId));
    const latestByStatus = matched?.[documentType] || null;

    if (!latestByStatus?.submission_id) {
        return latestSubmitted;
    }

    return {
        ...latestSubmitted,
        submission_id: latestByStatus.submission_id,
        round_number: latestByStatus.round_number ?? latestSubmitted.round_number,
        status: latestByStatus.status ?? latestSubmitted.status,
        event_time: latestByStatus.submitted_at ?? latestSubmitted.event_time,
    };
}

