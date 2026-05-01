import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Modal } from '../../../components/common/Modal.jsx';

beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
});

describe('Modal', () => {
    test('renders nothing when isOpen is false', () => {
        render(<Modal isOpen={false} onClose={vi.fn()} title="Test" />);
        expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });

    test('renders content when isOpen is true', () => {
        render(<Modal isOpen={true} onClose={vi.fn()} title="Test Modal"><p>Body content</p></Modal>);
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Body content')).toBeInTheDocument();
    });

    test('renders title when provided', () => {
        render(<Modal isOpen={true} onClose={vi.fn()} title="My Title" />);
        expect(screen.getByText('My Title')).toBeInTheDocument();
    });

    test('does not render title element when title is not provided', () => {
        render(<Modal isOpen={true} onClose={vi.fn()}><p>Just body</p></Modal>);
        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    test('renders children inside modal body', () => {
        render(
            <Modal isOpen={true} onClose={vi.fn()}>
                <span data-testid="child-content">child</span>
            </Modal>
        );
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    test('renders footer when provided', () => {
        render(
            <Modal isOpen={true} onClose={vi.fn()} footer={<button>Save</button>} />
        );
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    test('does not render footer element when footer is not provided', () => {
        render(<Modal isOpen={true} onClose={vi.fn()} title="No Footer" />);
        expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    test('calls onClose when overlay is clicked and closeOnOverlay is true', () => {
        const onClose = vi.fn();
        render(
            <Modal isOpen={true} onClose={onClose} closeOnOverlay={true}>
                <p>Content</p>
            </Modal>
        );
        // The overlay is the fixed inset-0 backdrop div
        const overlay = document.querySelector('.fixed.inset-0.bg-neutral-950\\/50');
        fireEvent.click(overlay);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('does not call onClose when overlay is clicked and closeOnOverlay is false', () => {
        const onClose = vi.fn();
        render(
            <Modal isOpen={true} onClose={onClose} closeOnOverlay={false}>
                <p>Content</p>
            </Modal>
        );
        const overlay = document.querySelector('.fixed.inset-0.bg-neutral-950\\/50');
        fireEvent.click(overlay);
        expect(onClose).not.toHaveBeenCalled();
    });

    test('calls onClose when Escape key is pressed', () => {
        const onClose = vi.fn();
        render(<Modal isOpen={true} onClose={onClose}><p>Content</p></Modal>);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('does not call onClose for other keys', () => {
        const onClose = vi.fn();
        render(<Modal isOpen={true} onClose={onClose}><p>Content</p></Modal>);
        fireEvent.keyDown(document, { key: 'Enter' });
        expect(onClose).not.toHaveBeenCalled();
    });

    test('sets body overflow to hidden when open', () => {
        render(<Modal isOpen={true} onClose={vi.fn()}><p>Content</p></Modal>);
        expect(document.body.style.overflow).toBe('hidden');
    });

    test('resets body overflow when closed', () => {
        const { rerender } = render(<Modal isOpen={true} onClose={vi.fn()}><p>Content</p></Modal>);
        expect(document.body.style.overflow).toBe('hidden');
        rerender(<Modal isOpen={false} onClose={vi.fn()}><p>Content</p></Modal>);
        expect(document.body.style.overflow).toBe('unset');
    });

    test('clicking modal content does not call onClose', () => {
        const onClose = vi.fn();
        render(
            <Modal isOpen={true} onClose={onClose} closeOnOverlay={true}>
                <p data-testid="modal-body">Inner content</p>
            </Modal>
        );
        fireEvent.click(screen.getByTestId('modal-body'));
        expect(onClose).not.toHaveBeenCalled();
    });

    test('renders with sm size', () => {
        render(<Modal isOpen={true} onClose={vi.fn()} size="sm"><p>Content</p></Modal>);
        const dialog = document.querySelector('.max-w-md');
        expect(dialog).toBeInTheDocument();
    });

    test('renders with lg size', () => {
        render(<Modal isOpen={true} onClose={vi.fn()} size="lg"><p>Content</p></Modal>);
        const dialog = document.querySelector('.max-w-2xl');
        expect(dialog).toBeInTheDocument();
    });

    test('renders with xl size', () => {
        render(<Modal isOpen={true} onClose={vi.fn()} size="xl"><p>Content</p></Modal>);
        const dialog = document.querySelector('.max-w-4xl');
        expect(dialog).toBeInTheDocument();
    });
});
