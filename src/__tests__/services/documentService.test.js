import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('../../services/apiClient.js', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    apiRequest: vi.fn(),
}));

import * as apiClient from '../../services/apiClient.js';
import {
    uploadDocument,
    getDocuments,
} from '../../services/documentService.js';

beforeEach(() => {
    vi.clearAllMocks();
});

// ────────────────────────────────────────────────────────────────────────────
// uploadDocument
// ────────────────────────────────────────────────────────────────────────────
describe('uploadDocument', () => {
    test('calls apiRequest with the correct endpoint', async () => {
        apiClient.apiRequest.mockResolvedValueOnce({ data: { id: 1, file_url: 'https://example.com/doc.pdf' } });

        await uploadDocument(42, 'outline', new File(['content'], 'doc.pdf', { type: 'application/pdf' }));

        expect(apiClient.apiRequest).toHaveBeenCalledWith(
            '/term-subjects/42/upload',
            expect.objectContaining({ method: 'POST' })
        );
    });

    test('sends a FormData body', async () => {
        apiClient.apiRequest.mockResolvedValueOnce({ data: { file_url: 'url' } });

        const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });
        await uploadDocument(1, 'report', file);

        const [, options] = apiClient.apiRequest.mock.calls[0];
        expect(options.body).toBeInstanceOf(FormData);
    });

    test('appends file and document_type to FormData', async () => {
        apiClient.apiRequest.mockResolvedValueOnce({ data: { file_url: 'url' } });

        const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });
        await uploadDocument(5, 'workload', file);

        const [, options] = apiClient.apiRequest.mock.calls[0];
        const fd = options.body;
        expect(fd.get('file')).toBe(file);
        expect(fd.get('document_type')).toBe('workload');
    });

    test('returns response.data when present', async () => {
        const doc = { id: 7, file_url: 'https://example.com/file.pdf' };
        apiClient.apiRequest.mockResolvedValueOnce({ data: doc });

        const result = await uploadDocument(1, 'outline', new File(['x'], 'x.pdf'));
        expect(result).toEqual(doc);
    });

    test('returns the raw response when data property is absent', async () => {
        const raw = { file_url: 'https://example.com/file.pdf' };
        apiClient.apiRequest.mockResolvedValueOnce(raw);

        const result = await uploadDocument(1, 'outline', new File(['x'], 'x.pdf'));
        expect(result).toEqual(raw);
    });

    test('propagates errors thrown by apiRequest', async () => {
        apiClient.apiRequest.mockRejectedValueOnce(new Error('Network failure'));

        await expect(uploadDocument(1, 'outline', new File(['x'], 'x.pdf'))).rejects.toThrow('Network failure');
    });

    test('constructs the correct endpoint for a different termSubjectId', async () => {
        apiClient.apiRequest.mockResolvedValueOnce({ data: {} });

        await uploadDocument(99, 'report', new File(['x'], 'x.pdf'));

        expect(apiClient.apiRequest).toHaveBeenCalledWith(
            '/term-subjects/99/upload',
            expect.any(Object)
        );
    });

    test('calls apiRequest exactly once per invocation', async () => {
        apiClient.apiRequest.mockResolvedValueOnce({ data: {} });

        await uploadDocument(1, 'outline', new File(['x'], 'x.pdf'));

        expect(apiClient.apiRequest).toHaveBeenCalledTimes(1);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getDocuments
// ────────────────────────────────────────────────────────────────────────────
describe('getDocuments', () => {
    test('calls GET /term-subjects/:id/documents', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });

        await getDocuments(10);

        expect(apiClient.get).toHaveBeenCalledWith('/term-subjects/10/documents');
    });

    test('returns response.data array when present', async () => {
        const docs = [{ id: 1 }, { id: 2 }];
        apiClient.get.mockResolvedValueOnce({ data: docs });

        const result = await getDocuments(10);
        expect(result).toEqual(docs);
    });

    test('returns the raw response when data property is absent', async () => {
        const raw = [{ id: 3 }];
        apiClient.get.mockResolvedValueOnce(raw);

        const result = await getDocuments(10);
        expect(result).toEqual(raw);
    });

    test('returns undefined when response is an empty object without data', async () => {
        apiClient.get.mockResolvedValueOnce({});

        const result = await getDocuments(10);
        // response?.data is undefined, and undefined || undefined is undefined
        expect(result).toBeUndefined();
    });

    test('propagates errors thrown by apiClient.get', async () => {
        apiClient.get.mockRejectedValueOnce(new Error('Server error'));

        await expect(getDocuments(10)).rejects.toThrow('Server error');
    });

    test('uses the correct termSubjectId in the endpoint', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });

        await getDocuments(77);

        expect(apiClient.get).toHaveBeenCalledWith('/term-subjects/77/documents');
    });

    test('calls apiClient.get exactly once', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });

        await getDocuments(1);

        expect(apiClient.get).toHaveBeenCalledTimes(1);
    });
});
