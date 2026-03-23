import { Button } from '../../common/Button';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';

export const ApproveStep2 = ({
    documentName,
    note,
    onBack,
    onConfirm,
    isSubmitting,
}) => {
    return (
        <div className="space-y-5">
            <div className="rounded-lg bg-[#F7F8FA] p-4">
                <div className="mb-2 flex items-center gap-2">
                    <FactCheckOutlinedIcon className="text-[#050C9C]" fontSize="small" />
                    <p className="text-xl font-bold text-gray-800">ยืนยันการอนุมัติเอกสาร</p>
                </div>
                <p className="text-lg text-gray-700">เอกสาร: {documentName}</p>
                <p className="mt-2 text-lg text-gray-700 break-words">หมายเหตุ: {note?.trim() || '-'}</p>
            </div>

            <div className="flex justify-end gap-3">
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="text-xl"
                >
                    ย้อนกลับ
                </Button>
                <Button
                    type="button"
                    variant="success"
                    size="sm"
                    onClick={onConfirm}
                    disabled={isSubmitting}
                    className="text-xl"
                >
                    {isSubmitting ? 'กำลังยืนยัน...' : 'ยืนยันอนุมัติ'}
                </Button>
            </div>
        </div>
    );
};

export default ApproveStep2;
