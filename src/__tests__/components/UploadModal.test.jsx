// import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
// import { UploadModal } from '../../components/MySubjects/UploadModal/index';

// vi.mock('../../services/submission.service', () => ({
//     submitDocument: vi.fn(),
// }));

// vi.mock('@mui/icons-material/UploadFileRounded', () => ({
//     default: () => <span data-testid="icon-upload-file" />,
// }));
// vi.mock('@mui/icons-material/CloseRounded', () => ({
//     default: () => <span data-testid="icon-close" />,
// }));

// // Mock LoadingSpinner so we can detect it in the DOM
// vi.mock('../../components/common/LoadingSpinner', () => ({
//     LoadingSpinner: () => <span data-testid="loading-spinner" />,
// }));

// // Mock UploadSuccess
// vi.mock('../../components/MySubjects/UploadModal/UploadSuccess', () => ({
//     UploadSuccess: ({ onClose }) => (
//         <div data-testid="upload-success">
//             <button onClick={onClose}>Close</button>
//         </div>
//     ),
// }));

// import { submitDocument } from '../../services/submission.service';

// const defaultProps = {
//     isOpen: true,
//     onClose: vi.fn(),
//     termSubjectId: 1,
//     subjectCode: 'CS101',
//     subjectName: 'Intro to CS',
//     documentType: 'outline',
//     onSuccess: vi.fn(),
// };

// const makePdfFile = (name = 'test.pdf', size = 1024) =>
//     new File(['content'], name, { type: 'application/pdf' });

// const makeOversizedFile = () =>
//     Object.defineProperty(new File(['x'], 'big.pdf', { type: 'application/pdf' }), 'size', {
//         value: 11 * 1024 * 1024,
//     });

// beforeEach(() => {
//     vi.clearAllMocks();
//     defaultProps.onClose.mockReset();
//     defaultProps.onSuccess.mockReset();
// });

// describe('UploadModal', () => {
//     test('does not render modal content when isOpen is false', () => {
//         render(<UploadModal {...defaultProps} isOpen={false} />);
//         expect(screen.queryByText('CS101')).not.toBeInTheDocument();
//     });

//     test('renders modal with document type label when isOpen is true', () => {
//         render(<UploadModal {...defaultProps} />);
//         expect(screen.getByText(/ส่งเอกสาร/)).toBeInTheDocument();
//     });

//     test('shows เค้าโครงรายวิชา label when documentType is outline', () => {
//         render(<UploadModal {...defaultProps} documentType="outline" />);
//         expect(screen.getByText(/เค้าโครงรายวิชา/)).toBeInTheDocument();
//     });

//     test('shows รายงานผล label when documentType is report', () => {
//         render(<UploadModal {...defaultProps} documentType="report" />);
//         expect(screen.getByText(/รายงานผล/)).toBeInTheDocument();
//     });

//     test('shows subject code and name in modal', () => {
//         render(<UploadModal {...defaultProps} />);
//         expect(screen.getByText('CS101')).toBeInTheDocument();
//         expect(screen.getByText('Intro to CS')).toBeInTheDocument();
//     });

//     test('shows error when submit clicked with no file selected', async () => {
//         render(<UploadModal {...defaultProps} />);
//         const submitBtn = screen.getByText('ส่งเอกสาร');
//         fireEvent.click(submitBtn);
//         await waitFor(() => {
//             expect(screen.getByText('กรุณาเลือกไฟล์ก่อน')).toBeInTheDocument();
//         });
//     });

//     test('shows error when file type is not PDF/DOC/DOCX', async () => {
//         render(<UploadModal {...defaultProps} />);
//         const input = document.querySelector('input[type="file"]');
//         const badFile = new File(['x'], 'image.png', { type: 'image/png' });
//         fireEvent.change(input, { target: { files: [badFile] } });

//         const submitBtn = screen.getByText('ส่งเอกสาร');
//         fireEvent.click(submitBtn);
//         await waitFor(() => {
//             expect(screen.getByText(/PDF, DOC, DOCX/)).toBeInTheDocument();
//         });
//     });

//     test('shows error when file size exceeds 10MB', async () => {
//         render(<UploadModal {...defaultProps} />);
//         const input = document.querySelector('input[type="file"]');
//         fireEvent.change(input, { target: { files: [makeOversizedFile()] } });

