import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';

// ── Service mock ──────────────────────────────────────────────────────────────
vi.mock('../../services/submission.service', () => ({
    submitDocument: vi.fn(),
}));

// ── MUI icon mocks ────────────────────────────────────────────────────────────
vi.mock('@mui/icons-material/UploadFileRounded', () => ({
    default: () => <span data-testid="icon-upload-file" />,
}));
vi.mock('@mui/icons-material/CloseRounded', () => ({
    default: () => <span data-testid="icon-close" />,
}));

// ── Minimal Modal — renders children when open, null when closed ──────────────
vi.mock('../../components/common/Modal', () => ({
    Modal: ({ isOpen, children, title }) =>
        isOpen ? (
            <div data-testid="modal">
                {title && <div data-testid="modal-title">{title}</div>}
                {children}
            </div>
        ) : null,
}));

// ── LoadingSpinner mock ───────────────────────────────────────────────────────
vi.mock('../../components/common/LoadingSpinner', () => ({
    LoadingSpinner: () => <span data-testid="loading-spinner" />,
}));

// ── UploadSuccess mock ────────────────────────────────────────────────────────
vi.mock('../../components/MySubjects/UploadModal/UploadSuccess', () => ({
    UploadSuccess: ({ onClose }) => (
        <div data-testid="upload-success">
            <button onClick={onClose}>Close</button>
        </div>
    ),
}));

import { submitDocument } from '../../services/submission.service';
import { UploadModal } from '../../components/MySubjects/UploadModal/index';

// ── Helpers ───────────────────────────────────────────────────────────────────
const makePdfFile = (name = 'test.pdf') =>
    new File(['content'], name, { type: 'application/pdf' });

const makeOversizedFile = () => {
    const file = new File(['x'], 'big.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 });
    return file;
};

const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    termSubjectId: 1,
    subjectCode: 'CS101',
    subjectName: 'Intro to CS',
    documentType: 'outline',
    onSuccess: vi.fn(),
};

const selectFile = (file) => {
    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [file] } });
};

