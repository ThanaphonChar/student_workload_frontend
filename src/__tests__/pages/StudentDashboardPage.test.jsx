import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// ── Service mocks ─────────────────────────────────────────────────────────────
vi.mock('../../services/dashboardService', () => ({
    getStudentTermSubjects: vi.fn(),
    default: {
        getStudentTermSubjects: vi.fn(),
    },
}));

vi.mock('../../services/termService', () => ({
    getAllTerms: vi.fn(),
}));

// ── Layout / common mocks ─────────────────────────────────────────────────────
vi.mock('../../components/layout/AppShell', () => ({
    default: ({ children }) => <div data-testid="app-shell">{children}</div>,
    AppShell: ({ children }) => <div data-testid="app-shell">{children}</div>,
}));

vi.mock('../../components/common/DropdownMenu', () => ({
    DropdownMenu: ({ trigger, items }) => (
        <div data-testid="dropdown">
            {trigger}
            <ul>
                {items?.map((item) => (
                    <li key={item.id ?? 'null'}>
                        <button onClick={item.onClick} data-testid={`dropdown-item-${item.id ?? 'all'}`}>
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    ),
}));

// ── MUI icon mocks ────────────────────────────────────────────────────────────
vi.mock('@mui/icons-material/ExpandMore', () => ({
    default: () => <span />,
}));

// ── Chart mocks (recharts + shadcn chart wrappers) ────────────────────────────
vi.mock('@/components/ui/chart', () => ({
    ChartContainer: ({ children }) => <div data-testid="chart-container">{children}</div>,
    ChartTooltip: () => null,
    ChartTooltipContent: () => null,
}));

vi.mock('@/components/ui/card', () => ({
    Card: ({ children }) => <div data-testid="card">{children}</div>,
    CardContent: ({ children }) => <div>{children}</div>,
    CardHeader: ({ children }) => <div>{children}</div>,
    CardTitle: ({ children }) => <div>{children}</div>,
    CardDescription: ({ children }) => <div>{children}</div>,
}));

vi.mock('recharts', () => ({
    AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
    Area: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
}));

import * as dashboardService from '../../services/dashboardService';
import { getAllTerms } from '../../services/termService';
import StudentDashboardPage from '../../pages/dashboard/StudentDashboardPage';

// ── Factory helpers ───────────────────────────────────────────────────────────
const makeTerm = (id, isActive = false, year = 1, sector = 1) => ({
    id,
    academic_year: year,
    academic_sector: sector,
    is_active: isActive,
});

const makeSubject = (id, yearIds = [1]) => ({
    id,
    code_eng: `CS${id}`,
    code_th: null,
    name_th: `วิชา ${id}`,
    name_eng: null,
    student_year_ids: yearIds,
    weekly_hours: [1, 2, 3],
    workload_count: 5,
    total_hours: 10,
});

beforeEach(() => {
    vi.clearAllMocks();
});

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('StudentDashboardPage', () => {
    test('shows loading spinner while fetching', async () => {
        // Never resolves to keep loading state
        getAllTerms.mockReturnValue(new Promise(() => {}));

        render(<StudentDashboardPage />);

        expect(screen.getByText(/กำลังโหลดข้อมูล/)).toBeInTheDocument();
    });

    test('shows error message when getAllTerms throws', async () => {
        getAllTerms.mockRejectedValueOnce(new Error('Network error'));

        render(<StudentDashboardPage />);

        await waitFor(() => {
            expect(screen.getByText(/Network error/)).toBeInTheDocument();
        });
    });

    test('shows error when getAllTerms returns empty array', async () => {
        getAllTerms.mockResolvedValueOnce([]);

        render(<StudentDashboardPage />);

        await waitFor(() => {
            expect(screen.getByText(/ไม่พบข้อมูลภาคการศึกษา/)).toBeInTheDocument();
        });
    });

    test('shows error when getStudentTermSubjects throws', async () => {
        getAllTerms.mockResolvedValueOnce([makeTerm(1, true)]);
        dashboardService.getStudentTermSubjects.mockRejectedValueOnce(
            new Error('ไม่สามารถโหลดข้อมูลรายวิชา')
        );

        render(<StudentDashboardPage />);

        await waitFor(() => {
            expect(screen.getByText(/ไม่สามารถโหลดข้อมูลรายวิชา/)).toBeInTheDocument();
        });
    });

    test('renders subject chips after successful fetch', async () => {
        const subjects = [makeSubject(1), makeSubject(2)];
        getAllTerms.mockResolvedValueOnce([makeTerm(1, true)]);
        dashboardService.getStudentTermSubjects.mockResolvedValueOnce(subjects);

        render(<StudentDashboardPage />);

        // CS1/CS2 appear in both SubjectChips (button) and SubjectList (div) — use role to target chip
        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'CS1' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'CS2' })).toBeInTheDocument();
        });
    });

    test('all chips are selected by default after fetch', async () => {
        const subjects = [makeSubject(1), makeSubject(2), makeSubject(3)];
        getAllTerms.mockResolvedValueOnce([makeTerm(1, true)]);
        dashboardService.getStudentTermSubjects.mockResolvedValueOnce(subjects);

        render(<StudentDashboardPage />);

        await waitFor(() => {
            // StatCards shows selected count = 3
            expect(screen.getByText('3')).toBeInTheDocument();
        });
    });

    test("'ทั้งหมด' chip deselects all when all are selected", async () => {
        const subjects = [makeSubject(1), makeSubject(2)];
        getAllTerms.mockResolvedValueOnce([makeTerm(1, true)]);
        dashboardService.getStudentTermSubjects.mockResolvedValueOnce(subjects);

        render(<StudentDashboardPage />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'CS1' })).toBeInTheDocument();
        });

        // All are selected initially; clicking ทั้งหมด deselects all
        fireEvent.click(screen.getByText('ทั้งหมด'));

        await waitFor(() => {
            // selected count drops to 0 (multiple '0' elements may exist — just verify presence)
            expect(screen.getAllByText('0')[0]).toBeInTheDocument();
        });
    });

    test('toggling a chip updates the selected count', async () => {
        const subjects = [makeSubject(1), makeSubject(2)];
        getAllTerms.mockResolvedValueOnce([makeTerm(1, true)]);
        dashboardService.getStudentTermSubjects.mockResolvedValueOnce(subjects);

        render(<StudentDashboardPage />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'CS1' })).toBeInTheDocument();
        });

        // Initially both selected → count = 2
        expect(screen.getByText('2')).toBeInTheDocument();

        // Deselect CS1
        fireEvent.click(screen.getByRole('button', { name: 'CS1' }));

        await waitFor(() => {
            expect(screen.getByText('1')).toBeInTheDocument();
        });
    });

    test('chart renders without crashing when subjects are selected', async () => {
        const subjects = [makeSubject(1)];
        getAllTerms.mockResolvedValueOnce([makeTerm(1, true)]);
        dashboardService.getStudentTermSubjects.mockResolvedValueOnce(subjects);

        render(<StudentDashboardPage />);

        await waitFor(() => {
            expect(screen.getByTestId('chart-container')).toBeInTheDocument();
        });
    });

    test('year filter shows only subjects matching that year', async () => {
        const subjects = [
            makeSubject(1, [1]),   // year 1
            makeSubject(2, [2]),   // year 2
        ];
        getAllTerms.mockResolvedValueOnce([makeTerm(1, true)]);
        dashboardService.getStudentTermSubjects.mockResolvedValueOnce(subjects);

        render(<StudentDashboardPage />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'CS1' })).toBeInTheDocument();
        });

        // Click year 1 from the year dropdown (first dropdown-item-1; the term dropdown also has one)
        fireEvent.click(screen.getAllByTestId('dropdown-item-1')[0]);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'CS1' })).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'CS2' })).not.toBeInTheDocument();
        });
    });

    test('switching year adds those subjects to selectedIds', async () => {
        const subjects = [
            makeSubject(1, [1]),
            makeSubject(2, [2]),
            makeSubject(3, [2]),
        ];
        getAllTerms.mockResolvedValueOnce([makeTerm(1, true)]);
        dashboardService.getStudentTermSubjects.mockResolvedValueOnce(subjects);

        render(<StudentDashboardPage />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'CS1' })).toBeInTheDocument();
        });

        // Switch to year 2 — should select year 2 subjects (count = 2)
        fireEvent.click(screen.getByTestId('dropdown-item-2'));

        await waitFor(() => {
            expect(screen.getByText('2')).toBeInTheDocument();
        });
    });

    test('uses active term by default when available', async () => {
        const terms = [makeTerm(1, false), makeTerm(2, true)];
        dashboardService.getStudentTermSubjects.mockResolvedValue([]);
        getAllTerms.mockResolvedValueOnce(terms);

        render(<StudentDashboardPage />);

        await waitFor(() => {
            // getStudentTermSubjects called with the active term's id (2)
            expect(dashboardService.getStudentTermSubjects).toHaveBeenCalledWith(2);
        });
    });

    test('falls back to first term when no active term', async () => {
        const terms = [makeTerm(10, false), makeTerm(11, false)];
        dashboardService.getStudentTermSubjects.mockResolvedValue([]);
        getAllTerms.mockResolvedValueOnce(terms);

        render(<StudentDashboardPage />);

        await waitFor(() => {
            expect(dashboardService.getStudentTermSubjects).toHaveBeenCalledWith(10);
        });
    });
});
