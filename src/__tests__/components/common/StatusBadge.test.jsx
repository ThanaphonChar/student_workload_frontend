import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { StatusBadge } from '../../../components/common/StatusBadge.jsx';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('StatusBadge', () => {
    // Term status tests
    test('renders "ดำเนินการ" for ongoing term status', () => {
        render(<StatusBadge status="ongoing" type="term" />);
        expect(screen.getByText('ดำเนินการ')).toBeInTheDocument();
    });

    test('renders "สิ้นสุด" for ended term status', () => {
        render(<StatusBadge status="ended" type="term" />);
        expect(screen.getByText('สิ้นสุด')).toBeInTheDocument();
    });

    test('defaults to term type when no type is provided', () => {
        render(<StatusBadge status="ongoing" />);
        expect(screen.getByText('ดำเนินการ')).toBeInTheDocument();
    });

    // Approval status tests
    test('renders "รออนุมัติ" for pending approval status', () => {
        render(<StatusBadge status="pending" type="approval" />);
        expect(screen.getByText('รออนุมัติ')).toBeInTheDocument();
    });

    test('renders "อนุมัติแล้ว" for approved approval status', () => {
        render(<StatusBadge status="approved" type="approval" />);
        expect(screen.getByText('อนุมัติแล้ว')).toBeInTheDocument();
    });

    test('renders "ไม่อนุมัติ" for rejected approval status', () => {
        render(<StatusBadge status="rejected" type="approval" />);
        expect(screen.getByText('ไม่อนุมัติ')).toBeInTheDocument();
    });

    // Unknown status fallback
    test('renders raw status when status is unknown', () => {
        render(<StatusBadge status="unknown_status" type="term" />);
        expect(screen.getByText('unknown_status')).toBeInTheDocument();
    });

    test('renders raw status when approval status is unknown', () => {
        render(<StatusBadge status="custom_status" type="approval" />);
        expect(screen.getByText('custom_status')).toBeInTheDocument();
    });

    // Renders as span element
    test('renders as a span element', () => {
        render(<StatusBadge status="ongoing" type="term" />);
        const badge = screen.getByText('ดำเนินการ');
        expect(badge.tagName.toLowerCase()).toBe('span');
    });

    // Green color for ongoing
    test('applies green color classes for ongoing status', () => {
        render(<StatusBadge status="ongoing" type="term" />);
        const badge = screen.getByText('ดำเนินการ');
        expect(badge.className).toMatch(/bg-green-50/);
        expect(badge.className).toMatch(/text-green-700/);
    });

    // Gray color for ended
    test('applies gray color classes for ended status', () => {
        render(<StatusBadge status="ended" type="term" />);
        const badge = screen.getByText('สิ้นสุด');
        expect(badge.className).toMatch(/bg-gray-50/);
        expect(badge.className).toMatch(/text-gray-700/);
    });

    // Fallback colors for unknown status
    test('applies fallback gray colors for unknown status', () => {
        render(<StatusBadge status="UNKNOWN" type="term" />);
        const badge = screen.getByText('UNKNOWN');
        expect(badge.className).toMatch(/bg-gray-50/);
    });

    // Green color for approved
    test('applies green color classes for approved status', () => {
        render(<StatusBadge status="approved" type="approval" />);
        const badge = screen.getByText('อนุมัติแล้ว');
        expect(badge.className).toMatch(/bg-green-50/);
    });

    // Red color for rejected
    test('applies red color classes for rejected status', () => {
        render(<StatusBadge status="rejected" type="approval" />);
        const badge = screen.getByText('ไม่อนุมัติ');
        expect(badge.className).toMatch(/bg-red-50/);
    });
});
