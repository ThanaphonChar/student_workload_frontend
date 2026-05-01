import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

import {
    decodeJWT,
    getUserIdFromToken,
    getRolesFromToken,
    isTokenExpired,
    hasRole,
} from '../../utils/jwt.js';

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

/**
 * Build a real JWT-like token string (header.payload.signature).
 * The signature is a dummy value — decodeJWT only reads the payload.
 */
function buildToken(payload) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const body = btoa(JSON.stringify(payload))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `${header}.${body}.fakesignature`;
}

/** Unix timestamp (seconds) in the future. */
const futureExp = () => Math.floor(Date.now() / 1000) + 3600; // +1 hour

/** Unix timestamp (seconds) in the past. */
const pastExp = () => Math.floor(Date.now() / 1000) - 3600;  // -1 hour

beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    vi.useRealTimers();
});

// ────────────────────────────────────────────────────────────────────────────
// decodeJWT
// ────────────────────────────────────────────────────────────────────────────

describe('decodeJWT', () => {
    test('returns null for null input', () => {
        expect(decodeJWT(null)).toBeNull();
    });

    test('returns null for undefined input', () => {
        expect(decodeJWT(undefined)).toBeNull();
    });

    test('returns null for empty string', () => {
        expect(decodeJWT('')).toBeNull();
    });

    test('returns null for a non-string value', () => {
        expect(decodeJWT(12345)).toBeNull();
        expect(decodeJWT({})).toBeNull();
    });

    test('returns null for a token with wrong number of parts', () => {
        expect(decodeJWT('only.two')).toBeNull();
        expect(decodeJWT('one')).toBeNull();
        expect(decodeJWT('a.b.c.d')).toBeNull();
    });

    test('returns null for a token with invalid base64 payload', () => {
        const invalid = 'header.!!!invalid!!!.signature';
        expect(decodeJWT(invalid)).toBeNull();
    });

    test('decodes a valid JWT and returns the payload object', () => {
        const payload = { sub: 'user-42', name: 'Alice', roles: ['admin'] };
        const token = buildToken(payload);
        const result = decodeJWT(token);
        expect(result).toMatchObject(payload);
    });

    test('decodes all standard claims correctly', () => {
        const exp = futureExp();
        const payload = { sub: 'user-1', iat: 1000, exp, roles: ['teacher'] };
        const result = decodeJWT(buildToken(payload));
        expect(result.sub).toBe('user-1');
        expect(result.iat).toBe(1000);
        expect(result.exp).toBe(exp);
        expect(result.roles).toEqual(['teacher']);
    });

    test('handles base64url encoding (- and _ characters) correctly', () => {
        // Build a payload where the base64 encoding would normally contain + or /
        const payload = { sub: 'user-with-special', data: '>>>???<<<' };
        const token = buildToken(payload);
        const result = decodeJWT(token);
        expect(result.sub).toBe('user-with-special');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getUserIdFromToken
// ────────────────────────────────────────────────────────────────────────────

describe('getUserIdFromToken', () => {
    test('returns the sub field from a valid token', () => {
        const token = buildToken({ sub: 'user-99', exp: futureExp() });
        expect(getUserIdFromToken(token)).toBe('user-99');
    });

    test('returns null when the token has no sub field', () => {
        const token = buildToken({ exp: futureExp(), roles: ['admin'] });
        expect(getUserIdFromToken(token)).toBeNull();
    });

    test('returns null for an invalid token', () => {
        expect(getUserIdFromToken('bad.token')).toBeNull();
    });

    test('returns null for null input', () => {
        expect(getUserIdFromToken(null)).toBeNull();
    });

    test('returns null for empty string', () => {
        expect(getUserIdFromToken('')).toBeNull();
    });

    test('returns sub even if it is a numeric string', () => {
        const token = buildToken({ sub: '123' });
        expect(getUserIdFromToken(token)).toBe('123');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getRolesFromToken
// ────────────────────────────────────────────────────────────────────────────

describe('getRolesFromToken', () => {
    test('returns roles array from a valid token', () => {
        const token = buildToken({ sub: 'u1', roles: ['admin', 'teacher'] });
        expect(getRolesFromToken(token)).toEqual(['admin', 'teacher']);
    });

    test('returns empty array when roles field is absent', () => {
        const token = buildToken({ sub: 'u1' });
        expect(getRolesFromToken(token)).toEqual([]);
    });

    test('returns empty array when roles is not an array (string)', () => {
        const token = buildToken({ sub: 'u1', roles: 'admin' });
        expect(getRolesFromToken(token)).toEqual([]);
    });

    test('returns empty array when roles is null', () => {
        const token = buildToken({ sub: 'u1', roles: null });
        expect(getRolesFromToken(token)).toEqual([]);
    });

    test('returns empty array for an invalid token', () => {
        expect(getRolesFromToken('bad.token')).toEqual([]);
    });

    test('returns empty array for null input', () => {
        expect(getRolesFromToken(null)).toEqual([]);
    });

    test('returns empty array when roles is an empty array', () => {
        const token = buildToken({ sub: 'u1', roles: [] });
        expect(getRolesFromToken(token)).toEqual([]);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// isTokenExpired
// ────────────────────────────────────────────────────────────────────────────

describe('isTokenExpired', () => {
    test('returns true for null input', () => {
        expect(isTokenExpired(null)).toBe(true);
    });

    test('returns true for an invalid token', () => {
        expect(isTokenExpired('not.a.token')).toBe(true);
    });

    test('returns true when decoded token has no exp field', () => {
        const token = buildToken({ sub: 'u1' });
        expect(isTokenExpired(token)).toBe(true);
    });

    test('returns false when exp is in the future', () => {
        const token = buildToken({ sub: 'u1', exp: futureExp() });
        expect(isTokenExpired(token)).toBe(false);
    });

    test('returns true when exp is in the past', () => {
        const token = buildToken({ sub: 'u1', exp: pastExp() });
        expect(isTokenExpired(token)).toBe(true);
    });

    test('returns true when exp equals current time (boundary — now >= exp)', () => {
        vi.useFakeTimers();
        const fixedNow = 1_700_000_000_000; // arbitrary fixed ms timestamp
        vi.setSystemTime(fixedNow);
        const exp = Math.floor(fixedNow / 1000); // exactly now in seconds
        const token = buildToken({ sub: 'u1', exp });
        expect(isTokenExpired(token)).toBe(true);
    });

    test('returns false for a token expiring one second from now', () => {
        vi.useFakeTimers();
        const fixedNow = 1_700_000_000_000;
        vi.setSystemTime(fixedNow);
        const exp = Math.floor(fixedNow / 1000) + 1;
        const token = buildToken({ sub: 'u1', exp });
        expect(isTokenExpired(token)).toBe(false);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// hasRole
// ────────────────────────────────────────────────────────────────────────────

describe('hasRole', () => {
    test('returns false for null token', () => {
        expect(hasRole(null, 'admin')).toBe(false);
    });

    test('returns false for invalid token', () => {
        expect(hasRole('bad.token', 'admin')).toBe(false);
    });

    test('returns false when token has no roles', () => {
        const token = buildToken({ sub: 'u1' });
        expect(hasRole(token, 'admin')).toBe(false);
    });

    test('returns false when token has empty roles array', () => {
        const token = buildToken({ sub: 'u1', roles: [] });
        expect(hasRole(token, 'admin')).toBe(false);
    });

    test('returns true when user has the required role (string)', () => {
        const token = buildToken({ sub: 'u1', roles: ['admin', 'teacher'] });
        expect(hasRole(token, 'admin')).toBe(true);
    });

    test('returns false when user does not have the required role (string)', () => {
        const token = buildToken({ sub: 'u1', roles: ['teacher'] });
        expect(hasRole(token, 'admin')).toBe(false);
    });

    test('returns true when user has at least one role from array of required roles', () => {
        const token = buildToken({ sub: 'u1', roles: ['teacher'] });
        expect(hasRole(token, ['admin', 'teacher'])).toBe(true);
    });

    test('returns false when user has none of the required roles array', () => {
        const token = buildToken({ sub: 'u1', roles: ['student'] });
        expect(hasRole(token, ['admin', 'teacher'])).toBe(false);
    });

    test('returns true when all required roles are present', () => {
        const token = buildToken({ sub: 'u1', roles: ['admin', 'teacher', 'student'] });
        expect(hasRole(token, ['admin', 'teacher'])).toBe(true);
    });

    test('is case-sensitive — "Admin" does not match "admin"', () => {
        const token = buildToken({ sub: 'u1', roles: ['admin'] });
        expect(hasRole(token, 'Admin')).toBe(false);
    });

    test('wraps a single required role string into an array internally', () => {
        const token = buildToken({ sub: 'u1', roles: ['teacher'] });
        expect(hasRole(token, 'teacher')).toBe(true);
    });
});