beforeEach(() => {
    vi.clearAllMocks();
});

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('UploadModal', () => {
    test('does not render when isOpen is false', () => {
        render(<UploadModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    test('renders modal content when isOpen is true', () => {
        render(<UploadModal {...defaultProps} />);
        expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    test("shows 'เค้าโครงรายวิชา' label when documentType is 'outline'", () => {
        render(<UploadModal {...defaultProps} documentType="outline" />);
        expect(screen.getByText(/เค้าโครงรายวิชา/)).toBeInTheDocument();
    });

    test("shows 'รายงานผล' label when documentType is 'report'", () => {
        render(<UploadModal {...defaultProps} documentType="report" />);
        expect(screen.getByText(/รายงานผล/)).toBeInTheDocument();
    });

    test('displays subject code and name', () => {
        render(<UploadModal {...defaultProps} />);
        expect(screen.getByText('CS101')).toBeInTheDocument();
        expect(screen.getByText('Intro to CS')).toBeInTheDocument();
    });

    test('submit button is disabled when no file is selected', () => {
        render(<UploadModal {...defaultProps} />);
        const submitBtn = screen.getByText('ส่งเอกสาร').closest('button');
        expect(submitBtn).toBeDisabled();
    });

    test('shows error when file type is .exe', async () => {
        render(<UploadModal {...defaultProps} />);
        const exeFile = new File(['x'], 'malware.exe', { type: 'application/octet-stream' });
        selectFile(exeFile);

        fireEvent.click(screen.getByText('ส่งเอกสาร').closest('button'));

        await waitFor(() => {
            expect(screen.getByText(/รองรับเฉพาะไฟล์/)).toBeInTheDocument();
        });
    });

    test('shows error when file exceeds 10MB', async () => {
        render(<UploadModal {...defaultProps} />);
        selectFile(makeOversizedFile());

        fireEvent.click(screen.getByText('ส่งเอกสาร').closest('button'));

        await waitFor(() => {
            expect(screen.getByText(/ไฟล์มีขนาดเกิน/)).toBeInTheDocument();
        });
    });

    test('calls submitDocument with correct args on valid file', async () => {
        submitDocument.mockResolvedValueOnce({ id: 1 });
        render(<UploadModal {...defaultProps} />);

        const file = makePdfFile();
        selectFile(file);

        fireEvent.click(screen.getByText('ส่งเอกสาร').closest('button'));

        await waitFor(() => {
            expect(submitDocument).toHaveBeenCalledWith({
                termSubjectId: 1,
                documentType: 'outline',
                file,
            });
        });
    });

    test('shows loading text during submission', async () => {
        let resolveSubmit;
        submitDocument.mockReturnValueOnce(new Promise((res) => { resolveSubmit = res; }));

        render(<UploadModal {...defaultProps} />);
        selectFile(makePdfFile());
        fireEvent.click(screen.getByText('ส่งเอกสาร').closest('button'));

        await waitFor(() => {
            expect(screen.getByText('กำลังส่ง...')).toBeInTheDocument();
        });

        await act(async () => { resolveSubmit({ id: 1 }); });
    });

    test('calls onSuccess after successful submission', async () => {
        vi.useFakeTimers();
        submitDocument.mockResolvedValueOnce({ id: 1 });

        render(<UploadModal {...defaultProps} />);
        selectFile(makePdfFile());
        fireEvent.click(screen.getByText('ส่งเอกสาร').closest('button'));

        await act(async () => {
            await Promise.resolve();
            vi.advanceTimersByTime(1500);
        });

        expect(defaultProps.onSuccess).toHaveBeenCalledTimes(1);
        vi.useRealTimers();
    });

    test('calls onClose after successful submission', async () => {
        vi.useFakeTimers();
        submitDocument.mockResolvedValueOnce({ id: 1 });

        render(<UploadModal {...defaultProps} />);
        selectFile(makePdfFile());
        fireEvent.click(screen.getByText('ส่งเอกสาร').closest('button'));

        await act(async () => {
            await Promise.resolve();
            vi.advanceTimersByTime(1500);
        });

        expect(defaultProps.onClose).toHaveBeenCalled();
        vi.useRealTimers();
    });

    test('shows error message when submitDocument throws', async () => {
        submitDocument.mockRejectedValueOnce({ message: 'เกิดข้อผิดพลาดในการส่งเอกสาร' });

        render(<UploadModal {...defaultProps} />);
        selectFile(makePdfFile());
        fireEvent.click(screen.getByText('ส่งเอกสาร').closest('button'));

        await waitFor(() => {
            expect(screen.getByText('เกิดข้อผิดพลาดในการส่งเอกสาร')).toBeInTheDocument();
        });
    });

    test('shows generic error when submitDocument throws error without message', async () => {
        submitDocument.mockRejectedValueOnce(new Error('network failure'));

        render(<UploadModal {...defaultProps} />);
        selectFile(makePdfFile());
        fireEvent.click(screen.getByText('ส่งเอกสาร').closest('button'));

        await waitFor(() => {
            expect(
                screen.getByText(/network failure|เกิดข้อผิดพลาด/)
            ).toBeInTheDocument();
        });
    });

    test('resets state when modal closes and reopens', async () => {
        const { rerender } = render(<UploadModal {...defaultProps} isOpen={true} />);

        selectFile(makePdfFile('test.pdf'));
        expect(screen.getByText('test.pdf')).toBeInTheDocument();

        // close
        rerender(<UploadModal {...defaultProps} isOpen={false} />);
        // reopen
        rerender(<UploadModal {...defaultProps} isOpen={true} />);

        expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
    });

    test('ยกเลิก button calls onClose', () => {
        render(<UploadModal {...defaultProps} />);
        fireEvent.click(screen.getByText('ยกเลิก'));
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    test('shows file name and size preview after selecting a valid file', () => {
        render(<UploadModal {...defaultProps} />);
        selectFile(makePdfFile('document.pdf'));
        expect(screen.getByText('document.pdf')).toBeInTheDocument();
    });

    test('removes file preview after clicking the X button', async () => {
        render(<UploadModal {...defaultProps} />);
        selectFile(makePdfFile('document.pdf'));
        expect(screen.getByText('document.pdf')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('icon-close').closest('button'));

        await waitFor(() => {
            expect(screen.queryByText('document.pdf')).not.toBeInTheDocument();
        });
    });
});
