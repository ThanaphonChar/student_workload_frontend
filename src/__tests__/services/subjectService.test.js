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
    deleteRequest: vi.fn(),
    apiRequest: vi.fn(),
}));

import * as apiClient from '../../services/apiClient.js';
import {
    getSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject,
    getStudentYears,
    update,
} from '../../services/subjectService.js';

beforeEach(() => {
    vi.clearAllMocks();
});

// ────────────────────────────────────────────────────────────────────────────
// getSubjects
// ────────────────────────────────────────────────────────────────────────────
describe('getSubjects', () => {
    test('calls GET /subjects with no query when no params', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getSubjects();
        expect(apiClient.get).toHaveBeenCalledWith('/subjects');
    });

    test('appends program_id to URL when provided', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getSubjects({ program_id: 2 });
        expect(apiClient.get).toHaveBeenCalledWith('/subjects?program_id=2');
    });

    test('appends student_year_id to URL when provided', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getSubjects({ student_year_id: 3 });
        expect(apiClient.get).toHaveBeenCalledWith('/subjects?student_year_id=3');
    });

    test('appends is_active to URL when provided', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getSubjects({ is_active: true });
        expect(apiClient.get).toHaveBeenCalledWith('/subjects?is_active=true');
    });

    test('appends is_active=false to URL when explicitly false', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getSubjects({ is_active: false });
        expect(apiClient.get).toHaveBeenCalledWith('/subjects?is_active=false');
    });

    test('appends multiple params to URL', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getSubjects({ program_id: 1, student_year_id: 2, is_active: true });
        const calledUrl = apiClient.get.mock.calls[0][0];
        expect(calledUrl).toContain('program_id=1');
        expect(calledUrl).toContain('student_year_id=2');
        expect(calledUrl).toContain('is_active=true');
        expect(calledUrl).toContain('/subjects?');
    });

    test('ignores undefined params', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getSubjects({ program_id: undefined, student_year_id: undefined });
        expect(apiClient.get).toHaveBeenCalledWith('/subjects');
    });

    test('returns the full response (not just .data)', async () => {
        const mockResponse = { data: [{ id: 1, name: 'Math' }], success: true };
        apiClient.get.mockResolvedValueOnce(mockResponse);
        const result = await getSubjects();
        expect(result).toEqual(mockResponse);
    });

    test('propagates errors from apiClient', async () => {
        apiClient.get.mockRejectedValueOnce(new Error('Network error'));
        await expect(getSubjects()).rejects.toThrow('Network error');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getSubjectById
// ────────────────────────────────────────────────────────────────────────────
describe('getSubjectById', () => {
    test('calls GET /subjects/:id with correct id', async () => {
        apiClient.get.mockResolvedValueOnce({ data: { id: 5 } });
        await getSubjectById(5);
        expect(apiClient.get).toHaveBeenCalledWith('/subjects/5');
    });

    test('returns the full response', async () => {
        const mockResponse = { data: { id: 5, name: 'Physics' }, success: true };
        apiClient.get.mockResolvedValueOnce(mockResponse);
        const result = await getSubjectById(5);
        expect(result).toEqual(mockResponse);
    });

    test('propagates errors from apiClient', async () => {
        apiClient.get.mockRejectedValueOnce(new Error('Not found'));
        await expect(getSubjectById(999)).rejects.toThrow('Not found');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// createSubject
// ────────────────────────────────────────────────────────────────────────────
describe('createSubject', () => {
    test('calls POST /subjects with subject data', async () => {
        const subjectData = { name: 'Chemistry', code: 'CHE101' };
        apiClient.post.mockResolvedValueOnce({ data: { id: 1, ...subjectData } });
        await createSubject(subjectData);
        expect(apiClient.post).toHaveBeenCalledWith('/subjects', subjectData);
    });

    test('returns the full response', async () => {
        const subjectData = { name: 'Chemistry' };
        const mockResponse = { data: { id: 1, ...subjectData }, success: true };
        apiClient.post.mockResolvedValueOnce(mockResponse);
        const result = await createSubject(subjectData);
        expect(result).toEqual(mockResponse);
    });

    test('propagates errors from apiClient', async () => {
        apiClient.post.mockRejectedValueOnce(new Error('Duplicate entry'));
        await expect(createSubject({ name: 'Math' })).rejects.toThrow('Duplicate entry');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// updateSubject
// ────────────────────────────────────────────────────────────────────────────
describe('updateSubject', () => {
    test('calls PUT /subjects/:id with id and data', async () => {
        const updateData = { name: 'Advanced Math' };
        apiClient.put.mockResolvedValueOnce({ data: { id: 3, ...updateData } });
        await updateSubject(3, updateData);
        expect(apiClient.put).toHaveBeenCalledWith('/subjects/3', updateData);
    });

    test('returns the full response', async () => {
        const mockResponse = { data: { id: 3, name: 'Advanced Math' }, success: true };
        apiClient.put.mockResolvedValueOnce(mockResponse);
        const result = await updateSubject(3, { name: 'Advanced Math' });
        expect(result).toEqual(mockResponse);
    });

    test('propagates errors from apiClient', async () => {
        apiClient.put.mockRejectedValueOnce(new Error('Forbidden'));
        await expect(updateSubject(3, {})).rejects.toThrow('Forbidden');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// update (alias for updateSubject)
// ────────────────────────────────────────────────────────────────────────────
describe('update (alias)', () => {
    test('update is the same function as updateSubject', () => {
        expect(update).toBe(updateSubject);
    });

    test('calls PUT /subjects/:id when invoked via update alias', async () => {
        const updateData = { name: 'Biology' };
        apiClient.put.mockResolvedValueOnce({ data: { id: 4, ...updateData } });
        await update(4, updateData);
        expect(apiClient.put).toHaveBeenCalledWith('/subjects/4', updateData);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// deleteSubject
// ────────────────────────────────────────────────────────────────────────────
describe('deleteSubject', () => {
    test('calls deleteRequest /subjects/:id with correct id', async () => {
        apiClient.deleteRequest.mockResolvedValueOnce({ data: { deleted: true } });
        await deleteSubject(6);
        expect(apiClient.deleteRequest).toHaveBeenCalledWith('/subjects/6');
    });

    test('returns the full response', async () => {
        const mockResponse = { data: { deleted: true }, success: true };
        apiClient.deleteRequest.mockResolvedValueOnce(mockResponse);
        const result = await deleteSubject(6);
        expect(result).toEqual(mockResponse);
    });

    test('propagates errors from apiClient', async () => {
        apiClient.deleteRequest.mockRejectedValueOnce(new Error('Cannot delete in use subject'));
        await expect(deleteSubject(6)).rejects.toThrow('Cannot delete in use subject');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getStudentYears
// ────────────────────────────────────────────────────────────────────────────
describe('getStudentYears', () => {
    test('calls GET /subjects/:id/student-years with correct id', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [1, 2, 3] });
        await getStudentYears(7);
        expect(apiClient.get).toHaveBeenCalledWith('/subjects/7/student-years');
    });

    test('returns response.data (array of year IDs)', async () => {
        const yearIds = [1, 2, 3];
        apiClient.get.mockResolvedValueOnce({ data: yearIds });
        const result = await getStudentYears(7);
        expect(result).toEqual(yearIds);
    });

    test('returns empty array when data is empty', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        const result = await getStudentYears(7);
        expect(result).toEqual([]);
    });

    test('propagates errors from apiClient', async () => {
        apiClient.get.mockRejectedValueOnce(new Error('Subject not found'));
        await expect(getStudentYears(999)).rejects.toThrow('Subject not found');
    });
});
