
import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

export const DocumentStatusBadge = ({ status = null, roundNumber = null, onClick }) => {
    const isEmpty = status === null;

    if (isEmpty) {
        return (
            <button
                type="button"
                onClick={onClick}
                className="inline-flex items-center gap-2 rounded-lg bg-[#DADBF0] px-4 py-1 text-[#050C9C] text-xl font-bold hover:bg-[#c0c2e8] transition-colors"
            >
                <VerticalAlignTopRoundedIcon fontSize="small" className="text-[#050C9C]" />
                <span>อัปโหลด</span>
            </button>
        );
    }

    if (status === 'pending') {
        return (
            <button
                type="button"
                onClick={onClick}
                className="inline-flex items-center gap-2 rounded-full bg-[#FFF5EA] px-4 py-1 text-[#FF8D28] text-xl font-bold hover:bg-[#FFE7CD] transition-colors"
            >

                <span>รออนุมัติ · รอบ {roundNumber || '-'}</span>
            </button>
        );
    }

    if (status === 'approved') {
        return (
            <button
                type="button"
                onClick={onClick}
                className="inline-flex items-center gap-2 rounded-full bg-[#E7F8F2] px-4 py-2 text-[#10B981] text-xl font-bold hover:bg-[#D6FFF0] transition-colors"
            >
                <CheckCircleIcon fontSize="small" />
                <span>อนุมัติแล้ว</span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center gap-2 rounded-full bg-[#FBE9E9] px-4 py-2 text-[#DC2626] text-xl font-bold hover:bg-[#FFD6D6] transition-colors"
        >
            <HighlightOffIcon fontSize="small" />
            <span>ไม่อนุมัติ</span>
        </button>
    );
};

export default DocumentStatusBadge;
