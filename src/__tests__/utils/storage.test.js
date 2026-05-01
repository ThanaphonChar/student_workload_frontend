import { describe, test, expect, vi, beforeEach } from 'vitest';

import { saveAuth, getAuth, clearAuth } from '../../utils/storage.js';

// ────────────────────────────────────────────────────────────────────────────
// localStorage mock
// ────────────────────────────────────────────────────────────────────────────

const AUTH_KEY = 'student_workload_auth';

beforeEach(() => {
    vi.stubGlobal('localStorage', {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    });
    vi.clearAllMocks();
});

// ────────────────────────────────────────────────────────────────────────────
// saveAuth
// ────────────────────────────────────────────────────────────────────────────

describe('saveAuth', () => {
    test('calls localStorage.setItem with the correct key', () => {
        const authData = { user: { id: 1 }, token: 'abc', expiresAt: Date.now() + 10000 };
        saveAuth(authData);
        expect(localStorage.setItem).toHaveBeenCalledWith(AUTH_KEY, expect.any(String));
    });

    test('serialises authData as JSON when storing', () => {
        const authData = { user: { id: 42, name: 'Alice' }, token: 'tok', expiresAt: 9999 };
        saveAuth(authData);
        const [, storedValue] = localStorage.setItem.mock.calls[0];
        expect(JSON.parse(storedValue)).toEqual(authData);
    });

    test('calls setItem exactly once per invocation', () => {
        saveAuth({ token: 'x' });
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    });

    test('does not throw when localStorage.setItem throws', () => {
        localStorage.setItem.mockImplementation(() => {
            throw new Error('QuotaExceededError');
        });
        expect(() => saveAuth({ token: 'x' })).not.toThrow();
    });

    test('stores null authData without throwing', () => {
        expect(() => saveAuth(null)).not.toThrow();
        expect(localStorage.setItem).toHaveBeenCalledWith(AUTH_KEY, 'null');
    });

    test('stores an object with nested user properties', () => {
        const authData = {
            user: { id: 7, email: 'test@example.com', roles: ['admin'] },
            token: 'jwt-token',
            expiresAt: Date.now() + 86400000,
        };
        saveAuth(authData);
        const [, stored] = localStorage.setItem.mock.calls[0];
        expect(JSON.parse(stored).user.roles).toEqual(['admin']);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getAuth
// ────────────────────────────────────────────────────────────────────────────

describe('getAuth', () => {
    test('returns null when localStorage has no item for the auth key', () => {
        localStorage.getItem.mockReturnValue(null);
        expect(getAuth()).toBeNull();
    });

    test('returns parsed authData when token is not expired', () => {
        const authData = { user: { id: 1 }, token: 'tok', expiresAt: Date.now() + 10000 };
        localStorage.getItem.mockReturnValue(JSON.stringify(authData));
        const result = getAuth();
        expect(result).toEqual(authData);
    });

    test('returns null and calls clearAuth when token is expired', () => {
        const authData = { user: { id: 1 }, token: 'tok', expiresAt: Date.now() - 1 };
        localStorage.getItem.mockReturnValue(JSON.stringify(authData));
        const result = getAuth();
        expect(result).toBeNull();
        // clearAuth calls removeItem
        expect(localStorage.removeItem).toHaveBeenCalledWith(AUTH_KEY);
    });

    test('returns authData when expiresAt is not set (no expiry check)', () => {
        const authData = { user: { id: 2 }, token: 'tok' };
        localStorage.getItem.mockReturnValue(JSON.stringify(authData));
        const result = getAuth();
        expect(result).toEqual(authData);
    });

    test('calls localStorage.getItem with the correct key', () => {
        localStorage.getItem.mockReturnValue(null);
        getAuth();
        expect(localStorage.getItem).toHaveBeenCalledWith(AUTH_KEY);
    });

    test('returns null and calls clearAuth when stored value is invalid JSON', () => {
        localStorage.getItem.mockReturnValue('not-valid-json{{{');
        const result = getAuth();
        expect(result).toBeNull();
        expect(localStorage.removeItem).toHaveBeenCalledWith(AUTH_KEY);
    });

    test('returns null and calls clearAuth when localStorage.getItem throws', () => {
        localStorage.getItem.mockImplementation(() => {
            throw new Error('SecurityError');
        });
        const result = getAuth();
        expect(result).toBeNull();
        expect(localStorage.removeItem).toHaveBeenCalledWith(AUTH_KEY);
    });

    test('returns auth when expiresAt is exactly in the future', () => {
        const expiresAt = Date.now() + 5000;
        const authData = { token: 'valid', expiresAt };
        localStorage.getItem.mockReturnValue(JSON.stringify(authData));
        expect(getAuth()).toEqual(authData);
    });

    test('does not call removeItem when token is still valid', () => {
        const authData = { token: 'valid', expiresAt: Date.now() + 99999 };
        localStorage.getItem.mockReturnValue(JSON.stringify(authData));
        getAuth();
        expect(localStorage.removeItem).not.toHaveBeenCalled();
    });
});

// ────────────────────────────────────────────────────────────────────────────
// clearAuth
// ────────────────────────────────────────────────────────────────────────────

describe('clearAuth', () => {
    test('calls localStorage.removeItem with the correct key', () => {
        clearAuth();
        expect(localStorage.removeItem).toHaveBeenCalledWith(AUTH_KEY);
    });

    test('calls removeItem exactly once', () => {
        clearAuth();
        expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
    });

    test('does not throw when localStorage.removeItem throws', () => {
        localStorage.removeItem.mockImplementation(() => {
            throw new Error('SecurityError');
        });
        expect(() => clearAuth()).not.toThrow();
    });

    test('does not call setItem or getItem', () => {
        clearAuth();
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(localStorage.getItem).not.toHaveBeenCalled();
    });
});
