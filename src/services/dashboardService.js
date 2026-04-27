import apiClient from './apiClient';

export const getSummaryStatistics = async (termId = null) => {
    const query = termId ? `?termId=${termId}` : '';
    const data = await apiClient.get(`/dashboard/summary${query}`);
    return data.data;  // Backend: { success: true, data: {...} }
};

export const getAverageWorkload = async (termId = null) => {
    const query = termId ? `?termId=${termId}` : '';
    const data = await apiClient.get(`/dashboard/average-workload${query}`);
    return data.data;
};

export const getWorkloadChart = async (termId = null, years = null) => {
    const params = new URLSearchParams();
    if (termId) params.append('termId', termId);
    if (years?.length) params.append('years', years.join(','));
    const query = params.toString() ? `?${params.toString()}` : '';
    const data = await apiClient.get(`/dashboard/workload-chart${query}`);
    return data.data;
};

export const getActiveTerm = async () => {
    const data = await apiClient.get('/dashboard/active-term');
    return data.data;
};

/**
 * ดึง term subjects พร้อม workload summary สำหรับ student dashboard
 * Server-side computed — no N+1
 * @param {number} termId
 * @returns {Promise<Array>} array of term subject with workload data
 */
export const getStudentTermSubjects = async (termId) => {
    const data = await apiClient.get(`/dashboard/student-subjects?termId=${termId}`);
    return Array.isArray(data?.data) ? data.data : [];
};

export default {
    getSummaryStatistics,
    getAverageWorkload,
    getWorkloadChart,
    getActiveTerm,
    getStudentTermSubjects,
};
