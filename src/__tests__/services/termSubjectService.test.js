import { describe, test, expect, vi, beforeEach } from 'vitest';

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

import * as apiClient from '../../services/apiClient.js';
import {
    addSubjectToTerm,
    getTermSubjects,
    getTermSubjectById,
    updateTermSubject,
    removeSubjectFromTerm,
    addMultipleSubjects,
} from '../../services/termSubjectService.js';

beforeEach(() => {
    vi.clearAllMocks();
});

// ────────────────────────────────────────────────────────────────────────────
// addSubjectToTerm
// ────────────────────────────────────────────────────────────────────────────
describe('addSubjectToTerm', () => {
    test('calls POST /term-subjects with provided data', async () => {
        const data = { term_id: 1, subject_id: 10 };
        apiClient.post.mockResolvedValueOnce({ data });

        await addSubjectToTerm(data);

        expect(apiClient.post).toHaveBeenCalledWith('/term-subjects', data);
    });

    test('returns the raw response from apiClient.post', async () => {
        const mockResponse = { data: { id: 1, term_id: 1, subject_id: 10 } };
        apiClient.post.mockResolvedValueOnce(mockResponse);

        const result = await addSubjectToTerm({ term_id: 1, subject_id: 10 });
        expect(result).toEqual(mockResponse);
    });

    test('propagates errors from apiClient.post', async () => {
        apiClient.post.mockRejectedValueOnce(new Error('Conflict'));

        await expect(addSubjectToTerm({ term_id: 1, subject_id: 10 })).rejects.toThrow('Conflict');
    });

    test('calls apiClient.post exactly once', async () => {
        apiClient.post.mockResolvedValueOnce({});

        await addSubjectToTerm({ term_id: 1, subject_id: 5 });

        expect(apiClient.post).toHaveBeenCalledTimes(1);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getTermSubjects
// ────────────────────────────────────────────────────────────────────────────
describe('getTermSubjects', () => {
    test('calls GET /term-subjects/term/:termId', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });

        await getTermSubjects(3);

        expect(apiClient.get).toHaveBeenCalledWith('/term-subjects/term/3');
    });

    test('returns the raw response from apiClient.get', async () => {
        const mockResponse = { data: [{ id: 1 }, { id: 2 }] };
        apiClient.get.mockResolvedValueOnce(mockResponse);

        const result = await getTermSubjects(3);
        expect(result).toEqual(mockResponse);
    });

    test('propagates errors from apiClient.get', async () => {
        apiClient.get.mockRejectedValueOnce(new Error('Not Found'));

        await expect(getTermSubjects(999)).rejects.toThrow('Not Found');
    });

    test('uses correct termId in endpoint', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });

        await getTermSubjects(42);

        expect(apiClient.get).toHaveBeenCalledWith('/term-subjects/term/42');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getTermSubjectById
// ────────────────────────────────────────────────────────────────────────────
describe('getTermSubjectById', () => {
    test('calls GET /term-subjects/:id', async () => {
        apiClient.get.mockResolvedValueOnce({ data: { id: 7 } });

        await getTermSubjectById(7);

        expect(apiClient.get).toHaveBeenCalledWith('/term-subjects/7');
    });

    test('returns the raw response from apiClient.get', async () => {
        const mockResponse = { data: { id: 7, term_id: 1, subject_id: 5 } };
        apiClient.get.mockResolvedValueOnce(mockResponse);

        const result = await getTermSubjectById(7);
        expect(result).toEqual(mockResponse);
    });

    test('propagates errors from apiClient.get', async () => {
        apiClient.get.mockRejectedValueOnce(new Error('Not found'));

        await expect(getTermSubjectById(999)).rejects.toThrow('Not found');
    });

    test('uses correct id in endpoint', async () => {
        apiClient.get.mockResolvedValueOnce({});

        await getTermSubjectById(100);

        expect(apiClient.get).toHaveBeenCalledWith('/term-subjects/100');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// updateTermSubject
// ────────────────────────────────────────────────────────────────────────────
describe('updateTermSubject', () => {
    test('calls PUT /term-subjects/:id with provided data', async () => {
        const updateData = { subject_id: 20 };
        apiClient.put.mockResolvedValueOnce({ data: { id: 5, subject_id: 20 } });

        await updateTermSubject(5, updateData);

        expect(apiClient.put).toHaveBeenCalledWith('/term-subjects/5', updateData);
    });

    test('returns the raw response from apiClient.put', async () => {
        const mockResponse = { data: { id: 5, subject_id: 20 } };
        apiClient.put.mockResolvedValueOnce(mockResponse);

        const result = await updateTermSubject(5, { subject_id: 20 });
        expect(result).toEqual(mockResponse);
    });

    test('propagates errors from apiClient.put', async () => {
        apiClient.put.mockRejectedValueOnce(new Error('Validation error'));

        await expect(updateTermSubject(5, { subject_id: -1 })).rejects.toThrow('Validation error');
    });

    test('calls apiClient.put exactly once', async () => {
        apiClient.put.mockResolvedValueOnce({});

        await updateTermSubject(1, { subject_id: 5 });

        expect(apiClient.put).toHaveBeenCalledTimes(1);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// removeSubjectFromTerm
// ────────────────────────────────────────────────────────────────────────────
describe('removeSubjectFromTerm', () => {
    test('calls del /term-subjects/:id', async () => {
        apiClient.del.mockResolvedValueOnce({ success: true });

        await removeSubjectFromTerm(8);

        expect(apiClient.del).toHaveBeenCalledWith('/term-subjects/8');
    });

    test('returns the raw response from apiClient.del', async () => {
        const mockResponse = { success: true, message: 'Deleted' };
        apiClient.del.mockResolvedValueOnce(mockResponse);

        const result = await removeSubjectFromTerm(8);
        expect(result).toEqual(mockResponse);
    });

    test('propagates errors from apiClient.del', async () => {
        apiClient.del.mockRejectedValueOnce(new Error('Forbidden'));

        await expect(removeSubjectFromTerm(8)).rejects.toThrow('Forbidden');
    });

    test('calls apiClient.del exactly once', async () => {
        apiClient.del.mockResolvedValueOnce({});

        await removeSubjectFromTerm(3);

        expect(apiClient.del).toHaveBeenCalledTimes(1);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// addMultipleSubjects
// ────────────────────────────────────────────────────────────────────────────
describe('addMultipleSubjects', () => {
    test('calls addSubjectToTerm once per subject ID', async () => {
        apiClient.post.mockResolvedValue({});

        await addMultipleSubjects(1, [10, 20, 30]);

        expect(apiClient.post).toHaveBeenCalledTimes(3);
    });

    test('calls POST /term-subjects for each subject with correct payload', async () => {
        apiClient.post.mockResolvedValue({});

        await addMultipleSubjects(2, [5, 6]);

        expect(apiClient.post).toHaveBeenCalledWith('/term-subjects', { term_id: 2, subject_id: 5 });
        expect(apiClient.post).toHaveBeenCalledWith('/term-subjects', { term_id: 2, subject_id: 6 });
    });

    test('returns array of results from all calls', async () => {
        const resp1 = { data: { id: 1 } };
        const resp2 = { data: { id: 2 } };
        apiClient.post.mockResolvedValueOnce(resp1).mockResolvedValueOnce(resp2);

        const result = await addMultipleSubjects(1, [10, 20]);
        expect(result).toEqual([resp1, resp2]);
    });

    test('returns an empty array when given an empty subjectIds list', async () => {
        const result = await addMultipleSubjects(1, []);
        expect(result).toEqual([]);
        expect(apiClient.post).not.toHaveBeenCalled();
    });

    test('rejects if any single call fails', async () => {
        apiClient.post
            .mockResolvedValueOnce({ data: { id: 1 } })
            .mockRejectedValueOnce(new Error('Duplicate'));

        await expect(addMultipleSubjects(1, [10, 20])).rejects.toThrow('Duplicate');
    });

    test('handles a single subject ID correctly', async () => {
        apiClient.post.mockResolvedValueOnce({ data: { id: 99 } });

        const result = await addMultipleSubjects(3, [99]);

        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith('/term-subjects', { term_id: 3, subject_id: 99 });
        expect(result).toHaveLength(1);
    });
});
