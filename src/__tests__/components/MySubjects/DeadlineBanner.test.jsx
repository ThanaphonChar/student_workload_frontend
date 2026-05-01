import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock dateUtils so we can control what dates are returned
vi.mock('../../../utils/dateUtils', () => ({
    parseDate: vi.fn(),
    calcDeadline: vi.fn(),
    daysUntil: vi.fn(),
    formatThaiDate: vi.fn(),
}));

import * as dateUtils from '../../../utils/dateUtils';
import { DeadlineBanner } from '../../../components/MySubjects/DeadlineBanner';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('DeadlineBanner', () => {
    test('renders nothing when termStartDate is not provided', () => {
        const { container } = render(<DeadlineBanner />);
        expect(container.firstChild).toBeNull();
    });

    test('renders nothing when termStartDate is null', () => {
        const { container } = render(<DeadlineBanner termStartDate={null} />);
        expect(container.firstChild).toBeNull();
    });

    test('renders nothing when parseDate returns null', () => {
        dateUtils.parseDate.mockReturnValue(null);
        const { container } = render(<DeadlineBanner termStartDate="2025-01-01" />);
        expect(container.firstChild).toBeNull();
    });

    test('renders nothing when parseDate returns invalid date (NaN)', () => {
        const invalidDate = new Date('invalid');
        dateUtils.parseDate.mockReturnValue(invalidDate);
        const { container } = render(<DeadlineBanner termStartDate="invalid-date" />);
        expect(container.firstChild).toBeNull();
    });

    test('renders banner with days remaining when daysLeft > 0', () => {
        const startDate = new Date(2025, 0, 1);
        const deadline = new Date(2025, 0, 8);
        dateUtils.parseDate.mockReturnValue(startDate);
        dateUtils.calcDeadline.mockReturnValue(deadline);
        dateUtils.daysUntil.mockReturnValue(5);
        dateUtils.formatThaiDate.mockReturnValue('1 มกราคม 2568');

        render(<DeadlineBanner termStartDate="2025-01-01" offsetDays={7} />);

        expect(screen.getByText(/ส่งเค้าโครงรายวิชาภายใน/)).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('วันที่เหลือ')).toBeInTheDocument();
    });

    test('renders overdue banner when daysLeft <= 0', () => {
        const startDate = new Date(2025, 0, 1);
        const deadline = new Date(2025, 0, 8);
        dateUtils.parseDate.mockReturnValue(startDate);
        dateUtils.calcDeadline.mockReturnValue(deadline);
        dateUtils.daysUntil.mockReturnValue(0);
        dateUtils.formatThaiDate.mockReturnValue('8 มกราคม 2568');

        render(<DeadlineBanner termStartDate="2025-01-01" offsetDays={7} />);

        expect(screen.getByText('เลยกำหนดแล้ว')).toBeInTheDocument();
    });

    test('renders overdue banner when daysLeft is negative', () => {
        const startDate = new Date(2025, 0, 1);
        const deadline = new Date(2025, 0, 8);
        dateUtils.parseDate.mockReturnValue(startDate);
        dateUtils.calcDeadline.mockReturnValue(deadline);
        dateUtils.daysUntil.mockReturnValue(-3);
        dateUtils.formatThaiDate.mockReturnValue('8 มกราคม 2568');

        render(<DeadlineBanner termStartDate="2025-01-01" />);

        expect(screen.getByText('เลยกำหนดแล้ว')).toBeInTheDocument();
        expect(screen.queryByText('วันที่เหลือ')).not.toBeInTheDocument();
    });

    test('displays correct formatted dates in description text', () => {
        const startDate = new Date(2025, 0, 1);
        const deadline = new Date(2025, 0, 8);
        dateUtils.parseDate.mockReturnValue(startDate);
        dateUtils.calcDeadline.mockReturnValue(deadline);
        dateUtils.daysUntil.mockReturnValue(5);
        dateUtils.formatThaiDate
            .mockReturnValueOnce('8 มกราคม 2568')   // deadlineText (heading)
            .mockReturnValueOnce('1 มกราคม 2568')   // startDateText
            .mockReturnValueOnce('8 มกราคม 2568');  // deadlineText (description)

        render(<DeadlineBanner termStartDate="2025-01-01" offsetDays={7} />);

        expect(screen.getByText(/7 วันนับจากวันเปิดเทอม/)).toBeInTheDocument();
    });

    test('uses correct offsetDays in description when custom value provided', () => {
        const startDate = new Date(2025, 0, 1);
        const deadline = new Date(2025, 0, 15);
        dateUtils.parseDate.mockReturnValue(startDate);
        dateUtils.calcDeadline.mockReturnValue(deadline);
        dateUtils.daysUntil.mockReturnValue(10);
        dateUtils.formatThaiDate.mockReturnValue('15 มกราคม 2568');

        render(<DeadlineBanner termStartDate="2025-01-01" offsetDays={14} />);

        expect(screen.getByText(/14 วันนับจากวันเปิดเทอม/)).toBeInTheDocument();
    });

    test('calls calcDeadline with termStartDate and offsetDays', () => {
        const startDate = new Date(2025, 0, 1);
        const deadline = new Date(2025, 0, 8);
        dateUtils.parseDate.mockReturnValue(startDate);
        dateUtils.calcDeadline.mockReturnValue(deadline);
        dateUtils.daysUntil.mockReturnValue(5);
        dateUtils.formatThaiDate.mockReturnValue('1 มกราคม 2568');

        render(<DeadlineBanner termStartDate="2025-01-01" offsetDays={7} />);

        expect(dateUtils.calcDeadline).toHaveBeenCalledWith('2025-01-01', 7);
    });

    test('default offsetDays is 7', () => {
        const startDate = new Date(2025, 0, 1);
        const deadline = new Date(2025, 0, 8);
        dateUtils.parseDate.mockReturnValue(startDate);
        dateUtils.calcDeadline.mockReturnValue(deadline);
        dateUtils.daysUntil.mockReturnValue(5);
        dateUtils.formatThaiDate.mockReturnValue('1 มกราคม 2568');

        render(<DeadlineBanner termStartDate="2025-01-01" />);

        expect(dateUtils.calcDeadline).toHaveBeenCalledWith('2025-01-01', 7);
    });

    test('shows exact daysLeft count in badge', () => {
        const startDate = new Date(2025, 0, 1);
        const deadline = new Date(2025, 0, 8);
        dateUtils.parseDate.mockReturnValue(startDate);
        dateUtils.calcDeadline.mockReturnValue(deadline);
        dateUtils.daysUntil.mockReturnValue(12);
        dateUtils.formatThaiDate.mockReturnValue('8 มกราคม 2568');

        render(<DeadlineBanner termStartDate="2025-01-01" />);

        expect(screen.getByText('12')).toBeInTheDocument();
    });
});
