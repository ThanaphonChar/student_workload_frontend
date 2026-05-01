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
    getInstructors,
    getUsersGroupedByRole,
    bulkAddUsers,
    removeUserRole,
} from '../../services/permission.service.js';

beforeEach(() => {
    vi.clearAllMocks();
});

// ────────────────────────────────────────────────────────────────────────────
// getInstructors
// ────────────────────────────────────────────────────────────────────────────
describe('getInstructors', () => {
    test('calls GET /permissions/instructors', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });

        await getInstructors();

        expect(apiClient.get).toHaveBeenCalledWith('/permissions/instructors');
    });

    test('returns response.data array when present', async () => {
        const instructors = [{ id: 1, name: 'Prof. A' }, { id: 2, name: 'Prof. B' }];
        apiClient.get.mockResolvedValueOnce({ data: instructors });

        const result = await getInstructors();
        expect(result).toEqual(instructors);
    });

    test('returns empty array as fallback when data is absent', async () => {
        apiClient.get.mockResolvedValueOnce({});

        const result = await getInstructors();
        expect(result).toEqual([]);
    });

    test('returns empty array as fallback when data is null', async () => {
        apiClient.get.mockResolvedValueOnce({ data: null });

        const result = await getInstructors();
        expect(result).toEqual([]);
    });

    test('propagates errors thrown by apiClient.get', async () => {
        apiClient.get.mockRejectedValueOnce(new Error('Server error'));

        await expect(getInstructors()).rejects.toThrow('Server error');
    });

    test('calls apiClient.get exactly once', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });

        await getInstructors();

        expect(apiClient.get).toHaveBeenCalledTimes(1);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getUsersGroupedByRole
// ────────────────────────────────────────────────────────────────────────────
describe('getUsersGroupedByRole', () => {
    test('calls GET /permissions/users', async () => {
        apiClient.get.mockResolvedValueOnce({ data: { academic_officer: [], professor: [], program_chair: [] } });

        await getUsersGroupedByRole();

        expect(apiClient.get).toHaveBeenCalledWith('/permissions/users');
    });

    test('returns grouped object from response.data', async () => {
        const grouped = {
            academic_officer: [{ id: 1 }],
            professor: [{ id: 2 }],
            program_chair: [{ id: 3 }],
        };
        apiClient.get.mockResolvedValueOnce({ data: grouped });

        const result = await getUsersGroupedByRole();
        expect(result).toEqual(grouped);
    });

    test('returns default empty groups when data is absent', async () => {
        apiClient.get.mockResolvedValueOnce({});

        const result = await getUsersGroupedByRole();
        expect(result).toEqual({
            academic_officer: [],
            professor: [],
            program_chair: [],
        });
    });

    test('returns default empty groups when data is null', async () => {
        apiClient.get.mockResolvedValueOnce({ data: null });

        const result = await getUsersGroupedByRole();
        expect(result).toEqual({
            academic_officer: [],
            professor: [],
            program_chair: [],
        });
    });

    test('propagates errors from apiClient.get', async () => {
        apiClient.get.mockRejectedValueOnce(new Error('Forbidden'));

        await expect(getUsersGroupedByRole()).rejects.toThrow('Forbidden');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// bulkAddUsers
// ────────────────────────────────────────────────────────────────────────────
describe('bulkAddUsers', () => {
    test('calls POST /permissions/users/bulk with instructors and role', async () => {
        apiClient.post.mockResolvedValueOnce({ data: { added: 2 } });

        const instructors = [{ employeeId: 'E001' }, { employeeId: 'E002' }];
        await bulkAddUsers(instructors, 'professor');

        expect(apiClient.post).toHaveBeenCalledWith('/permissions/users/bulk', {
            instructors,
            role: 'professor',
        });
    });

    test('returns response.data on success', async () => {
        const result = { added: 3, failed: 0 };
        apiClient.post.mockResolvedValueOnce({ data: result });

        const res = await bulkAddUsers([{ employeeId: 'E001' }], 'academic_officer');
        expect(res).toEqual(result);
    });

    test('returns undefined when response.data is absent', async () => {
        apiClient.post.mockResolvedValueOnce({});

        const res = await bulkAddUsers([], 'professor');
        expect(res).toBeUndefined();
    });

    test('passes empty instructors array correctly', async () => {
        apiClient.post.mockResolvedValueOnce({ data: { added: 0 } });

        await bulkAddUsers([], 'program_chair');

        expect(apiClient.post).toHaveBeenCalledWith('/permissions/users/bulk', {
            instructors: [],
            role: 'program_chair',
        });
    });

    test('propagates errors from apiClient.post', async () => {
        apiClient.post.mockRejectedValueOnce(new Error('Validation failed'));

        await expect(bulkAddUsers([{ employeeId: 'E001' }], 'professor')).rejects.toThrow('Validation failed');
    });

    test('calls apiClient.post exactly once per call', async () => {
        apiClient.post.mockResolvedValueOnce({ data: {} });

        await bulkAddUsers([{ employeeId: 'E001' }], 'professor');

        expect(apiClient.post).toHaveBeenCalledTimes(1);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// removeUserRole
// ────────────────────────────────────────────────────────────────────────────
describe('removeUserRole', () => {
    test('calls del /permissions/users/:userId/roles/:roleId', async () => {
        apiClient.del.mockResolvedValueOnce({ success: true });

        await removeUserRole(5, 3);

        expect(apiClient.del).toHaveBeenCalledWith('/permissions/users/5/roles/3');
    });

    test('returns the full response from del', async () => {
        const mockResponse = { success: true, message: 'Role removed' };
        apiClient.del.mockResolvedValueOnce(mockResponse);

        const result = await removeUserRole(1, 2);
        expect(result).toEqual(mockResponse);
    });

    test('constructs the correct endpoint for different user and role IDs', async () => {
        apiClient.del.mockResolvedValueOnce({});

        await removeUserRole(99, 7);

        expect(apiClient.del).toHaveBeenCalledWith('/permissions/users/99/roles/7');
    });

    test('propagates errors from apiClient.del', async () => {
        apiClient.del.mockRejectedValueOnce(new Error('Not found'));

        await expect(removeUserRole(1, 1)).rejects.toThrow('Not found');
    });

    test('calls apiClient.del exactly once per invocation', async () => {
        apiClient.del.mockResolvedValueOnce({});

        await removeUserRole(1, 1);

        expect(apiClient.del).toHaveBeenCalledTimes(1);
    });

    test('does not call apiClient.post or get', async () => {
        apiClient.del.mockResolvedValueOnce({});

        await removeUserRole(1, 1);

        expect(apiClient.post).not.toHaveBeenCalled();
        expect(apiClient.get).not.toHaveBeenCalled();
    });
});
