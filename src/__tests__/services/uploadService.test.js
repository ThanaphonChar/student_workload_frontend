import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../services/apiClient.js', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        del: vi.fn(),
    },
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    del: vi.fn(),
    apiRequest: vi.fn(),
}));

vi.mock('../../utils/storage.js', () => ({
    getAuth: vi.fn(),
}));

import * as apiClient from '../../services/apiClient.js';
import { getAuth } from '../../utils/storage.js';
import {
    uploadDocument,
    getDocuments,
    getLatestDocuments,
    fetchDocumentFile,
    viewDocumentFile,
    downloadDocumentFile,
} from '../../services/uploadService.js';

// ─── fetch mock helpers ───────────────────────────────────────────────────────

const makeFetchResponse = ({
    ok = true,
    status = 200,
    blob = new Blob(['pdf-bytes'], { type: 'application/pdf' }),
    contentDisposition = '',
    json = null,
} = {}) => {
    const headers = new Map();
    if (contentDisposition) headers.set('content-disposition', contentDisposition);

    return {
        ok,
        status,
        headers: {
            get: (key) => headers.get(key.toLowerCase()) ?? null,
        },
        blob: vi.fn().mockResolvedValue(blob),
        json: vi.fn().mockResolvedValue(json),
    };
};

let fetchSpy;

beforeEach(() => {
    vi.clearAllMocks();
    // Default: authenticated user
    getAuth.mockReturnValue({ token: 'test-token' });
    fetchSpy = vi.spyOn(globalThis, 'fetch');
});

afterEach(() => {
    fetchSpy.mockRestore();
});

