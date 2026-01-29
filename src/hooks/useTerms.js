/**
 * useTerms Hook
 * จัดการ state และ business logic สำหรับภาคการศึกษา
 * 
 * Responsibilities:
 * - State management
 * - API calls
 * - Error handling
 * - Loading states
 */

import { useState, useEffect, useCallback } from 'react';
import * as termService from '../services/termService';
import { handleError } from '../utils/handleError';

export function useTerms() {
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        academic_year: '',
        academic_sector: '',
        status: '',
    });

    /**
     * Fetch terms with current filters
     */
    const fetchTerms = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await termService.getAllTerms(filters);
            setTerms(data);
        } catch (err) {
            const errorMessage = handleError(err);
            setError(errorMessage);
            console.error('Failed to fetch terms:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    /**
     * Refetch terms (for retry after error)
     */
    const refetch = useCallback(() => {
        fetchTerms();
    }, [fetchTerms]);

    /**
     * Load terms when filters change
     */
    useEffect(() => {
        fetchTerms();
    }, [fetchTerms]);

    return {
        terms,
        loading,
        error,
        filters,
        setFilters,
        refetch,
    };
}

/**
 * useTermSubjects Hook
 * จัดการรายวิชาในภาคการศึกษา
 */
export function useTermSubjects(termId) {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Fetch subjects in term
     */
    const fetchSubjects = useCallback(async () => {
        if (!termId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await termService.getTermSubjects(termId);
            setSubjects(data);
        } catch (err) {
            const errorMessage = handleError(err);
            setError(errorMessage);
            console.error('Failed to fetch term subjects:', err);
        } finally {
            setLoading(false);
        }
    }, [termId]);

    /**
     * Add subject to term
     */
    const addSubject = useCallback(
        async (subjectData) => {
            setLoading(true);
            setError(null);

            try {
                await termService.addSubjectToTerm(subjectData);
                await fetchSubjects(); // Reload
                return { success: true };
            } catch (err) {
                const errorMessage = handleError(err);
                setError(errorMessage);
                return { success: false, error: errorMessage };
            } finally {
                setLoading(false);
            }
        },
        [fetchSubjects]
    );

    /**
     * Remove subject from term
     */
    const removeSubject = useCallback(
        async (termSubjectId) => {
            setLoading(true);
            setError(null);

            try {
                await termService.removeSubjectFromTerm(termSubjectId);
                await fetchSubjects(); // Reload
                return { success: true };
            } catch (err) {
                const errorMessage = handleError(err);
                setError(errorMessage);
                return { success: false, error: errorMessage };
            } finally {
                setLoading(false);
            }
        },
        [fetchSubjects]
    );

    /**
     * Assign lecturer to subject
     */
    const assignLecturer = useCallback(
        async (termSubjectId, lecturerData) => {
            setLoading(true);
            setError(null);

            try {
                await termService.assignLecturer(termSubjectId, lecturerData);
                await fetchSubjects(); // Reload
                return { success: true };
            } catch (err) {
                const errorMessage = handleError(err);
                setError(errorMessage);
                return { success: false, error: errorMessage };
            } finally {
                setLoading(false);
            }
        },
        [fetchSubjects]
    );

    /**
     * Change responsible lecturer
     */
    const changeResponsibleLecturer = useCallback(
        async (termSubjectId, newResponsibleUserId) => {
            setLoading(true);
            setError(null);

            try {
                await termService.changeResponsibleLecturer(termSubjectId, {
                    new_responsible_user_id: newResponsibleUserId,
                });
                await fetchSubjects(); // Reload
                return { success: true };
            } catch (err) {
                const errorMessage = handleError(err);
                setError(errorMessage);
                return { success: false, error: errorMessage };
            } finally {
                setLoading(false);
            }
        },
        [fetchSubjects]
    );

    /**
     * Remove lecturer from subject
     */
    const removeLecturer = useCallback(
        async (termSubjectId, userId) => {
            setLoading(true);
            setError(null);

            try {
                await termService.removeLecturer(termSubjectId, userId);
                await fetchSubjects(); // Reload
                return { success: true };
            } catch (err) {
                const errorMessage = handleError(err);
                setError(errorMessage);
                return { success: false, error: errorMessage };
            } finally {
                setLoading(false);
            }
        },
        [fetchSubjects]
    );

    /**
     * Load subjects when termId changes
     */
    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    return {
        subjects,
        loading,
        error,
        addSubject,
        removeSubject,
        assignLecturer,
        changeResponsibleLecturer,
        removeLecturer,
        refetch: fetchSubjects,
    };
}
