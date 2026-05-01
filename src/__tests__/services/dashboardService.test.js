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
    getSummaryStatistics,
    getAverageWorkload,
    getWorkloadChart,
    getActiveTerm,
    getStudentTermSubjects,
} from '../../services/dashboardService.js';

// dashboardService uses the default import of apiClient, so we access its methods
// via apiClient.default (which is the default export mock object)
beforeEach(() => {
    vi.clearAllMocks();
});

// ────────────────────────────────────────────────────────────────────────────
// getSummaryStatistics
// ────────────────────────────────────────────────────────────────────────────
describe('getSummaryStatistics', () => {
    test('calls GET /dashboard/summary with no query when termId is null', async () => {
        apiClient.default.get.mockResolvedValueOnce({ data: {} });
        await getSummaryStatistics(null);
        expect(apiClient.default.get).toHaveBeenCalledWith('/dashboard/summary');
    });

    test('calls GET /dashboard/summary without query when termId is omitted', async () => {
        apiClient.default.get.mockResolvedValueOnce({ data: {} });
        await getSummaryStatistics();
        expect(apiClient.default.get).toHaveBeenCalledWith('/dashboard/summary');
    });

    test('appends termId as query param when provided', async () => {
        apiClient.default.get.mockResolvedValueOnce({ data: {} });
        await getSummaryStatistics(5);
        expect(apiClient.default.get).toHaveBeenCalledWith('/dashboard/summary?termId=5');
    });

    test('returns data property from response', async () => {
        const payload = { totalSubjects: 10, totalStudents: 200 };
        apiClient.default.get.mockResolvedValueOnce({ data: payload });
        const result = await getSummaryStatistics(1);
        expect(result).toEqual(payload);
    });

    test('propagates errors from apiClient', async () => {
        apiClient.default.get.mockRejectedValueOnce(new Error('Network error'));
        await expect(getSummaryStatistics(1)).rejects.toThrow('Network error');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getAverageWorkload
// ────────────────────────────────────────────────────────────────────────────
describe('getAverageWorkload', () => {
    test('calls GET /dashboard/average-workload without query when termId is null', async () => {
        apiClient.default.get.mockResolvedValueOnce({ data: {} });
        await getAverageWorkload(null);
        expect(apiClient.default.get).toHaveBeenCalledWith('/dashboard/average-workload');
    });

    test('calls GET /dashboard/average-workload without query when termId is omitted', async () => {
        apiClient.default.get.mockResolvedValueOnce({ data: {} });
        await getAverageWorkload();
        expect(apiClient.default.get).toHaveBeenCalledWith('/dashboard/average-workload');
    });

    test('appends termId as query param when provided', async () => {
        apiClient.default.get.mockResolvedValueOnce({ data: {} });
        await getAverageWorkload(3);
        expect(apiClient.default.get).toHaveBeenCalledWith('/dashboard/average-workload?termId=3');
    });

    test('returns data property from response', async () => {
        const payload = { average: 15.5 };
        apiClient.default.get.mockResolvedValueOnce({ data: payload });
        const result = await getAverageWorkload(2);
        expect(result).toEqual(payload);
    });

    test('propagates errors from apiClient', async () => {
        apiClient.default.get.mockRejectedValueOnce(new Error('Server error'));
        await expect(getAverageWorkload(1)).rejects.toThrow('Server error');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getWorkloadChart
// ────────────────────────────────────────────────────────────────────────────
describe('getWorkloadChart', () => {
    test('calls GET /dashboard/workload-chart with no query when no params', async () => {
        apiClient.default.get.mockResolvedValueOnce({ data: [] });
        await getWorkloadChart(null, null);
        expect(apiClient.default.get).toHaveBeenCalledWith('/dashboard/workload-chart');
    });

    test('calls GET /dashboard/workload-chart with no query when params omitted', async () => {
        apiClient.default.get.mockResolvedValueOnce({ data: [] });
        await getWorkloadChart();
        expect(apiClient.default.get).toHaveBeenCalledWith('/dashboard/workload-chart');
    });

    test('appends termId when provided', async () => {
        apiClient.default.get.mockResolvedValueOnce({ data: [] });
        await getWorkloadChart(7, null);
        expect(apiClient.default.get).toHaveBeenCalledWith('/dashboard/workload-chart?termId=7');
    });

    test('appends years when provided', async () => {
        apiClient.default.get.mockResolvedValueOnce({ data: [] });
        await getWorkloadChart(null, [2023, 2024]);
        expect(apiClient.default.get).toHaveBeenCalledWith('/dashboard/workload-chart?years=2023%2C2024');
    });

    test('appends both termId and years when both provided', async () => {
        apiClient.default.get.mockResolvedValueOnce({ data: [] });
        await getWorkloadChart(7, [2023, 2024]);
        const calledUrl = apiClient.default.get.mock.calls[0][0];
        expect(calledUrl).toContain('termId=7');
        expect(calledUrl).toContain('years=');
        expect(calledUrl).toContain('2023');
        expect(calledUrl).toContain('2024');
    });

    test('does not append years when years is empty array', async () => {
        apiClient.default.get.mockResolvedValueOnce({ data: [] });
        await getWorkloadChart(null, []);
        expect(apiClient.default.get).toHaveBeenCalledWith('/dashboard/workload-chart');
    });

    test('returns data property from response', async () => {
        const payload = [{ month: 'Jan', value: 10 }];
        apiClient.default.get.mockResolvedValueOnce({ data: payload });
        const result = await getWorkloadChart(1, null);
        expect(result).toEqual(payload);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getActiveTerm
// ────────────────────────────────────────────────────────────────────────────
describe('getActiveTerm', () => {
    test('calls GET /dashboard/active-term', async () => {
        apiClient.default.get.mockResolvedValueOnce({ data: { id: 1, status: 'active' } });
        await getActiveTerm();
        expect(apiClient.default.get).toHaveBeenCalledWith('/dashboard/active-term');
    });

    test('returns data property from response', async () => {
        const term = { id: 1, name: 'Term 1', status: 'active' };
        apiClient.default.get.mockResolvedValueOnce({ data: term });
        const result = await getActiveTerm();
        expect(result).toEqual(term);
    });

    test('propagates errors from apiClient', async () => {
        apiClient.default.get.mockRejectedValueOnce(new Error('Not found'));
        await expect(getActiveTerm()).rejects.toThrow('Not found');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getStudentTermSubjects
// ────────────────────────────────────────────────────────────────────────────
describe('getStudentTermSubjects', () => {
    test('calls GET /dashboard/student-subjects with termId query param', async () => {
        apiClient.default.get.mockResolvedValueOnce({ data: [] });
        await getStudentTermSubjects(3);
        expect(apiClient.default.get).toHaveBeenCalledWith('/dashboard/student-subjects?termId=3');
    });

    test('returns array when data is an array', async () => {
        const subjects = [{ id: 1 }, { id: 2 }];
        apiClient.default.get.mockResolvedValueOnce({ data: subjects });
        const result = await getStudentTermSubjects(3);
        expect(result).toEqual(subjects);
    });

    test('returns empty array when data is not an array', async () => {
        apiClient.default.get.mockResolvedValueOnce({ data: null });
        const result = await getStudentTermSubjects(3);
        expect(result).toEqual([]);
    });

    test('returns empty array when response has no data property', async () => {
        apiClient.default.get.mockResolvedValueOnce({});
        const result = await getStudentTermSubjects(3);
        expect(result).toEqual([]);
    });

    test('returns empty array when response is null', async () => {
        apiClient.default.get.mockResolvedValueOnce(null);
        const result = await getStudentTermSubjects(3);
        expect(result).toEqual([]);
    });

    test('propagates errors from apiClient', async () => {
        apiClient.default.get.mockRejectedValueOnce(new Error('Unauthorized'));
        await expect(getStudentTermSubjects(3)).rejects.toThrow('Unauthorized');
    });
});
