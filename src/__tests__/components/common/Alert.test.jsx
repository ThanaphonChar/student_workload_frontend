import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Alert } from '../../../components/common/Alert.jsx';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('Alert', () => {
    test('renders the message text', () => {
        render(<Alert type="info" message="Something happened" />);
        expect(screen.getByText('Something happened')).toBeInTheDocument();
    });

    test('renders info alert by default when type is not provided', () => {
        render(<Alert message="Default info" />);
        expect(screen.getByText('Default info')).toBeInTheDocument();
        // info icon
        const icons = document.querySelectorAll('.material-symbols-outlined');
        const iconTexts = Array.from(icons).map(el => el.textContent);
        expect(iconTexts).toContain('info');
    });

    test('renders success alert with check_circle icon', () => {
        render(<Alert type="success" message="Success!" />);
        const icons = document.querySelectorAll('.material-symbols-outlined');
        const iconTexts = Array.from(icons).map(el => el.textContent);
        expect(iconTexts).toContain('check_circle');
    });

    test('renders error alert with error icon', () => {
        render(<Alert type="error" message="Error occurred" />);
        const icons = document.querySelectorAll('.material-symbols-outlined');
        const iconTexts = Array.from(icons).map(el => el.textContent);
        expect(iconTexts).toContain('error');
    });

    test('renders warning alert with warning icon', () => {
        render(<Alert type="warning" message="Be careful" />);
        const icons = document.querySelectorAll('.material-symbols-outlined');
        const iconTexts = Array.from(icons).map(el => el.textContent);
        expect(iconTexts).toContain('warning');
    });

    test('renders info alert with info icon', () => {
        render(<Alert type="info" message="FYI" />);
        const icons = document.querySelectorAll('.material-symbols-outlined');
        const iconTexts = Array.from(icons).map(el => el.textContent);
        expect(iconTexts).toContain('info');
    });

    test('renders close button when onClose is provided', () => {
        render(<Alert type="info" message="Closable" onClose={vi.fn()} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('does not render close button when onClose is not provided', () => {
        render(<Alert type="info" message="No close" />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('calls onClose when close button is clicked', () => {
        const onClose = vi.fn();
        render(<Alert type="info" message="Closable" onClose={onClose} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('applies custom className to container', () => {
        render(<Alert type="info" message="Styled" className="my-alert" />);
        const container = document.querySelector('.my-alert');
        expect(container).toBeInTheDocument();
    });

    test('applies green background for success type', () => {
        const { container } = render(<Alert type="success" message="OK" />);
        expect(container.firstChild.className).toMatch(/bg-green-50/);
    });

    test('applies red background for error type', () => {
        const { container } = render(<Alert type="error" message="Err" />);
        expect(container.firstChild.className).toMatch(/bg-red-50/);
    });

    test('applies yellow background for warning type', () => {
        const { container } = render(<Alert type="warning" message="Warn" />);
        expect(container.firstChild.className).toMatch(/bg-yellow-50/);
    });

    test('applies blue background for info type', () => {
        const { container } = render(<Alert type="info" message="Info" />);
        expect(container.firstChild.className).toMatch(/bg-blue-50/);
    });

    test('close button icon shows "close" text', () => {
        render(<Alert type="info" message="Close me" onClose={vi.fn()} />);
        const icons = document.querySelectorAll('.material-symbols-outlined');
        const iconTexts = Array.from(icons).map(el => el.textContent);
        expect(iconTexts).toContain('close');
    });

    test('uses info config as fallback for unknown type', () => {
        render(<Alert type="unknown_type" message="Fallback" />);
        const { container } = render(<Alert type="unknown_type" message="Fallback" />);
        // Falls back to info (blue)
        expect(container.firstChild.className).toMatch(/bg-blue-50/);
    });
});
