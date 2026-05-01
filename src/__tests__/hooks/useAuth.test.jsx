import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';

import { AuthContext } from '../../context/AuthContext';
import { useAuth } from '../../hooks/useAuth';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('useAuth', () => {
    test('throws error when used outside AuthProvider', () => {
        // Suppress the console error that React prints for the thrown error
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => {
            renderHook(() => useAuth());
        }).toThrow('useAuth must be used within an AuthProvider');

        consoleSpy.mockRestore();
    });

    test('returns the context value when used inside AuthProvider', () => {
        const mockContextValue = {
            user: { id: 1, username: 'testuser' },
            token: 'mock-token',
            userId: 1,
            roles: ['Admin'],
            isAuthenticated: true,
            loading: false,
            authError: null,
            login: vi.fn(),
            logout: vi.fn(),
        };

        const wrapper = ({ children }) => (
            <AuthContext.Provider value={mockContextValue}>
                {children}
            </AuthContext.Provider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current).toBe(mockContextValue);
    });

    test('returns user from context', () => {
        const mockUser = { id: 42, username: 'professor_john' };
        const mockContextValue = {
            user: mockUser,
            token: 'some-token',
            userId: 42,
            roles: ['Professor'],
            isAuthenticated: true,
            loading: false,
            authError: null,
            login: vi.fn(),
            logout: vi.fn(),
        };

        const wrapper = ({ children }) => (
            <AuthContext.Provider value={mockContextValue}>
                {children}
            </AuthContext.Provider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.userId).toBe(42);
    });

    test('returns roles from context', () => {
        const mockContextValue = {
            user: null,
            token: null,
            userId: null,
            roles: ['AcademicOfficer', 'ProgramChair'],
            isAuthenticated: false,
            loading: false,
            authError: null,
            login: vi.fn(),
            logout: vi.fn(),
        };

        const wrapper = ({ children }) => (
            <AuthContext.Provider value={mockContextValue}>
                {children}
            </AuthContext.Provider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.roles).toEqual(['AcademicOfficer', 'ProgramChair']);
    });

    test('returns isAuthenticated flag from context', () => {
        const mockContextValue = {
            user: { id: 1 },
            token: 'valid-token',
            userId: 1,
            roles: [],
            isAuthenticated: true,
            loading: false,
            authError: null,
            login: vi.fn(),
            logout: vi.fn(),
        };

        const wrapper = ({ children }) => (
            <AuthContext.Provider value={mockContextValue}>
                {children}
            </AuthContext.Provider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.isAuthenticated).toBe(true);
    });

    test('returns loading state from context', () => {
        const mockContextValue = {
            user: null,
            token: null,
            userId: null,
            roles: [],
            isAuthenticated: false,
            loading: true,
            authError: null,
            login: vi.fn(),
            logout: vi.fn(),
        };

        const wrapper = ({ children }) => (
            <AuthContext.Provider value={mockContextValue}>
                {children}
            </AuthContext.Provider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.loading).toBe(true);
    });

    test('returns authError from context', () => {
        const mockContextValue = {
            user: null,
            token: null,
            userId: null,
            roles: [],
            isAuthenticated: false,
            loading: false,
            authError: 'Invalid credentials',
            login: vi.fn(),
            logout: vi.fn(),
        };

        const wrapper = ({ children }) => (
            <AuthContext.Provider value={mockContextValue}>
                {children}
            </AuthContext.Provider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.authError).toBe('Invalid credentials');
    });

    test('returns login and logout functions from context', () => {
        const mockLogin = vi.fn();
        const mockLogout = vi.fn();
        const mockContextValue = {
            user: null,
            token: null,
            userId: null,
            roles: [],
            isAuthenticated: false,
            loading: false,
            authError: null,
            login: mockLogin,
            logout: mockLogout,
        };

        const wrapper = ({ children }) => (
            <AuthContext.Provider value={mockContextValue}>
                {children}
            </AuthContext.Provider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.login).toBe(mockLogin);
        expect(result.current.logout).toBe(mockLogout);
    });

    test('returns unauthenticated state when no token', () => {
        const mockContextValue = {
            user: null,
            token: null,
            userId: null,
            roles: [],
            isAuthenticated: false,
            loading: false,
            authError: null,
            login: vi.fn(),
            logout: vi.fn(),
        };

        const wrapper = ({ children }) => (
            <AuthContext.Provider value={mockContextValue}>
                {children}
            </AuthContext.Provider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
        expect(result.current.roles).toEqual([]);
    });
});
