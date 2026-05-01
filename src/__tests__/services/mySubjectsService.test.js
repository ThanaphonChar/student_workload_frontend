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
import { getMySubjects } from '../../services/mySubjectsService.js';

beforeEach(() => {
    vi.clearAllMocks();
});

// ────────────────────────────────────────────────────────────────────────────
// getMySubjects
// ────────────────────────────────────────────────────────────────────────────
describe('getMySubjects', () => {
    test('calls GET /my-subjects', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });

        await getMySubjects();

        expect(apiClient.get).toHaveBeenCalledWith('/my-subjects');
    });

    test('calls apiClient.get exactly once', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });

        await getMySubjects();

        expect(apiClient.get).toHaveBeenCalledTimes(1);
    });

    test('returns response.data array on success', async () => {
        const subjects = [
            { term_subject_id: 1, subject_code: 'CS101' },
            { term_subject_id: 2, subject_code: 'CS102' },
        ];
        apiClient.get.mockResolvedValueOnce({ data: subjects });

        const result = await getMySubjects();
        expect(result).toEqual(subjects);
    });

    test('returns an empty array when response.data is an empty array', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });

        const result = await getMySubjects();
        expect(result).toEqual([]);
    });

    test('returns undefined when response has no data property', async () => {
        apiClient.get.mockResolvedValueOnce({});

        const result = await getMySubjects();
        expect(result).toBeUndefined();
    });

    test('propagates errors thrown by apiClient.get', async () => {
        apiClient.get.mockRejectedValueOnce(new Error('Unauthorized'));

        await expect(getMySubjects()).rejects.toThrow('Unauthorized');
    });

    test('propagates HTTP 403 errors', async () => {
        const err = new Error('Forbidden');
        err.status = 403;
        apiClient.get.mockRejectedValueOnce(err);

        await expect(getMySubjects()).rejects.toThrow('Forbidden');
    });

    test('does not call any other apiClient method', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });

        await getMySubjects();

        expect(apiClient.post).not.toHaveBeenCalled();
        expect(apiClient.put).not.toHaveBeenCalled();
        expect(apiClient.patch).not.toHaveBeenCalled();
        expect(apiClient.delete).not.toHaveBeenCalled();
    });
});
