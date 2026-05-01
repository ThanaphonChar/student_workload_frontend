import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('../../services/apiClient.js', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
    },
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    apiRequest: vi.fn(),
}));

import * as apiClient from '../../services/apiClient.js';
import {
    getMySubjects,
    submitDocument,
    getSubmissionHistory,
    reviewDocument,
} from '../../services/submission.service.js';

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

const makePdfFile = (name = 'test.pdf', size = 1024) => {
    const file = new File(['x'.repeat(size)], name, { type: 'application/pdf' });
    return file;
};

const makeFileWithSize = (name, type, size) => {
    const file = new File(['x'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
};

beforeEach(() => {
    vi.clearAllMocks();
});

// ────────────────────────────────────────────────────────────────────────────
// getMySubjects
// ────────────────────────────────────────────────────────────────────────────
describe('getMySubjects', () => {
    test('calls correct endpoint with parsed termId', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getMySubjects(5);
        expect(apiClient.get).toHaveBeenCalledWith('/submissions/my-subjects/5');
    });

    test('parses string termId to integer in the URL', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getMySubjects('7');
        expect(apiClient.get).toHaveBeenCalledWith('/submissions/my-subjects/7');
    });

    test('throws when termId is 0', async () => {
        await expect(getMySubjects(0)).rejects.toThrow('รหัสภาคการศึกษาไม่ถูกต้อง');
    });

    test('throws when termId is non-numeric string', async () => {
        await expect(getMySubjects('abc')).rejects.toThrow('รหัสภาคการศึกษาไม่ถูกต้อง');
    });

    test('throws when termId is negative', async () => {
        await expect(getMySubjects(-1)).rejects.toThrow('รหัสภาคการศึกษาไม่ถูกต้อง');
    });

    test('returns normalized array when response.data is an array', async () => {
        const mockData = [{ term_subject_id: 1 }, { term_subject_id: 2 }];
        apiClient.get.mockResolvedValueOnce({ data: mockData });
        const result = await getMySubjects(1);
        expect(result).toEqual(mockData);
    });

    test('returns array when response itself is an array', async () => {
        const mockData = [{ term_subject_id: 3 }];
        apiClient.get.mockResolvedValueOnce(mockData);
        const result = await getMySubjects(1);
        expect(result).toEqual(mockData);
    });

    test('returns empty array when response has no data', async () => {
        apiClient.get.mockResolvedValueOnce({});
        const result = await getMySubjects(1);
        expect(result).toEqual([]);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// submitDocument
// ────────────────────────────────────────────────────────────────────────────
describe('submitDocument', () => {
    const validArgs = () => ({
        termSubjectId: 1,
        documentType: 'outline',
        file: makePdfFile(),
    });

    beforeEach(() => {
        apiClient.apiRequest.mockResolvedValue({
            data: { file_url: 'https://example.com/uploaded.pdf', original_name: 'test.pdf' },
        });
        apiClient.post.mockResolvedValue({ data: { id: 1, status: 'pending' } });
    });

    test('throws when file is null', async () => {
        await expect(submitDocument({ ...validArgs(), file: null })).rejects.toThrow(
            'กรุณาเลือกไฟล์ก่อนส่งเอกสาร'
        );
    });

    test('throws when file size exceeds 10MB', async () => {
        const bigFile = makeFileWithSize('big.pdf', 'application/pdf', 11 * 1024 * 1024);
        await expect(submitDocument({ ...validArgs(), file: bigFile })).rejects.toThrow(
            'ไฟล์มีขนาดเกิน 10MB'
        );
    });

    test('throws when file extension is .exe', async () => {
        const exeFile = new File(['x'], 'malware.exe', { type: 'application/octet-stream' });
        await expect(submitDocument({ ...validArgs(), file: exeFile })).rejects.toThrow(
            'รองรับเฉพาะไฟล์ PDF, DOC, DOCX เท่านั้น'
        );
    });

    test('throws when file has valid extension but disallowed MIME type', async () => {
        const fakeFile = new File(['x'], 'hack.pdf', { type: 'text/plain' });
        await expect(submitDocument({ ...validArgs(), file: fakeFile })).rejects.toThrow(
            'รองรับเฉพาะไฟล์ PDF, DOC, DOCX เท่านั้น'
        );
    });

    test('calls upload endpoint then submission endpoint for valid file', async () => {
        await submitDocument(validArgs());
        expect(apiClient.apiRequest).toHaveBeenCalledWith(
            '/term-subjects/1/upload',
            expect.objectContaining({ method: 'POST' })
        );
        expect(apiClient.post).toHaveBeenCalledWith(
            '/submissions',
            expect.objectContaining({
                term_subject_id: 1,
                document_type: 'outline',
                file_url: 'https://example.com/uploaded.pdf',
            })
        );
    });

    test('throws when file_url is missing from upload response', async () => {
        apiClient.apiRequest.mockResolvedValueOnce({ data: {} });
        await expect(submitDocument(validArgs())).rejects.toThrow('ไม่สามารถอัปโหลดไฟล์ได้');
    });

    test('throws when upload response is null', async () => {
        apiClient.apiRequest.mockResolvedValueOnce(null);
        await expect(submitDocument(validArgs())).rejects.toThrow('ไม่สามารถอัปโหลดไฟล์ได้');
    });

    test('throws when termSubjectId is invalid', async () => {
        await expect(submitDocument({ ...validArgs(), termSubjectId: 0 })).rejects.toThrow(
            'รหัสรายวิชาไม่ถูกต้อง'
        );
    });

    test('throws when documentType is not outline or report', async () => {
        await expect(
            submitDocument({ ...validArgs(), documentType: 'invoice' })
        ).rejects.toThrow('ประเภทเอกสารไม่ถูกต้อง');
    });

    test('upload endpoint is called before submission endpoint', async () => {
        const callOrder = [];
        apiClient.apiRequest.mockImplementation(() => {
            callOrder.push('upload');
            return Promise.resolve({
                data: { file_url: 'https://example.com/f.pdf', original_name: 'f.pdf' },
            });
        });
        apiClient.post.mockImplementation(() => {
            callOrder.push('post');
            return Promise.resolve({ data: { id: 1 } });
        });

        await submitDocument(validArgs());
        expect(callOrder).toEqual(['upload', 'post']);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getSubmissionHistory
// ────────────────────────────────────────────────────────────────────────────
describe('getSubmissionHistory', () => {
    test('throws when documentType is invoice', async () => {
        await expect(getSubmissionHistory(1, 'invoice')).rejects.toThrow(
            'ประเภทเอกสารไม่ถูกต้อง'
        );
    });

    test('throws when termSubjectId is 0', async () => {
        await expect(getSubmissionHistory(0, 'outline')).rejects.toThrow(
            'รหัสรายวิชาไม่ถูกต้อง'
        );
    });

    test('calls correct endpoint', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getSubmissionHistory(3, 'report');
        expect(apiClient.get).toHaveBeenCalledWith('/submissions/3/history/report');
    });

    test('returns normalized event array sorted by event_time ASC', async () => {
        const rows = [
            {
                event_type: 'submitted',
                event_time: '2024-02-01T00:00:00Z',
                round_number: 2,
                submission_id: 20,
                status: 'pending',
            },
            {
                event_type: 'submitted',
                event_time: '2024-01-01T00:00:00Z',
                round_number: 1,
                submission_id: 10,
                status: 'approved',
            },
        ];
        apiClient.get.mockResolvedValueOnce({ data: rows });

        const result = await getSubmissionHistory(1, 'outline');

        expect(result[0].event_time).toBe('2024-01-01T00:00:00Z');
        expect(result[1].event_time).toBe('2024-02-01T00:00:00Z');
    });

    test('returns empty array when response has no data', async () => {
        apiClient.get.mockResolvedValueOnce({});
        const result = await getSubmissionHistory(1, 'outline');
        expect(result).toEqual([]);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// reviewDocument
// ────────────────────────────────────────────────────────────────────────────
describe('reviewDocument', () => {
    test('calls PATCH /submissions/:id/review with correct body', async () => {
        apiClient.patch.mockResolvedValueOnce({ data: { ok: true } });
        const payload = { action: 'approved', note: 'LGTM' };
        await reviewDocument(5, payload);
        expect(apiClient.patch).toHaveBeenCalledWith('/submissions/5/review', payload);
    });

    test('throws when submissionId is 0', async () => {
        await expect(reviewDocument(0, { action: 'approved' })).rejects.toThrow(
            'รหัสการส่งเอกสารไม่ถูกต้อง'
        );
    });

    test('throws when submissionId is negative', async () => {
        await expect(reviewDocument(-1, { action: 'approved' })).rejects.toThrow(
            'รหัสการส่งเอกสารไม่ถูกต้อง'
        );
    });

    test('throws when submissionId is NaN', async () => {
        await expect(reviewDocument('abc', { action: 'approved' })).rejects.toThrow(
            'รหัสการส่งเอกสารไม่ถูกต้อง'
        );
    });

    test('returns the patch response', async () => {
        const mockResponse = { data: { success: true } };
        apiClient.patch.mockResolvedValueOnce(mockResponse);
        const result = await reviewDocument(7, { action: 'rejected', reason: 'Incomplete' });
        expect(result).toEqual(mockResponse);
    });
});
