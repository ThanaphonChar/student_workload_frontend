import { describe, test, expect, vi, beforeEach } from 'vitest';

import { handleError, isNetworkError } from '../../utils/handleError.js';

beforeEach(() => {
    vi.clearAllMocks();
});

// ────────────────────────────────────────────────────────────────────────────
// handleError
// ────────────────────────────────────────────────────────────────────────────

describe('handleError', () => {
    test('returns error.message when the input has a message property', () => {
        const error = new Error('Something went wrong');
        expect(handleError(error)).toBe('Something went wrong');
    });

    test('returns error.message for a plain object with a message field', () => {
        const error = { message: 'Custom error message' };
        expect(handleError(error)).toBe('Custom error message');
    });

    test('returns error.error when no message property is present', () => {
        const error = { error: 'Backend error string' };
        expect(handleError(error)).toBe('Backend error string');
    });

    test('prioritises message over error field when both are present', () => {
        const error = { message: 'From message', error: 'From error' };
        expect(handleError(error)).toBe('From message');
    });

    test('returns default Thai message when neither message nor error exists', () => {
        expect(handleError({})).toBe('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    });

    test('returns default message for an error object with empty message string', () => {
        // empty string is falsy, so falls through to default
        const error = { message: '' };
        // '' is falsy — the code checks `if (error.message)` so this falls through
        expect(handleError(error)).toBe('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    });

    test('returns error.error when message is empty but error field is set', () => {
        const error = { message: '', error: 'secondary error' };
        expect(handleError(error)).toBe('secondary error');
    });

    test('handles native Error with a custom message', () => {
        const error = new TypeError('type mismatch');
        expect(handleError(error)).toBe('type mismatch');
    });

    test('handles network-style error objects', () => {
        const error = { message: 'Failed to fetch' };
        expect(handleError(error)).toBe('Failed to fetch');
    });

    test('returns default message for object with undefined fields', () => {
        const error = { message: undefined, error: undefined };
        expect(handleError(error)).toBe('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// isNetworkError
// ────────────────────────────────────────────────────────────────────────────

describe('isNetworkError', () => {
    test('returns true for "Failed to fetch" message', () => {
        expect(isNetworkError({ message: 'Failed to fetch' })).toBe(true);
    });

    test('returns true for "Network request failed" message', () => {
        expect(isNetworkError({ message: 'Network request failed' })).toBe(true);
    });

    test('returns false for a generic error message', () => {
        expect(isNetworkError({ message: 'Something else went wrong' })).toBe(false);
    });

    test('returns false for an empty message', () => {
        expect(isNetworkError({ message: '' })).toBe(false);
    });

    test('returns false for an object without a message property', () => {
        expect(isNetworkError({})).toBe(false);
    });

    test('returns false for a 401 HTTP error message', () => {
        expect(isNetworkError({ message: 'Unauthorized' })).toBe(false);
    });

    test('works correctly with a native Error object', () => {
        const error = new Error('Failed to fetch');
        expect(isNetworkError(error)).toBe(true);
    });

    test('is case-sensitive — does not match mixed-case variants', () => {
        expect(isNetworkError({ message: 'failed to fetch' })).toBe(false);
        expect(isNetworkError({ message: 'FAILED TO FETCH' })).toBe(false);
    });

    test('returns false for partial match of the expected message', () => {
        expect(isNetworkError({ message: 'Failed to' })).toBe(false);
        expect(isNetworkError({ message: 'Network request' })).toBe(false);
    });
});
