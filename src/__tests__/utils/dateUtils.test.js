import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

import {
    formatThaiDate,
    parseDate,
    formatDateToString,
    formatDateThai,
    formatDateForInput,
    calculateTermStatus,
    getDaysUntilDeadline,
    calcDeadline,
    daysUntil,
    calculateSyllabusDeadline,
    checkSyllabusWarning,
    isDateRangeValid,
    isExamPeriodWithinTerm,
    getBuddhistYear,
    formatDateRange,
} from '../../utils/dateUtils.js';

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

/** Build a Date object at midnight LOCAL time from year/month/day. */
const localDate = (year, month, day) => new Date(year, month - 1, day);

/** Freeze Date.now() and `new Date()` to a specific local date. */
const freezeToday = (year, month, day) => {
    const frozenMs = localDate(year, month, day).getTime();
    vi.useFakeTimers();
    vi.setSystemTime(frozenMs);
};

beforeEach(() => {
    vi.restoreAllMocks();
});

afterEach(() => {
    vi.useRealTimers();
});

// ────────────────────────────────────────────────────────────────────────────
// formatThaiDate
// ────────────────────────────────────────────────────────────────────────────

describe('formatThaiDate', () => {
    test('returns non-empty string for a valid Date', () => {
        const date = localDate(2024, 8, 8); // 8 Aug 2024
        const result = formatThaiDate(date);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    test('contains Buddhist year (CE + 543) in the output', () => {
        const date = localDate(2024, 1, 1);
        const result = formatThaiDate(date);
        // 2024 + 543 = 2567
        expect(result).toContain('2567');
    });

    test('returns empty string for null input', () => {
        expect(formatThaiDate(null)).toBe('');
    });

    test('returns empty string for undefined input', () => {
        expect(formatThaiDate(undefined)).toBe('');
    });

    test('returns empty string when argument is not a Date instance', () => {
        expect(formatThaiDate('2024-08-08')).toBe('');
        expect(formatThaiDate(20240808)).toBe('');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// parseDate
// ────────────────────────────────────────────────────────────────────────────

describe('parseDate', () => {
    test('returns null for empty string', () => {
        expect(parseDate('')).toBeNull();
    });

    test('returns null for null input', () => {
        expect(parseDate(null)).toBeNull();
    });

    test('returns null for undefined input', () => {
        expect(parseDate(undefined)).toBeNull();
    });

    test('parses YYYY-MM-DD in local timezone (no UTC shift)', () => {
        const result = parseDate('2024-08-08');
        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(7); // August => month index 7
        expect(result.getDate()).toBe(8);
    });

    test('parses ISO string with time component', () => {
        const result = parseDate('2024-08-08T12:00:00Z');
        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2024);
    });

    test('parses another valid YYYY-MM-DD date correctly', () => {
        const result = parseDate('2025-01-15');
        expect(result.getFullYear()).toBe(2025);
        expect(result.getMonth()).toBe(0); // January
        expect(result.getDate()).toBe(15);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// formatDateToString
// ────────────────────────────────────────────────────────────────────────────

describe('formatDateToString', () => {
    test('formats a Date to YYYY-MM-DD', () => {
        expect(formatDateToString(localDate(2024, 8, 8))).toBe('2024-08-08');
    });

    test('pads month and day with leading zeros', () => {
        expect(formatDateToString(localDate(2024, 1, 5))).toBe('2024-01-05');
    });

    test('returns empty string for null', () => {
        expect(formatDateToString(null)).toBe('');
    });

    test('returns empty string for undefined', () => {
        expect(formatDateToString(undefined)).toBe('');
    });

    test('returns empty string for an invalid Date (NaN)', () => {
        expect(formatDateToString(new Date('invalid'))).toBe('');
    });

    test('returns empty string for a plain string argument', () => {
        expect(formatDateToString('2024-08-08')).toBe('');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// formatDateThai
// ────────────────────────────────────────────────────────────────────────────

describe('formatDateThai', () => {
    test('formats a Date object as DD/MM/YYYY (BE)', () => {
        const result = formatDateThai(localDate(2024, 8, 8));
        expect(result).toBe('08/08/2567');
    });

    test('accepts a YYYY-MM-DD string', () => {
        const result = formatDateThai('2024-01-15');
        expect(result).toBe('15/01/2567');
    });

    test('returns empty string for null', () => {
        expect(formatDateThai(null)).toBe('');
    });

    test('returns empty string for undefined', () => {
        expect(formatDateThai(undefined)).toBe('');
    });

    test('returns empty string for an invalid date string', () => {
        expect(formatDateThai('not-a-date')).toBe('');
    });

    test('converts CE year to BE year (adds 543)', () => {
        const result = formatDateThai(localDate(2000, 12, 31));
        expect(result).toContain('2543');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// formatDateForInput
// ────────────────────────────────────────────────────────────────────────────

describe('formatDateForInput', () => {
    test('formats a Date object as YYYY-MM-DD', () => {
        expect(formatDateForInput(localDate(2024, 8, 8))).toBe('2024-08-08');
    });

    test('accepts a YYYY-MM-DD string and returns the same value', () => {
        expect(formatDateForInput('2024-08-08')).toBe('2024-08-08');
    });

    test('pads single-digit month and day', () => {
        expect(formatDateForInput(localDate(2025, 3, 5))).toBe('2025-03-05');
    });

    test('returns empty string for null', () => {
        expect(formatDateForInput(null)).toBe('');
    });

    test('returns empty string for undefined', () => {
        expect(formatDateForInput(undefined)).toBe('');
    });

    test('returns empty string for an invalid date string', () => {
        expect(formatDateForInput('garbage')).toBe('');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// calculateTermStatus
// ────────────────────────────────────────────────────────────────────────────

describe('calculateTermStatus', () => {
    test('returns "ended" when no endDate is provided', () => {
        expect(calculateTermStatus(null)).toBe('ended');
        expect(calculateTermStatus(undefined)).toBe('ended');
    });

    test('returns "ongoing" when endDate is today', () => {
        freezeToday(2024, 8, 8);
        expect(calculateTermStatus(localDate(2024, 8, 8))).toBe('ongoing');
    });

    test('returns "ongoing" when endDate is in the future', () => {
        freezeToday(2024, 8, 8);
        expect(calculateTermStatus(localDate(2024, 12, 31))).toBe('ongoing');
    });

    test('returns "ended" when endDate is in the past', () => {
        freezeToday(2024, 8, 8);
        expect(calculateTermStatus(localDate(2024, 8, 7))).toBe('ended');
    });

    test('accepts a YYYY-MM-DD string as endDate', () => {
        freezeToday(2024, 8, 8);
        expect(calculateTermStatus('2024-08-09')).toBe('ongoing');
        expect(calculateTermStatus('2024-08-07')).toBe('ended');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getDaysUntilDeadline
// ────────────────────────────────────────────────────────────────────────────

describe('getDaysUntilDeadline', () => {
    test('returns 0 when no deadline is provided', () => {
        expect(getDaysUntilDeadline(null)).toBe(0);
        expect(getDaysUntilDeadline(undefined)).toBe(0);
    });

    test('returns 0 when deadline is today', () => {
        freezeToday(2024, 8, 8);
        expect(getDaysUntilDeadline(localDate(2024, 8, 8))).toBe(0);
    });

    test('returns positive number when deadline is in the future', () => {
        freezeToday(2024, 8, 8);
        expect(getDaysUntilDeadline(localDate(2024, 8, 10))).toBe(2);
    });

    test('returns negative number when deadline has passed', () => {
        freezeToday(2024, 8, 8);
        expect(getDaysUntilDeadline(localDate(2024, 8, 5))).toBe(-3);
    });

    test('accepts a YYYY-MM-DD string as deadline', () => {
        freezeToday(2024, 8, 8);
        expect(getDaysUntilDeadline('2024-08-15')).toBe(7);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// calcDeadline
// ────────────────────────────────────────────────────────────────────────────

describe('calcDeadline', () => {
    test('adds offsetDays to the given start date', () => {
        const result = calcDeadline('2024-08-01', 10);
        expect(result).toBeInstanceOf(Date);
        expect(result.getDate()).toBe(11);
        expect(result.getMonth()).toBe(7); // August index 7
        expect(result.getFullYear()).toBe(2024);
    });

    test('handles month boundary correctly', () => {
        const result = calcDeadline('2024-08-25', 10);
        // 25 + 10 = Sep 4
        expect(result.getMonth()).toBe(8); // September index 8
        expect(result.getDate()).toBe(4);
    });

    test('handles offset of 0 days', () => {
        const result = calcDeadline('2024-08-08', 0);
        expect(result.getDate()).toBe(8);
        expect(result.getMonth()).toBe(7);
    });

    test('handles negative offset (subtracting days)', () => {
        const result = calcDeadline('2024-08-10', -3);
        expect(result.getDate()).toBe(7);
        expect(result.getMonth()).toBe(7);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// daysUntil
// ────────────────────────────────────────────────────────────────────────────

describe('daysUntil', () => {
    test('returns 0 when deadline is today', () => {
        freezeToday(2024, 8, 8);
        expect(daysUntil(localDate(2024, 8, 8))).toBe(0);
    });

    test('returns positive value when deadline is in the future', () => {
        freezeToday(2024, 8, 8);
        expect(daysUntil(localDate(2024, 8, 15))).toBe(7);
    });

    test('returns negative value when deadline has passed', () => {
        freezeToday(2024, 8, 8);
        expect(daysUntil(localDate(2024, 8, 1))).toBe(-7);
    });

    test('accepts a Date object', () => {
        freezeToday(2024, 8, 8);
        const deadline = localDate(2024, 8, 10);
        expect(daysUntil(deadline)).toBe(2);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// calculateSyllabusDeadline
// ────────────────────────────────────────────────────────────────────────────

describe('calculateSyllabusDeadline', () => {
    test('returns null when no midtermStartDate provided', () => {
        expect(calculateSyllabusDeadline(null)).toBeNull();
        expect(calculateSyllabusDeadline(undefined)).toBeNull();
    });

    test('returns a Date 7 days before the midterm start (Date input)', () => {
        const midterm = localDate(2024, 9, 15); // Sep 15
        const deadline = calculateSyllabusDeadline(midterm);
        expect(deadline).toBeInstanceOf(Date);
        expect(deadline.getDate()).toBe(8); // Sep 8
        expect(deadline.getMonth()).toBe(8); // September index 8
    });

    test('accepts a YYYY-MM-DD string', () => {
        const deadline = calculateSyllabusDeadline('2024-09-15');
        expect(deadline).toBeInstanceOf(Date);
        // 7 days before Sep 15 => Sep 8
        expect(deadline.getDate()).toBe(8);
        expect(deadline.getMonth()).toBe(8);
    });

    test('crosses month boundary correctly', () => {
        // 7 days before Aug 5 => Jul 29
        const deadline = calculateSyllabusDeadline(localDate(2024, 8, 5));
        expect(deadline.getMonth()).toBe(6); // July index 6
        expect(deadline.getDate()).toBe(29);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// checkSyllabusWarning
// ────────────────────────────────────────────────────────────────────────────

describe('checkSyllabusWarning', () => {
    test('returns null when no midtermStartDate provided', () => {
        expect(checkSyllabusWarning(null)).toBeNull();
        expect(checkSyllabusWarning(undefined)).toBeNull();
    });

    test('returns object with show: true when daysRemaining is in [8, 15]', () => {
        // WARNING_DAYS.SYLLABUS_SUBMIT = 7, so deadline = midterm - 7.
        // We want daysRemaining = 10 => today = deadline - 10.
        // midterm = today + 7 + 10 = today + 17
        freezeToday(2024, 8, 1);
        const midterm = localDate(2024, 8, 1 + 17); // Aug 18
        const result = checkSyllabusWarning(midterm);
        expect(result.show).toBe(true);
        expect(result.daysRemaining).toBe(10);
        expect(result.deadline).toBeInstanceOf(Date);
        expect(typeof result.deadlineFormatted).toBe('string');
    });

    test('returns object with show: false when daysRemaining is less than 8', () => {
        // daysRemaining = 5 => today = deadline - 5 => midterm = today + 12
        freezeToday(2024, 8, 1);
        const midterm = localDate(2024, 8, 1 + 12); // Aug 13
        const result = checkSyllabusWarning(midterm);
        expect(result.show).toBe(false);
    });

    test('returns object with show: false when daysRemaining is greater than 15', () => {
        // daysRemaining = 20 => midterm = today + 7 + 20 = today + 27
        freezeToday(2024, 8, 1);
        const midterm = localDate(2024, 8, 1 + 27); // Aug 28
        const result = checkSyllabusWarning(midterm);
        expect(result.show).toBe(false);
    });

    test('result contains deadline, daysRemaining, deadlineFormatted keys', () => {
        freezeToday(2024, 8, 1);
        const midterm = localDate(2024, 8, 18);
        const result = checkSyllabusWarning(midterm);
        expect(result).toHaveProperty('show');
        expect(result).toHaveProperty('deadline');
        expect(result).toHaveProperty('daysRemaining');
        expect(result).toHaveProperty('deadlineFormatted');
    });
});

// ────────────────────────────────────────────────────────────────────────────
// isDateRangeValid
// ────────────────────────────────────────────────────────────────────────────

describe('isDateRangeValid', () => {
    test('returns false when startDate is missing', () => {
        expect(isDateRangeValid(null, localDate(2024, 8, 10))).toBe(false);
    });

    test('returns false when endDate is missing', () => {
        expect(isDateRangeValid(localDate(2024, 8, 1), null)).toBe(false);
    });

    test('returns false when both are missing', () => {
        expect(isDateRangeValid(null, null)).toBe(false);
    });

    test('returns true when endDate is after startDate', () => {
        expect(isDateRangeValid(localDate(2024, 8, 1), localDate(2024, 8, 10))).toBe(true);
    });

    test('returns true when endDate equals startDate', () => {
        expect(isDateRangeValid(localDate(2024, 8, 8), localDate(2024, 8, 8))).toBe(true);
    });

    test('returns false when endDate is before startDate', () => {
        expect(isDateRangeValid(localDate(2024, 8, 10), localDate(2024, 8, 1))).toBe(false);
    });

    test('accepts YYYY-MM-DD strings', () => {
        expect(isDateRangeValid('2024-08-01', '2024-08-31')).toBe(true);
        expect(isDateRangeValid('2024-08-31', '2024-08-01')).toBe(false);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// isExamPeriodWithinTerm
// ────────────────────────────────────────────────────────────────────────────

describe('isExamPeriodWithinTerm', () => {
    const termStart = localDate(2024, 8, 1);
    const termEnd = localDate(2024, 12, 31);

    test('returns true when exam period is fully inside the term', () => {
        const exStart = localDate(2024, 10, 1);
        const exEnd = localDate(2024, 10, 15);
        expect(isExamPeriodWithinTerm(exStart, exEnd, termStart, termEnd)).toBe(true);
    });

    test('returns true when exam period exactly matches term boundaries', () => {
        expect(isExamPeriodWithinTerm(termStart, termEnd, termStart, termEnd)).toBe(true);
    });

    test('returns false when exam start is before term start', () => {
        const exStart = localDate(2024, 7, 25);
        const exEnd = localDate(2024, 10, 1);
        expect(isExamPeriodWithinTerm(exStart, exEnd, termStart, termEnd)).toBe(false);
    });

    test('returns false when exam end is after term end', () => {
        const exStart = localDate(2024, 10, 1);
        const exEnd = localDate(2025, 1, 15);
        expect(isExamPeriodWithinTerm(exStart, exEnd, termStart, termEnd)).toBe(false);
    });

    test('accepts YYYY-MM-DD strings', () => {
        expect(
            isExamPeriodWithinTerm('2024-10-01', '2024-10-15', '2024-08-01', '2024-12-31')
        ).toBe(true);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// getBuddhistYear
// ────────────────────────────────────────────────────────────────────────────

describe('getBuddhistYear', () => {
    test('returns CE year + 543 for a Date object', () => {
        expect(getBuddhistYear(localDate(2024, 1, 1))).toBe(2567);
    });

    test('returns CE year + 543 for a YYYY-MM-DD string', () => {
        expect(getBuddhistYear('2025-06-15')).toBe(2568);
    });

    test('returns null for null input', () => {
        expect(getBuddhistYear(null)).toBeNull();
    });

    test('returns null for undefined input', () => {
        expect(getBuddhistYear(undefined)).toBeNull();
    });

    test('returns null for an invalid date string', () => {
        expect(getBuddhistYear('not-a-date')).toBeNull();
    });

    test('handles year 2000 correctly', () => {
        expect(getBuddhistYear(localDate(2000, 6, 1))).toBe(2543);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// formatDateRange
// ────────────────────────────────────────────────────────────────────────────

describe('formatDateRange', () => {
    test('returns empty string when startDate is missing', () => {
        expect(formatDateRange(null, localDate(2024, 12, 31))).toBe('');
    });

    test('returns empty string when endDate is missing', () => {
        expect(formatDateRange(localDate(2024, 8, 1), null)).toBe('');
    });

    test('returns empty string when both are missing', () => {
        expect(formatDateRange(null, null)).toBe('');
    });

    test('formats a Date range with Thai month abbreviations and BE years', () => {
        const result = formatDateRange(localDate(2024, 8, 1), localDate(2024, 12, 15));
        // Aug -> ส.ค., Dec -> ธ.ค., 2024 + 543 = 2567
        expect(result).toContain('ส.ค.');
        expect(result).toContain('ธ.ค.');
        expect(result).toContain('2567');
        expect(result).toContain('-');
    });

    test('accepts YYYY-MM-DD strings', () => {
        const result = formatDateRange('2024-08-01', '2024-12-15');
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    test('includes the day numbers in the output', () => {
        const result = formatDateRange(localDate(2024, 8, 1), localDate(2024, 12, 15));
        expect(result).toContain('1');
        expect(result).toContain('15');
    });

    test('formats same-month range correctly', () => {
        const result = formatDateRange(localDate(2024, 8, 1), localDate(2024, 8, 31));
        expect(result.split('ส.ค.').length - 1).toBe(2); // Two occurrences of ส.ค.
    });
});