// ────────────────────────────────────────────────────────────────────────────
// uploadDocument
// ────────────────────────────────────────────────────────────────────────────
describe('uploadDocument', () => {
    test('calls apiRequest with correct endpoint and POST method', async () => {
        apiClient.apiRequest.mockResolvedValueOnce({ data: { id: 1 } });

        await uploadDocument(10, 'outline', new File(['x'], 'x.pdf', { type: 'application/pdf' }));

        expect(apiClient.apiRequest).toHaveBeenCalledWith(
            '/term-subjects/10/upload',
            expect.objectContaining({ method: 'POST' })
        );
    });

    test('sends a FormData body', async () => {
        apiClient.apiRequest.mockResolvedValueOnce({ data: {} });

        const file = new File(['content'], 'file.pdf', { type: 'application/pdf' });
        await uploadDocument(1, 'report', file);

        const [, options] = apiClient.apiRequest.mock.calls[0];
        expect(options.body).toBeInstanceOf(FormData);
    });

    test('appends file and document_type to the FormData', async () => {
        apiClient.apiRequest.mockResolvedValueOnce({ data: {} });

        const file = new File(['content'], 'file.pdf', { type: 'application/pdf' });
        await uploadDocument(5, 'outline', file);

        const [, options] = apiClient.apiRequest.mock.calls[0];
        expect(options.body.get('file')).toBe(file);
        expect(options.body.get('document_type')).toBe('outline');
    });

    test('returns response.data', async () => {
        const doc = { id: 3, file_url: 'https://example.com/f.pdf' };
        apiClient.apiRequest.mockResolvedValueOnce({ data: doc });

        const result = await uploadDocument(1, 'outline', new File(['x'], 'x.pdf'));
        expect(result).toEqual(doc);
    });

    test('propagates errors from apiRequest', async () => {
        apiClient.apiRequest.mockRejectedValueOnce(new Error('Upload failed'));

        await expect(
            uploadDocument(1, 'outline', new File(['x'], 'x.pdf'))
        ).rejects.toThrow('Upload failed');
    });

    test('calls apiRequest exactly once', async () => {
        apiClient.apiRequest.mockResolvedValueOnce({ data: {} });

        await uploadDocument(1, 'outline', new File(['x'], 'x.pdf'));

        expect(apiClient.apiRequest).toHaveBeenCalledTimes(1);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getDocuments
// ────────────────────────────────────────────────────────────────────────────
describe('getDocuments', () => {
    test('calls apiRequest with correct endpoint', async () => {
        apiClient.apiRequest.mockResolvedValueOnce({ data: [] });

        await getDocuments(7);

        expect(apiClient.apiRequest).toHaveBeenCalledWith('/term-subjects/7/documents');
    });

    test('returns response.data', async () => {
        const docs = [{ id: 1 }, { id: 2 }];
        apiClient.apiRequest.mockResolvedValueOnce({ data: docs });

        const result = await getDocuments(7);
        expect(result).toEqual(docs);
    });

    test('propagates errors from apiRequest', async () => {
        apiClient.apiRequest.mockRejectedValueOnce(new Error('Not found'));

        await expect(getDocuments(7)).rejects.toThrow('Not found');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getLatestDocuments
// ────────────────────────────────────────────────────────────────────────────
describe('getLatestDocuments', () => {
    test('calls apiRequest with correct endpoint', async () => {
        apiClient.apiRequest.mockResolvedValueOnce({ data: { outline: null, report: null } });

        await getLatestDocuments(3);

        expect(apiClient.apiRequest).toHaveBeenCalledWith('/term-subjects/3/documents/latest');
    });

    test('returns response.data', async () => {
        const latest = { outline: { id: 1 }, report: null };
        apiClient.apiRequest.mockResolvedValueOnce({ data: latest });

        const result = await getLatestDocuments(3);
        expect(result).toEqual(latest);
    });

    test('propagates errors from apiRequest', async () => {
        apiClient.apiRequest.mockRejectedValueOnce(new Error('Server error'));

        await expect(getLatestDocuments(3)).rejects.toThrow('Server error');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// fetchDocumentFile
// ────────────────────────────────────────────────────────────────────────────
describe('fetchDocumentFile', () => {
    test('fetches with Authorization header when token is present', async () => {
        const blob = new Blob(['pdf'], { type: 'application/pdf' });
        fetchSpy.mockResolvedValueOnce(makeFetchResponse({ blob }));

        await fetchDocumentFile(1, 10);

        expect(fetchSpy).toHaveBeenCalledWith(
            expect.stringContaining('/term-subjects/1/documents/10/file'),
            expect.objectContaining({
                headers: { Authorization: 'Bearer test-token' },
            })
        );
    });

    test('fetches without Authorization header when no token', async () => {
        getAuth.mockReturnValue(null);
        const blob = new Blob(['pdf'], { type: 'application/pdf' });
        fetchSpy.mockResolvedValueOnce(makeFetchResponse({ blob }));

        await fetchDocumentFile(1, 10);

        expect(fetchSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({ headers: {} })
        );
    });

    test('appends ?download=1 when download is true', async () => {
        fetchSpy.mockResolvedValueOnce(makeFetchResponse());

        await fetchDocumentFile(1, 10, true);

        const [url] = fetchSpy.mock.calls[0];
        expect(url).toContain('?download=1');
    });

    test('does not append query string when download is false', async () => {
        fetchSpy.mockResolvedValueOnce(makeFetchResponse());

        await fetchDocumentFile(1, 10, false);

        const [url] = fetchSpy.mock.calls[0];
        expect(url).not.toContain('?download=1');
    });

    test('returns blob and fileName parsed from content-disposition (UTF-8)', async () => {
        const blob = new Blob(['pdf'], { type: 'application/pdf' });
        fetchSpy.mockResolvedValueOnce(
            makeFetchResponse({
                blob,
                contentDisposition: "attachment; filename*=UTF-8''my%20file.pdf",
            })
        );

        const result = await fetchDocumentFile(1, 10);
        expect(result.blob).toBe(blob);
        expect(result.fileName).toBe('my file.pdf');
    });

    test('returns blob and fileName parsed from plain content-disposition', async () => {
        const blob = new Blob(['pdf'], { type: 'application/pdf' });
        fetchSpy.mockResolvedValueOnce(
            makeFetchResponse({
                blob,
                contentDisposition: 'attachment; filename="report.pdf"',
            })
        );

        const result = await fetchDocumentFile(1, 10);
        expect(result.fileName).toBe('report.pdf');
    });

    test('falls back to document-:id filename when content-disposition is absent', async () => {
        fetchSpy.mockResolvedValueOnce(makeFetchResponse({ contentDisposition: '' }));

        const result = await fetchDocumentFile(1, 42);
        expect(result.fileName).toBe('document-42');
    });

    test('throws when response is not ok', async () => {
        fetchSpy.mockResolvedValueOnce(
            makeFetchResponse({ ok: false, status: 404, json: { message: 'Document not found' } })
        );

        await expect(fetchDocumentFile(1, 10)).rejects.toThrow('Document not found');
    });

    test('throws with HTTP status message when JSON parse fails', async () => {
        const errResponse = makeFetchResponse({ ok: false, status: 500 });
        errResponse.json = vi.fn().mockRejectedValue(new SyntaxError('Unexpected token'));
        fetchSpy.mockResolvedValueOnce(errResponse);

        await expect(fetchDocumentFile(1, 10)).rejects.toThrow('HTTP 500');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// viewDocumentFile
// ────────────────────────────────────────────────────────────────────────────
describe('viewDocumentFile', () => {
    test('calls window.open with a blob URL', async () => {
        const blob = new Blob(['pdf'], { type: 'application/pdf' });
        fetchSpy.mockResolvedValueOnce(makeFetchResponse({ blob }));

        const createObjectURL = vi.fn().mockReturnValue('blob:fake-url');
        const revokeObjectURL = vi.fn();
        const openSpy = vi.fn();

        vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
        vi.stubGlobal('open', openSpy);

        await viewDocumentFile(1, 10);

        expect(createObjectURL).toHaveBeenCalledWith(blob);
        expect(openSpy).toHaveBeenCalledWith('blob:fake-url', '_blank', 'noopener,noreferrer');
    });

    test('fetches without download flag (view mode)', async () => {
        fetchSpy.mockResolvedValueOnce(makeFetchResponse());
        vi.stubGlobal('URL', { createObjectURL: vi.fn().mockReturnValue('blob:x'), revokeObjectURL: vi.fn() });
        vi.stubGlobal('open', vi.fn());

        await viewDocumentFile(2, 5);

        const [url] = fetchSpy.mock.calls[0];
        expect(url).not.toContain('?download=1');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// downloadDocumentFile
// ────────────────────────────────────────────────────────────────────────────
describe('downloadDocumentFile', () => {
    test('creates and clicks an anchor element with correct href and download attribute', async () => {
        const blob = new Blob(['pdf'], { type: 'application/pdf' });
        fetchSpy.mockResolvedValueOnce(
            makeFetchResponse({
                blob,
                contentDisposition: 'attachment; filename="my-report.pdf"',
            })
        );

        const blobUrl = 'blob:fake-download-url';
        const createObjectURL = vi.fn().mockReturnValue(blobUrl);
        const revokeObjectURL = vi.fn();
        vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });

        const clickSpy = vi.fn();
        const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
        const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
        const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue({
            href: '',
            download: '',
            click: clickSpy,
        });

        await downloadDocumentFile(1, 10);

        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(clickSpy).toHaveBeenCalled();
        expect(revokeObjectURL).toHaveBeenCalledWith(blobUrl);

        createElementSpy.mockRestore();
        appendChildSpy.mockRestore();
        removeChildSpy.mockRestore();
    });

    test('fetches with download=1 flag', async () => {
        fetchSpy.mockResolvedValueOnce(makeFetchResponse());
        vi.stubGlobal('URL', { createObjectURL: vi.fn().mockReturnValue('blob:x'), revokeObjectURL: vi.fn() });
        vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
        vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
        vi.spyOn(document, 'createElement').mockReturnValue({ href: '', download: '', click: vi.fn() });

        await downloadDocumentFile(1, 10);

        const [url] = fetchSpy.mock.calls[0];
        expect(url).toContain('?download=1');
    });
});
