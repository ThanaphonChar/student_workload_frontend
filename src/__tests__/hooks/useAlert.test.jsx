import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

// Mock the AlertDialog component
vi.mock('../../components/common/AlertDialog.jsx', () => ({
    AlertDialog: ({ isOpen, onClose, title, message, variant, buttonText }) => 
        isOpen ? (
            <div data-testid="alert-dialog">
                <span data-testid="alert-title">{title}</span>
                <span data-testid="alert-message">{message}</span>
                <span data-testid="alert-variant">{variant}</span>
                <span data-testid="alert-button-text">{buttonText}</span>
                <button data-testid="alert-close-btn" onClick={onClose}>{buttonText}</button>
            </div>
        ) : null,
}));

import { useAlert } from '../../hooks/useAlert.jsx';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('useAlert', () => {
    test('returns alert function and AlertDialog component', () => {
        const { result } = renderHook(() => useAlert());
        expect(typeof result.current.alert).toBe('function');
        expect(typeof result.current.AlertDialog).toBe('function');
    });

    test('dialog is closed by default', () => {
        const { result } = renderHook(() => useAlert());
        const container = render(<result.current.AlertDialog />);
        expect(container.queryByTestId('alert-dialog')).toBeNull();
    });

    test('alert() returns a Promise', () => {
        const { result } = renderHook(() => useAlert());
        let promise;
        act(() => {
            promise = result.current.alert({ title: 'Test', message: 'Hello' });
        });
        expect(promise).toBeInstanceOf(Promise);
    });

    test('calling alert() opens the dialog with provided options', () => {
        const { result } = renderHook(() => useAlert());
        
        act(() => {
            result.current.alert({
                title: 'Error Title',
                message: 'Something went wrong',
                variant: 'error',
                buttonText: 'OK',
            });
        });

        const container = render(<result.current.AlertDialog />);
        expect(container.getByTestId('alert-dialog')).toBeTruthy();
        expect(container.getByTestId('alert-title')).toHaveTextContent('Error Title');
        expect(container.getByTestId('alert-message')).toHaveTextContent('Something went wrong');
    });

    test('alert() uses default values when no options provided', () => {
        const { result } = renderHook(() => useAlert());
        
        act(() => {
            result.current.alert();
        });

        const container = render(<result.current.AlertDialog />);
        expect(container.getByTestId('alert-title')).toHaveTextContent('แจ้งเตือน');
        expect(container.getByTestId('alert-variant')).toHaveTextContent('error');
    });

    test('dialog button text matches provided buttonText', () => {
        const { result } = renderHook(() => useAlert());
        
        act(() => {
            result.current.alert({ buttonText: 'Dismiss' });
        });

        const container = render(<result.current.AlertDialog />);
        expect(container.getByTestId('alert-button-text')).toHaveTextContent('Dismiss');
    });

    test('message is optional and can be empty', () => {
        const { result } = renderHook(() => useAlert());
        
        act(() => {
            result.current.alert({ title: 'Only Title' });
        });

        const container = render(<result.current.AlertDialog />);
        expect(container.getByTestId('alert-message')).toHaveTextContent('');
    });

    test('variant can be customized', () => {
        const { result } = renderHook(() => useAlert());
        
        act(() => {
            result.current.alert({ variant: 'success' });
        });

        const container = render(<result.current.AlertDialog />);
        expect(container.getByTestId('alert-variant')).toHaveTextContent('success');
    });

    test('promise resolves when dialog is closed', async () => {
        const { result } = renderHook(() => useAlert());
        
        let resolved = false;
        act(() => {
            result.current.alert({ title: 'Test' }).then(() => {
                resolved = true;
            });
        });

        const container = render(<result.current.AlertDialog />);
        const closeBtn = container.getByTestId('alert-close-btn');
        
        act(() => {
            fireEvent.click(closeBtn);
        });

        // Wait for promise resolution
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(resolved).toBe(true);
    });

    test('default button text is ตกลง', () => {
        const { result } = renderHook(() => useAlert());
        
        act(() => {
            result.current.alert({ title: 'Test' });
        });

        const container = render(<result.current.AlertDialog />);
        expect(container.getByTestId('alert-button-text')).toHaveTextContent('ตกลง');
    });
});
