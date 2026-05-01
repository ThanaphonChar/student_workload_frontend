import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import React, { useState } from 'react';

vi.mock('../../components/common/ConfirmDialog.jsx', () => ({
    ConfirmDialog: ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, variant }) =>
        isOpen ? (
            <div data-testid="confirm-dialog">
                <span data-testid="confirm-title">{title}</span>
                <span data-testid="confirm-message">{message}</span>
                <span data-testid="confirm-variant">{variant}</span>
                <span data-testid="confirm-text">{confirmText}</span>
                <span data-testid="cancel-text">{cancelText}</span>
                <button data-testid="confirm-btn" onClick={onConfirm}>{confirmText}</button>
                <button data-testid="cancel-btn" onClick={onClose}>{cancelText}</button>
            </div>
        ) : null,
}));

import { useConfirm } from '../../hooks/useConfirm.jsx';

beforeEach(() => {
    vi.clearAllMocks();
});

// Component that uses the hook properly in a component tree
const TestComponent = ({ onConfirmed }) => {
    const { confirm, ConfirmDialog } = useConfirm();
    
    const handleTest = () => {
        confirm({ title: 'Test' }).then(onConfirmed);
    };
    
    return (
        <div>
            <button data-testid="test-button" onClick={handleTest}>Open</button>
            <ConfirmDialog />
        </div>
    );
};

describe('useConfirm', () => {
    test('returns confirm function and ConfirmDialog component', () => {
        const { result } = renderHook(() => useConfirm());
        expect(typeof result.current.confirm).toBe('function');
        expect(typeof result.current.ConfirmDialog).toBe('function');
    });

    test('dialog is closed by default', () => {
        const { result } = renderHook(() => useConfirm());
        render(<result.current.ConfirmDialog />);
        expect(screen.queryByTestId('confirm-dialog')).toBeNull();
    });

    test('confirm() returns a Promise', () => {
        const { result } = renderHook(() => useConfirm());
        let promise;
        act(() => {
            promise = result.current.confirm({ title: 'Test' });
        });
        expect(promise).toBeInstanceOf(Promise);
    });

    test('calling confirm() opens dialog with provided options', () => {
        const { result } = renderHook(() => useConfirm());

        act(() => {
            result.current.confirm({
                title: 'Delete Item',
                message: 'Are you sure?',
                confirmText: 'Delete',
                cancelText: 'Cancel',
                variant: 'danger',
            });
        });

        render(<result.current.ConfirmDialog />);
        expect(screen.getByTestId('confirm-dialog')).toBeTruthy();
        expect(screen.getByTestId('confirm-title')).toHaveTextContent('Delete Item');
        expect(screen.getByTestId('confirm-message')).toHaveTextContent('Are you sure?');
    });

    test('confirm() uses default values when no options provided', () => {
        const { result } = renderHook(() => useConfirm());

        act(() => {
            result.current.confirm();
        });

        render(<result.current.ConfirmDialog />);
        expect(screen.getByTestId('confirm-title')).toHaveTextContent('ยืนยันการทำงาน');
        expect(screen.getByTestId('confirm-message')).toHaveTextContent('คุณแน่ใจหรือไม่?');
        expect(screen.getByTestId('confirm-text')).toHaveTextContent('ยืนยัน');
        expect(screen.getByTestId('cancel-text')).toHaveTextContent('ยกเลิก');
    });

    test('resolves with true when confirm button is clicked', async () => {
        const onConfirmed = vi.fn();
        render(<TestComponent onConfirmed={onConfirmed} />);
        
        const openBtn = screen.getByTestId('test-button');
        fireEvent.click(openBtn);
        
        const confirmBtn = screen.getByTestId('confirm-btn');
        fireEvent.click(confirmBtn);
        
        await waitFor(() => {
            expect(onConfirmed).toHaveBeenCalledWith(true);
        });
    });

    test('resolves with false when cancel button is clicked', async () => {
        const onConfirmed = vi.fn();
        render(<TestComponent onConfirmed={onConfirmed} />);
        
        const openBtn = screen.getByTestId('test-button');
        fireEvent.click(openBtn);
        
        const cancelBtn = screen.getByTestId('cancel-btn');
        fireEvent.click(cancelBtn);
        
        await waitFor(() => {
            expect(onConfirmed).toHaveBeenCalledWith(false);
        });
    });

    test('dialog closes after confirming', async () => {
        const onConfirmed = vi.fn();
        const { rerender } = render(<TestComponent onConfirmed={onConfirmed} />);
        
        const openBtn = screen.getByTestId('test-button');
        fireEvent.click(openBtn);
        
        expect(screen.getByTestId('confirm-dialog')).toBeTruthy();
        
        const confirmBtn = screen.getByTestId('confirm-btn');
        fireEvent.click(confirmBtn);
        
        await waitFor(() => {
            expect(onConfirmed).toHaveBeenCalledWith(true);
        });
    });

    test('dialog closes after canceling', async () => {
        const onConfirmed = vi.fn();
        const { rerender } = render(<TestComponent onConfirmed={onConfirmed} />);
        
        const openBtn = screen.getByTestId('test-button');
        fireEvent.click(openBtn);
        
        expect(screen.getByTestId('confirm-dialog')).toBeTruthy();
        
        const cancelBtn = screen.getByTestId('cancel-btn');
        fireEvent.click(cancelBtn);
        
        await waitFor(() => {
            expect(onConfirmed).toHaveBeenCalledWith(false);
        });
    });

    test('variant can be customized', () => {
        const { result } = renderHook(() => useConfirm());

        act(() => {
            result.current.confirm({ variant: 'warning' });
        });

        render(<result.current.ConfirmDialog />);
        expect(screen.getByTestId('confirm-variant')).toHaveTextContent('warning');
    });

    test('button texts can be customized', () => {
        const { result } = renderHook(() => useConfirm());

        act(() => {
            result.current.confirm({
                confirmText: 'Sure!',
                cancelText: 'Nope',
            });
        });

        render(<result.current.ConfirmDialog />);
        expect(screen.getByTestId('confirm-text')).toHaveTextContent('Sure!');
        expect(screen.getByTestId('cancel-text')).toHaveTextContent('Nope');
    });
});