//         const submitBtn = screen.getByText('ส่งเอกสาร');
//         fireEvent.click(submitBtn);
//         await waitFor(() => {
//             expect(screen.getByText(/10MB/)).toBeInTheDocument();
//         });
//     });

//     test('calls submitDocument with correct params when valid file selected', async () => {
//         submitDocument.mockResolvedValueOnce({ id: 1 });
//         render(<UploadModal {...defaultProps} />);

//         const input = document.querySelector('input[type="file"]');
//         const file = makePdfFile();
//         fireEvent.change(input, { target: { files: [file] } });

//         fireEvent.click(screen.getByText('ส่งเอกสาร'));

//         await waitFor(() => {
//             expect(submitDocument).toHaveBeenCalledWith({
//                 termSubjectId: 1,
//                 documentType: 'outline',
//                 file,
//             });
//         });
//     });

//     test('shows loading spinner during submission', async () => {
//         let resolveSubmit;
//         submitDocument.mockReturnValueOnce(new Promise((res) => { resolveSubmit = res; }));

//         render(<UploadModal {...defaultProps} />);
//         const input = document.querySelector('input[type="file"]');
//         fireEvent.change(input, { target: { files: [makePdfFile()] } });

//         fireEvent.click(screen.getByText('ส่งเอกสาร'));

//         await waitFor(() => {
//             expect(screen.getByText('กำลังส่ง...')).toBeInTheDocument();
//         });

//         await act(async () => { resolveSubmit({ id: 1 }); });
//     });

//     test('calls onSuccess after successful submission', async () => {
//         vi.useFakeTimers();
//         submitDocument.mockResolvedValueOnce({ id: 1 });

//         render(<UploadModal {...defaultProps} />);
//         const input = document.querySelector('input[type="file"]');
//         fireEvent.change(input, { target: { files: [makePdfFile()] } });
//         fireEvent.click(screen.getByText('ส่งเอกสาร'));

//         await act(async () => {
//             await Promise.resolve(); // flush microtasks
//             vi.advanceTimersByTime(1500);
//         });

//         expect(defaultProps.onSuccess).toHaveBeenCalledTimes(1);
//         vi.useRealTimers();
//     });

//     test('calls onClose after successful submission', async () => {
//         vi.useFakeTimers();
//         submitDocument.mockResolvedValueOnce({ id: 1 });

//         render(<UploadModal {...defaultProps} />);
//         const input = document.querySelector('input[type="file"]');
//         fireEvent.change(input, { target: { files: [makePdfFile()] } });
//         fireEvent.click(screen.getByText('ส่งเอกสาร'));

//         await act(async () => {
//             await Promise.resolve();
//             vi.advanceTimersByTime(1500);
//         });

//         expect(defaultProps.onClose).toHaveBeenCalled();
//         vi.useRealTimers();
//     });

//     test('shows error message when submitDocument throws', async () => {
//         submitDocument.mockRejectedValueOnce({ message: 'เกิดข้อผิดพลาดในการส่งเอกสาร' });

//         render(<UploadModal {...defaultProps} />);
//         const input = document.querySelector('input[type="file"]');
//         fireEvent.change(input, { target: { files: [makePdfFile()] } });
//         fireEvent.click(screen.getByText('ส่งเอกสาร'));

//         await waitFor(() => {
//             expect(screen.getByText('เกิดข้อผิดพลาดในการส่งเอกสาร')).toBeInTheDocument();
//         });
//     });

//     test('resets state when modal is closed and reopened', async () => {
//         const { rerender } = render(<UploadModal {...defaultProps} isOpen={true} />);

//         // Select a file
//         const input = document.querySelector('input[type="file"]');
//         fireEvent.change(input, { target: { files: [makePdfFile()] } });
//         expect(screen.getByText('test.pdf')).toBeInTheDocument();

//         // Close modal
//         rerender(<UploadModal {...defaultProps} isOpen={false} />);
//         // Reopen modal
//         rerender(<UploadModal {...defaultProps} isOpen={true} />);

//         // File preview should be gone
//         expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
//     });

//     test('ยกเลิก button calls onClose', () => {
//         render(<UploadModal {...defaultProps} />);
//         fireEvent.click(screen.getByText('ยกเลิก'));
//         expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
//     });
// });
