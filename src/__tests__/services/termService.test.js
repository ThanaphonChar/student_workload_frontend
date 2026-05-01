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
    getFilterOptions,
    getAllTerms,
    getActiveTerms,
    getEndedTerms,
    getTermById,
    createTerm,
    updateTerm,
    deleteTerm,
    validateSubjectIds,
    getSubjectsInTerm,
    updateTermSubjects,
    getTermSubjects,
    addSubjectToTerm,
    updateTermSubject,
    removeSubjectFromTerm,
    getTermSubjectLecturers,
    assignLecturer,
    getResponsibleLecturer,
    changeResponsibleLecturer,
    updateLecturerNotes,
    removeLecturer,
} from '../../services/termService.js';

beforeEach(() => {
    vi.clearAllMocks();
});

// ────────────────────────────────────────────────────────────────────────────
// getFilterOptions
// ────────────────────────────────────────────────────────────────────────────
describe('getFilterOptions', () => {
    test('calls GET /terms/filter-options', async () => {
        apiClient.get.mockResolvedValueOnce({ data: { academic_years: [], academic_sectors: [] } });
        await getFilterOptions();
        expect(apiClient.get).toHaveBeenCalledWith('/terms/filter-options');
    });

    test('returns response.data', async () => {
        const payload = { academic_years: ['2023', '2024'], academic_sectors: ['A'] };
        apiClient.get.mockResolvedValueOnce({ data: payload });
        const result = await getFilterOptions();
        expect(result).toEqual(payload);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getAllTerms
// ────────────────────────────────────────────────────────────────────────────
describe('getAllTerms', () => {
    test('calls GET /terms with no query string when no filters', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getAllTerms();
        expect(apiClient.get).toHaveBeenCalledWith('/terms');
    });

    test('appends academic_year filter to URL', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getAllTerms({ academic_year: '2024' });
        expect(apiClient.get).toHaveBeenCalledWith('/terms?academic_year=2024');
    });

    test('appends academic_sector filter to URL', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getAllTerms({ academic_sector: 'A' });
        expect(apiClient.get).toHaveBeenCalledWith('/terms?academic_sector=A');
    });

    test('appends status filter to URL', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getAllTerms({ status: 'active' });
        expect(apiClient.get).toHaveBeenCalledWith('/terms?status=active');
    });

    test('appends multiple filters to URL', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getAllTerms({ academic_year: '2024', academic_sector: 'B', status: 'ended' });
        const calledUrl = apiClient.get.mock.calls[0][0];
        expect(calledUrl).toContain('academic_year=2024');
        expect(calledUrl).toContain('academic_sector=B');
        expect(calledUrl).toContain('status=ended');
        expect(calledUrl).toContain('/terms?');
    });

    test('returns response.data', async () => {
        const terms = [{ id: 1 }, { id: 2 }];
        apiClient.get.mockResolvedValueOnce({ data: terms });
        const result = await getAllTerms();
        expect(result).toEqual(terms);
    });

    test('ignores undefined filter values', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getAllTerms({ academic_year: undefined, status: undefined });
        expect(apiClient.get).toHaveBeenCalledWith('/terms');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getActiveTerms
// ────────────────────────────────────────────────────────────────────────────
describe('getActiveTerms', () => {
    test('calls GET /terms/active', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getActiveTerms();
        expect(apiClient.get).toHaveBeenCalledWith('/terms/active');
    });

    test('returns response.data', async () => {
        const terms = [{ id: 10, status: 'active' }];
        apiClient.get.mockResolvedValueOnce({ data: terms });
        const result = await getActiveTerms();
        expect(result).toEqual(terms);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getEndedTerms
// ────────────────────────────────────────────────────────────────────────────
describe('getEndedTerms', () => {
    test('calls GET /terms/ended', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getEndedTerms();
        expect(apiClient.get).toHaveBeenCalledWith('/terms/ended');
    });

    test('returns response.data', async () => {
        const terms = [{ id: 5, status: 'ended' }];
        apiClient.get.mockResolvedValueOnce({ data: terms });
        const result = await getEndedTerms();
        expect(result).toEqual(terms);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getTermById
// ────────────────────────────────────────────────────────────────────────────
describe('getTermById', () => {
    test('calls GET /terms/:id with correct termId', async () => {
        apiClient.get.mockResolvedValueOnce({ data: { id: 3 } });
        await getTermById(3);
        expect(apiClient.get).toHaveBeenCalledWith('/terms/3');
    });

    test('returns response.data', async () => {
        const term = { id: 3, name: 'Term 3' };
        apiClient.get.mockResolvedValueOnce({ data: term });
        const result = await getTermById(3);
        expect(result).toEqual(term);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// createTerm
// ────────────────────────────────────────────────────────────────────────────
describe('createTerm', () => {
    test('calls POST /terms with termData', async () => {
        const termData = { name: 'New Term', academic_year: '2025' };
        apiClient.post.mockResolvedValueOnce({ data: { id: 10, ...termData } });
        await createTerm(termData);
        expect(apiClient.post).toHaveBeenCalledWith('/terms', termData);
    });

    test('returns response.data', async () => {
        const termData = { name: 'New Term' };
        const created = { id: 10, ...termData };
        apiClient.post.mockResolvedValueOnce({ data: created });
        const result = await createTerm(termData);
        expect(result).toEqual(created);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// updateTerm
// ────────────────────────────────────────────────────────────────────────────
describe('updateTerm', () => {
    test('calls PUT /terms/:id with termId and termData', async () => {
        const termData = { name: 'Updated Term' };
        apiClient.put.mockResolvedValueOnce({ data: { id: 7, ...termData } });
        await updateTerm(7, termData);
        expect(apiClient.put).toHaveBeenCalledWith('/terms/7', termData);
    });

    test('returns response.data', async () => {
        const updated = { id: 7, name: 'Updated Term' };
        apiClient.put.mockResolvedValueOnce({ data: updated });
        const result = await updateTerm(7, { name: 'Updated Term' });
        expect(result).toEqual(updated);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// deleteTerm
// ────────────────────────────────────────────────────────────────────────────
describe('deleteTerm', () => {
    test('calls del /terms/:id with termId', async () => {
        apiClient.del.mockResolvedValueOnce({ data: null });
        await deleteTerm(4);
        expect(apiClient.del).toHaveBeenCalledWith('/terms/4');
    });

    test('returns response.data', async () => {
        apiClient.del.mockResolvedValueOnce({ data: { deleted: true } });
        const result = await deleteTerm(4);
        expect(result).toEqual({ deleted: true });
    });
});

// ────────────────────────────────────────────────────────────────────────────
// validateSubjectIds
// ────────────────────────────────────────────────────────────────────────────
describe('validateSubjectIds', () => {
    test('returns { valid: true, invalid_ids: [] } when subjectIds is empty array', async () => {
        const result = await validateSubjectIds([]);
        expect(result).toEqual({ valid: true, invalid_ids: [] });
        expect(apiClient.get).not.toHaveBeenCalled();
    });

    test('returns { valid: true, invalid_ids: [] } when subjectIds is not an array', async () => {
        const result = await validateSubjectIds(null);
        expect(result).toEqual({ valid: true, invalid_ids: [] });
    });

    test('calls GET /subjects to fetch subject list', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [{ id: 1 }, { id: 2 }] });
        await validateSubjectIds([1, 2]);
        expect(apiClient.get).toHaveBeenCalledWith('/subjects');
    });

    test('returns valid=true when all subjectIds exist', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [{ id: 1 }, { id: 2 }, { id: 3 }] });
        const result = await validateSubjectIds([1, 2, 3]);
        expect(result).toEqual({ valid: true, invalid_ids: [] });
    });

    test('returns valid=false with invalid_ids when some IDs do not exist', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [{ id: 1 }, { id: 2 }] });
        const result = await validateSubjectIds([1, 2, 99]);
        expect(result.valid).toBe(false);
        expect(result.invalid_ids).toContain(99);
    });

    test('supports response shape { subjects: [...] }', async () => {
        apiClient.get.mockResolvedValueOnce({ subjects: [{ id: 5 }, { id: 6 }] });
        const result = await validateSubjectIds([5, 6]);
        expect(result.valid).toBe(true);
    });

    test('supports response shape Array<Subject> directly', async () => {
        apiClient.get.mockResolvedValueOnce([{ id: 10 }, { id: 11 }]);
        const result = await validateSubjectIds([10, 11]);
        expect(result.valid).toBe(true);
    });

    test('supports response shape { data: { subjects: [...] } }', async () => {
        apiClient.get.mockResolvedValueOnce({ data: { subjects: [{ id: 20 }, { id: 21 }] } });
        const result = await validateSubjectIds([20, 21]);
        expect(result.valid).toBe(true);
    });

    test('skips validation and returns valid when subjects list is empty and IDs provided', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        const result = await validateSubjectIds([1, 2]);
        expect(result).toEqual({ valid: true, invalid_ids: [] });
    });

    test('coerces string IDs with Number() for comparison', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [{ id: 1 }, { id: 2 }] });
        const result = await validateSubjectIds(['1', '2']);
        expect(result.valid).toBe(true);
    });

    test('throws when apiClient.get rejects', async () => {
        apiClient.get.mockRejectedValueOnce(new Error('Network error'));
        await expect(validateSubjectIds([1])).rejects.toThrow('Network error');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getSubjectsInTerm
// ────────────────────────────────────────────────────────────────────────────
describe('getSubjectsInTerm', () => {
    test('calls GET /terms/:id/subjects', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getSubjectsInTerm(5);
        expect(apiClient.get).toHaveBeenCalledWith('/terms/5/subjects');
    });

    test('returns response.data', async () => {
        const subjects = [{ id: 1 }, { id: 2 }];
        apiClient.get.mockResolvedValueOnce({ data: subjects });
        const result = await getSubjectsInTerm(5);
        expect(result).toEqual(subjects);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// updateTermSubjects
// ────────────────────────────────────────────────────────────────────────────
describe('updateTermSubjects', () => {
    test('calls PUT /terms/:id/subjects with subject_ids', async () => {
        apiClient.put.mockResolvedValueOnce({ data: [] });
        await updateTermSubjects(3, [1, 2, 3]);
        expect(apiClient.put).toHaveBeenCalledWith('/terms/3/subjects', { subject_ids: [1, 2, 3] });
    });

    test('returns response.data', async () => {
        const updated = [{ id: 1 }, { id: 2 }];
        apiClient.put.mockResolvedValueOnce({ data: updated });
        const result = await updateTermSubjects(3, [1, 2]);
        expect(result).toEqual(updated);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getTermSubjects
// ────────────────────────────────────────────────────────────────────────────
describe('getTermSubjects', () => {
    test('calls GET /term-subjects/term/:id', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getTermSubjects(7);
        expect(apiClient.get).toHaveBeenCalledWith('/term-subjects/term/7');
    });

    test('returns response.data', async () => {
        const termSubjects = [{ id: 1, term_id: 7 }];
        apiClient.get.mockResolvedValueOnce({ data: termSubjects });
        const result = await getTermSubjects(7);
        expect(result).toEqual(termSubjects);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// addSubjectToTerm
// ────────────────────────────────────────────────────────────────────────────
describe('addSubjectToTerm', () => {
    test('calls POST /term-subjects with termSubjectData', async () => {
        const data = { term_id: 1, subject_id: 2 };
        apiClient.post.mockResolvedValueOnce({ data: { id: 10, ...data } });
        await addSubjectToTerm(data);
        expect(apiClient.post).toHaveBeenCalledWith('/term-subjects', data);
    });

    test('returns response.data', async () => {
        const created = { id: 10, term_id: 1, subject_id: 2 };
        apiClient.post.mockResolvedValueOnce({ data: created });
        const result = await addSubjectToTerm({ term_id: 1, subject_id: 2 });
        expect(result).toEqual(created);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// updateTermSubject
// ────────────────────────────────────────────────────────────────────────────
describe('updateTermSubject', () => {
    test('calls PUT /term-subjects/:id with data', async () => {
        const data = { notes: 'updated' };
        apiClient.put.mockResolvedValueOnce({ data: { id: 5, ...data } });
        await updateTermSubject(5, data);
        expect(apiClient.put).toHaveBeenCalledWith('/term-subjects/5', data);
    });

    test('returns response.data', async () => {
        const updated = { id: 5, notes: 'updated' };
        apiClient.put.mockResolvedValueOnce({ data: updated });
        const result = await updateTermSubject(5, { notes: 'updated' });
        expect(result).toEqual(updated);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// removeSubjectFromTerm
// ────────────────────────────────────────────────────────────────────────────
describe('removeSubjectFromTerm', () => {
    test('calls del /term-subjects/:id with termSubjectId', async () => {
        apiClient.del.mockResolvedValueOnce({ data: null });
        await removeSubjectFromTerm(9);
        expect(apiClient.del).toHaveBeenCalledWith('/term-subjects/9');
    });

    test('returns response.data', async () => {
        apiClient.del.mockResolvedValueOnce({ data: { removed: true } });
        const result = await removeSubjectFromTerm(9);
        expect(result).toEqual({ removed: true });
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getTermSubjectLecturers
// ────────────────────────────────────────────────────────────────────────────
describe('getTermSubjectLecturers', () => {
    test('calls GET /term-subjects/:id/lecturers', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });
        await getTermSubjectLecturers(12);
        expect(apiClient.get).toHaveBeenCalledWith('/term-subjects/12/lecturers');
    });

    test('returns response.data', async () => {
        const lecturers = [{ user_id: 1, is_responsible: true }];
        apiClient.get.mockResolvedValueOnce({ data: lecturers });
        const result = await getTermSubjectLecturers(12);
        expect(result).toEqual(lecturers);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// assignLecturer
// ────────────────────────────────────────────────────────────────────────────
describe('assignLecturer', () => {
    test('calls POST /term-subjects/:id/lecturers with assignmentData', async () => {
        const assignmentData = { user_id: 5, is_responsible: true, notes: '' };
        apiClient.post.mockResolvedValueOnce({ data: { id: 1, ...assignmentData } });
        await assignLecturer(12, assignmentData);
        expect(apiClient.post).toHaveBeenCalledWith('/term-subjects/12/lecturers', assignmentData);
    });

    test('returns response.data', async () => {
        const created = { id: 1, user_id: 5, is_responsible: true };
        apiClient.post.mockResolvedValueOnce({ data: created });
        const result = await assignLecturer(12, { user_id: 5, is_responsible: true });
        expect(result).toEqual(created);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getResponsibleLecturer
// ────────────────────────────────────────────────────────────────────────────
describe('getResponsibleLecturer', () => {
    test('calls GET /term-subjects/:id/lecturers/responsible', async () => {
        apiClient.get.mockResolvedValueOnce({ data: { user_id: 3, is_responsible: true } });
        await getResponsibleLecturer(8);
        expect(apiClient.get).toHaveBeenCalledWith('/term-subjects/8/lecturers/responsible');
    });

    test('returns response.data on success', async () => {
        const lecturer = { user_id: 3, is_responsible: true };
        apiClient.get.mockResolvedValueOnce({ data: lecturer });
        const result = await getResponsibleLecturer(8);
        expect(result).toEqual(lecturer);
    });

    test('returns null when 404 is received', async () => {
        const err = new Error('Not Found');
        err.response = { status: 404 };
        apiClient.get.mockRejectedValueOnce(err);
        const result = await getResponsibleLecturer(8);
        expect(result).toBeNull();
    });

    test('re-throws non-404 errors', async () => {
        const err = new Error('Server Error');
        err.response = { status: 500 };
        apiClient.get.mockRejectedValueOnce(err);
        await expect(getResponsibleLecturer(8)).rejects.toThrow('Server Error');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// changeResponsibleLecturer
// ────────────────────────────────────────────────────────────────────────────
describe('changeResponsibleLecturer', () => {
    test('calls PUT /term-subjects/:id/lecturers/responsible with user_id', async () => {
        apiClient.put.mockResolvedValueOnce({ data: { user_id: 5 } });
        await changeResponsibleLecturer(8, 5);
        expect(apiClient.put).toHaveBeenCalledWith(
            '/term-subjects/8/lecturers/responsible',
            { user_id: 5 }
        );
    });

    test('returns response.data', async () => {
        const updated = { user_id: 5, is_responsible: true };
        apiClient.put.mockResolvedValueOnce({ data: updated });
        const result = await changeResponsibleLecturer(8, 5);
        expect(result).toEqual(updated);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// updateLecturerNotes
// ────────────────────────────────────────────────────────────────────────────
describe('updateLecturerNotes', () => {
    test('calls PATCH /term-subjects/lecturers/:id with notes', async () => {
        apiClient.patch.mockResolvedValueOnce({ data: { notes: 'New note' } });
        await updateLecturerNotes(15, 'New note');
        expect(apiClient.patch).toHaveBeenCalledWith(
            '/term-subjects/lecturers/15',
            { notes: 'New note' }
        );
    });

    test('returns response.data', async () => {
        const updated = { id: 15, notes: 'New note' };
        apiClient.patch.mockResolvedValueOnce({ data: updated });
        const result = await updateLecturerNotes(15, 'New note');
        expect(result).toEqual(updated);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// removeLecturer
// ────────────────────────────────────────────────────────────────────────────
describe('removeLecturer', () => {
    test('calls del /term-subjects/lecturers/:id', async () => {
        apiClient.del.mockResolvedValueOnce({ data: null });
        await removeLecturer(20);
        expect(apiClient.del).toHaveBeenCalledWith('/term-subjects/lecturers/20');
    });

    test('returns response.data', async () => {
        apiClient.del.mockResolvedValueOnce({ data: { removed: true } });
        const result = await removeLecturer(20);
        expect(result).toEqual({ removed: true });
    });
});
