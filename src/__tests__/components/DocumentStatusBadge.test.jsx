import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

vi.mock('@mui/icons-material/VerticalAlignTopRounded', () => ({
    default: () => <span data-testid="icon-upload" />,
}));
vi.mock('@mui/icons-material/CheckCircle', () => ({
    default: () => <span data-testid="icon-check" />,
}));
vi.mock('@mui/icons-material/HighlightOff', () => ({
    default: () => <span data-testid="icon-x" />,
}));
vi.mock('@mui/icons-material/HourglassTop', () => ({
    default: () => <span data-testid="icon-hourglass" />,
}));

import { DocumentStatusBadge } from '../../components/MySubjects/DocumentStatusBadge';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('DocumentStatusBadge', () => {
    test('renders upload button when status is null', () => {
        render(<DocumentStatusBadge status={null} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('อัปโหลด')).toBeInTheDocument();
    });

    test("renders 'รอตรวจสอบ' when status is 'pending'", () => {
        render(<DocumentStatusBadge status="pending" />);
        expect(screen.getByText('รอตรวจสอบ')).toBeInTheDocument();
    });

    test("renders 'ผ่าน' when status is 'approved'", () => {
        render(<DocumentStatusBadge status="approved" />);
        expect(screen.getByText('ผ่าน')).toBeInTheDocument();
    });

    test("renders 'ไม่ผ่าน' when status is 'rejected'", () => {
        render(<DocumentStatusBadge status="rejected" />);
        expect(screen.getByText('ไม่ผ่าน')).toBeInTheDocument();
    });

    test('renders a button for every status variant', () => {
        const statuses = [null, 'pending', 'approved', 'rejected'];
        statuses.forEach((status) => {
            const { unmount } = render(<DocumentStatusBadge status={status} />);
            expect(screen.getByRole('button')).toBeInTheDocument();
            unmount();
        });
    });

    test('calls onClick when upload button (status=null) is clicked', () => {
        const onClick = vi.fn();
        render(<DocumentStatusBadge status={null} onClick={onClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('calls onClick when pending badge is clicked', () => {
        const onClick = vi.fn();
        render(<DocumentStatusBadge status="pending" onClick={onClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('calls onClick when approved badge is clicked', () => {
        const onClick = vi.fn();
        render(<DocumentStatusBadge status="approved" onClick={onClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('calls onClick when rejected badge is clicked', () => {
        const onClick = vi.fn();
        render(<DocumentStatusBadge status="rejected" onClick={onClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('does not throw when onClick is undefined', () => {
        render(<DocumentStatusBadge status={null} />);
        expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow();
    });

    test('does not throw when onClick is undefined for approved status', () => {
        render(<DocumentStatusBadge status="approved" />);
        expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow();
    });

    test('defaults status to null when prop is omitted', () => {
        render(<DocumentStatusBadge />);
        expect(screen.getByText('อัปโหลด')).toBeInTheDocument();
    });
});
