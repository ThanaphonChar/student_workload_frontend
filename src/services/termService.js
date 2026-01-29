/**
 * Term Service
 * API client for academic term operations
 */

import * as apiClient from './apiClient';

/**
 * Get all terms with optional filters
 * @param {Object} filters - Optional filters (academic_year, academic_sector, status)
 * @returns {Promise<Array>} List of terms
 */
export async function getAllTerms(filters = {}) {
    const params = new URLSearchParams();

    if (filters.academic_year) {
        params.append('academic_year', filters.academic_year);
    }
    if (filters.academic_sector) {
        params.append('academic_sector', filters.academic_sector);
    }
    if (filters.status) {
        params.append('status', filters.status);
    }

    const queryString = params.toString();
    const url = queryString ? `/terms?${queryString}` : '/terms';

    const response = await apiClient.get(url);
    return response.data;
}

/**
 * Get active (ongoing) terms
 * @returns {Promise<Array>} List of active terms
 */
export async function getActiveTerms() {
    const response = await apiClient.get('/terms/active');
    return response.data;
}

/**
 * Get ended terms
 * @returns {Promise<Array>} List of ended terms
 */
export async function getEndedTerms() {
    const response = await apiClient.get('/terms/ended');
    return response.data;
}

/**
 * Get term by ID
 * @param {number} termId - Term ID
 * @returns {Promise<Object>} Term details
 */
export async function getTermById(termId) {
    const response = await apiClient.get(`/terms/${termId}`);
    return response.data;
}

/**
 * Create new term
 * @param {Object} termData - Term data
 * @returns {Promise<Object>} Created term
 */
export async function createTerm(termData) {
    const response = await apiClient.post('/terms', termData);
    return response.data;
}

/**
 * Update term
 * @param {number} termId - Term ID
 * @param {Object} termData - Updated term data
 * @returns {Promise<Object>} Updated term
 */
export async function updateTerm(termId, termData) {
    const response = await apiClient.put(`/terms/${termId}`, termData);
    return response.data;
}

/**
 * Delete term
 * @param {number} termId - Term ID
 * @returns {Promise<void>}
 */
export async function deleteTerm(termId) {
    const response = await apiClient.delete(`/terms/${termId}`);
    return response.data;
}

/**
 * ==========================================
 * Term Subject Operations
 * ==========================================
 */

/**
 * Get all subjects in a term (NEW - using /terms/:id/subjects endpoint)
 * @param {number} termId - Term ID
 * @returns {Promise<Array>} List of term subjects
 */
export async function getSubjectsInTerm(termId) {
    const response = await apiClient.get(`/terms/${termId}/subjects`);
    return response.data;
}

/**
 * Update subjects in a term (replace all)
 * @param {number} termId - Term ID
 * @param {Array<number>} subjectIds - Array of subject IDs
 * @returns {Promise<Array>} Updated list of subjects
 */
export async function updateTermSubjects(termId, subjectIds) {
    const response = await apiClient.put(`/terms/${termId}/subjects`, { subject_ids: subjectIds });
    return response.data;
}

/**
 * Get all subjects in a term
 * @param {number} termId - Term ID
 * @returns {Promise<Array>} List of term subjects
 */
export async function getTermSubjects(termId) {
    const response = await apiClient.get(`/term-subjects/term/${termId}`);
    return response.data;
}

/**
 * Add subject to term
 * @param {Object} termSubjectData - Term subject data
 * @returns {Promise<Object>} Created term subject
 */
export async function addSubjectToTerm(termSubjectData) {
    const response = await apiClient.post('/term-subjects', termSubjectData);
    return response.data;
}

/**
 * Update term subject
 * @param {number} termSubjectId - Term subject ID
 * @param {Object} data - Updated data
 * @returns {Promise<Object>} Updated term subject
 */
export async function updateTermSubject(termSubjectId, data) {
    const response = await apiClient.put(`/term-subjects/${termSubjectId}`, data);
    return response.data;
}

/**
 * Remove subject from term
 * @param {number} termSubjectId - Term subject ID
 * @returns {Promise<void>}
 */
export async function removeSubjectFromTerm(termSubjectId) {
    const response = await apiClient.delete(`/term-subjects/${termSubjectId}`);
    return response.data;
}

/**
 * ==========================================
 * Lecturer Assignment Operations
 * ==========================================
 */

/**
 * Get lecturers for term subject
 * @param {number} termSubjectId - Term subject ID
 * @returns {Promise<Array>} List of assigned lecturers
 */
export async function getTermSubjectLecturers(termSubjectId) {
    const response = await apiClient.get(`/term-subjects/${termSubjectId}/lecturers`);
    return response.data;
}

/**
 * Assign lecturer to term subject
 * @param {number} termSubjectId - Term subject ID
 * @param {Object} assignmentData - Assignment data (user_id, is_responsible, notes)
 * @returns {Promise<Object>} Created assignment
 */
export async function assignLecturer(termSubjectId, assignmentData) {
    const response = await apiClient.post(`/term-subjects/${termSubjectId}/lecturers`, assignmentData);
    return response.data;
}

/**
 * Get responsible lecturer for term subject
 * @param {number} termSubjectId - Term subject ID
 * @returns {Promise<Object|null>} Responsible lecturer or null
 */
export async function getResponsibleLecturer(termSubjectId) {
    try {
        const response = await apiClient.get(`/term-subjects/${termSubjectId}/lecturers/responsible`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
}

/**
 * Change responsible lecturer
 * @param {number} termSubjectId - Term subject ID
 * @param {number} userId - New responsible lecturer user ID
 * @returns {Promise<Object>} Updated assignment
 */
export async function changeResponsibleLecturer(termSubjectId, userId) {
    const response = await apiClient.put(`/term-subjects/${termSubjectId}/lecturers/responsible`, { user_id: userId });
    return response.data;
}

/**
 * Update lecturer assignment Notes
 * @param {number} assignmentId - Assignment ID
 * @param {string} notes - Updated notes
 * @returns {Promise<Object>} Updated assignment
 */
export async function updateLecturerNotes(assignmentId, notes) {
    const response = await apiClient.patch(`/term-subjects/lecturers/${assignmentId}`, { notes });
    return response.data;
}

/**
 * Remove lecturer from term subject
 * @param {number} assignmentId - Assignment ID
 * @returns {Promise<void>}
 */
export async function removeLecturer(assignmentId) {
    const response = await apiClient.delete(`/term-subjects/lecturers/${assignmentId}`);
    return response.data;
}
