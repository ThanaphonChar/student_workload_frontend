import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner.jsx';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('LoadingSpinner', () => {
    test('renders without crashing', () => {
        const { container } = render(<LoadingSpinner />);
        expect(container.firstChild).toBeInTheDocument();
    });

    test('renders spinner div with animate-spin class', () => {
        const { container } = render(<LoadingSpinner />);
        const spinner = container.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
    });

    test('renders inline (non-fullscreen) by default', () => {
        const { container } = render(<LoadingSpinner />);
        // Default: no fixed positioning
        const fixedEl = container.querySelector('.fixed');
        expect(fixedEl).not.toBeInTheDocument();
    });

    test('renders fullscreen overlay when fullScreen is true', () => {
        const { container } = render(<LoadingSpinner fullScreen={true} />);
        const fixedEl = container.querySelector('.fixed');
        expect(fixedEl).toBeInTheDocument();
    });

    test('shows loading text "กำลังโหลด..." when fullScreen is true', () => {
        render(<LoadingSpinner fullScreen={true} />);
        expect(screen.getByText('กำลังโหลด...')).toBeInTheDocument();
    });

    test('does not show loading text when fullScreen is false', () => {
        render(<LoadingSpinner fullScreen={false} />);
        expect(screen.queryByText('กำลังโหลด...')).not.toBeInTheDocument();
    });

    test('applies small size classes when size="small"', () => {
        const { container } = render(<LoadingSpinner size="small" />);
        const spinner = container.querySelector('.animate-spin');
        expect(spinner.className).toMatch(/w-4/);
        expect(spinner.className).toMatch(/h-4/);
    });

    test('applies medium size classes by default', () => {
        const { container } = render(<LoadingSpinner />);
        const spinner = container.querySelector('.animate-spin');
        expect(spinner.className).toMatch(/w-8/);
        expect(spinner.className).toMatch(/h-8/);
    });

    test('applies large size classes when size="large"', () => {
        const { container } = render(<LoadingSpinner size="large" />);
        const spinner = container.querySelector('.animate-spin');
        expect(spinner.className).toMatch(/w-12/);
        expect(spinner.className).toMatch(/h-12/);
    });

    test('spinner has rounded-full class', () => {
        const { container } = render(<LoadingSpinner />);
        const spinner = container.querySelector('.animate-spin');
        expect(spinner.className).toMatch(/rounded-full/);
    });

    test('fullscreen spinner also shows animate-spin spinner', () => {
        const { container } = render(<LoadingSpinner fullScreen={true} />);
        const spinner = container.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
    });
});
