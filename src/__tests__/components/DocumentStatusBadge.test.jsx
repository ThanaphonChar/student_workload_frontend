// import { render, screen, fireEvent } from '@testing-library/react';
// import { DocumentStatusBadge } from '../../components/MySubjects/DocumentStatusBadge';

// // MUI icons render as SVGs — mock to avoid any jsdom rendering issues
// vi.mock('@mui/icons-material/VerticalAlignTopRounded', () => ({
//     default: () => <span data-testid="icon-upload" />,
// }));
// vi.mock('@mui/icons-material/CheckCircle', () => ({
//     default: () => <span data-testid="icon-check" />,
// }));
// vi.mock('@mui/icons-material/HighlightOff', () => ({
//     default: () => <span data-testid="icon-x" />,
// }));
// vi.mock('@mui/icons-material/HourglassTop', () => ({
//     default: () => <span data-testid="icon-hourglass" />,
// }));

// describe('DocumentStatusBadge', () => {
//     test('renders upload button when status is null', () => {
//         render(<DocumentStatusBadge status={null} />);
//         expect(screen.getByRole('button')).toBeInTheDocument();
//     });

//     test('upload button contains text อัปโหลด', () => {
//         render(<DocumentStatusBadge status={null} />);
//         expect(screen.getByText('อัปโหลด')).toBeInTheDocument();
//     });

//     test('renders รอตรวจสอบ badge when status is pending', () => {
//         render(<DocumentStatusBadge status="pending" />);
//         expect(screen.getByText('รอตรวจสอบ')).toBeInTheDocument();
//     });

//     test('pending badge shows no round number text', () => {
//         render(<DocumentStatusBadge status="pending" roundNumber={2} />);
//         // Component does not render roundNumber text
//         expect(screen.queryByText(/2/)).not.toBeInTheDocument();
//     });

//     test('renders ผ่าน badge when status is approved', () => {
//         render(<DocumentStatusBadge status="approved" />);
//         expect(screen.getByText('ผ่าน')).toBeInTheDocument();
//     });

//     test('renders ไม่ผ่าน badge when status is rejected', () => {
//         render(<DocumentStatusBadge status="rejected" />);
//         expect(screen.getByText('ไม่ผ่าน')).toBeInTheDocument();
//     });

//     test('calls onClick when upload button is clicked', () => {
//         const mockClick = vi.fn();
//         render(<DocumentStatusBadge status={null} onClick={mockClick} />);
//         fireEvent.click(screen.getByRole('button'));
//         expect(mockClick).toHaveBeenCalledTimes(1);
//     });

//     test('calls onClick when pending badge is clicked', () => {
//         const mockClick = vi.fn();
//         render(<DocumentStatusBadge status="pending" onClick={mockClick} />);
//         fireEvent.click(screen.getByRole('button'));
//         expect(mockClick).toHaveBeenCalledTimes(1);
//     });

//     test('calls onClick when approved badge is clicked', () => {
//         const mockClick = vi.fn();
//         render(<DocumentStatusBadge status="approved" onClick={mockClick} />);
//         fireEvent.click(screen.getByRole('button'));
//         expect(mockClick).toHaveBeenCalledTimes(1);
//     });

//     test('calls onClick when rejected badge is clicked', () => {
//         const mockClick = vi.fn();
//         render(<DocumentStatusBadge status="rejected" onClick={mockClick} />);
//         fireEvent.click(screen.getByRole('button'));
//         expect(mockClick).toHaveBeenCalledTimes(1);
//     });

//     test('does not throw when onClick is not provided', () => {
//         render(<DocumentStatusBadge status={null} />);
//         expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow();
//     });
// });
