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
import { login, logout } from '../../services/authService.js';

beforeEach(() => {
    vi.clearAllMocks();
});

// ────────────────────────────────────────────────────────────────────────────
// login
// ────────────────────────────────────────────────────────────────────────────
describe('login', () => {
    test('calls POST /auth/login with correct payload', async () => {
        apiClient.post.mockResolvedValueOnce({
            success: true,
            user: { id: 1, username: 'john' },
            token: 'abc123',
            expiresIn: 3600,
        });

        await login('john', 'secret');

        expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
            UserName: 'john',
            PassWord: 'secret',
        });
    });

    test('returns user, token, and expiresIn on success', async () => {
        const mockUser = { id: 1, username: 'john' };
        apiClient.post.mockResolvedValueOnce({
            success: true,
            user: mockUser,
            token: 'tok-xyz',
            expiresIn: 7200,
        });

        const result = await login('john', 'secret');

        expect(result).toEqual({
            user: mockUser,
            token: 'tok-xyz',
            expiresIn: 7200,
        });
    });

    test('defaults expiresIn to 2592000 when backend omits it', async () => {
        apiClient.post.mockResolvedValueOnce({
            success: true,
            user: { id: 2 },
            token: 'tok-abc',
        });

        const result = await login('jane', 'pw');

        expect(result.expiresIn).toBe(2592000);
    });

    test('throws translated error when success is false', async () => {
        apiClient.post.mockResolvedValueOnce({
            success: false,
            message: 'เข้าสู่ระบบไม่สำเร็จ',
        });

        await expect(login('bad', 'user')).rejects.toThrow('เข้าสู่ระบบไม่สำเร็จ');
    });

    test('throws translated error when success is false with custom message', async () => {
        apiClient.post.mockResolvedValueOnce({
            success: false,
            message: 'Account locked',
        });

        await expect(login('bad', 'user')).rejects.toThrow('Account locked');
    });

    test('uses default message when success is false and message is missing', async () => {
        apiClient.post.mockResolvedValueOnce({ success: false });

        await expect(login('bad', 'user')).rejects.toThrow('เข้าสู่ระบบไม่สำเร็จ');
    });

    test('translates "Invalid" error to Thai', async () => {
        apiClient.post.mockRejectedValueOnce(new Error('Invalid credentials'));

        await expect(login('bad', 'user')).rejects.toThrow('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    });

    test('translates "Password" error to Thai', async () => {
        apiClient.post.mockRejectedValueOnce(new Error('Password is incorrect'));

        await expect(login('bad', 'user')).rejects.toThrow('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    });

    test('translates "Failed to fetch" error to Thai', async () => {
        apiClient.post.mockRejectedValueOnce(new Error('Failed to fetch'));

        await expect(login('user', 'pw')).rejects.toThrow('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    });

    test('re-throws unknown errors unchanged', async () => {
        apiClient.post.mockRejectedValueOnce(new Error('Some unknown error'));

        await expect(login('user', 'pw')).rejects.toThrow('Some unknown error');
    });

    test('called exactly once per login call', async () => {
        apiClient.post.mockResolvedValueOnce({
            success: true,
            user: { id: 1 },
            token: 't',
            expiresIn: 100,
        });

        await login('user', 'pw');

        expect(apiClient.post).toHaveBeenCalledTimes(1);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// logout
// ────────────────────────────────────────────────────────────────────────────
describe('logout', () => {
    test('resolves without throwing', async () => {
        await expect(logout()).resolves.toBeUndefined();
    });

    test('does not call any API endpoint', async () => {
        await logout();

        expect(apiClient.post).not.toHaveBeenCalled();
        expect(apiClient.get).not.toHaveBeenCalled();
    });
});
