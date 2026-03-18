import * as apiClient from './apiClient';

const BASE_URL = '/permissions';

export async function getInstructors() {
    const response = await apiClient.get(`${BASE_URL}/instructors`);
    return response.data || [];
}

export async function getUsersGroupedByRole() {
    const response = await apiClient.get(`${BASE_URL}/users`);
    return response.data || {
        academic_officer: [],
        professor: [],
        program_chair: [],
    };
}

export async function bulkAddUsers(instructors, role) {
    const response = await apiClient.post(`${BASE_URL}/users/bulk`, {
        instructors,
        role,
    });
    return response.data;
}

export async function removeUserRole(userId, roleId) {
    const response = await apiClient.del(`${BASE_URL}/users/${userId}/roles/${roleId}`);
    return response;
}
