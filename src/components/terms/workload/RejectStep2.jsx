import { Button } from '../../common/Button';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';

export const RejectStep2 = ({
    documentName,
    reason,
    onBack,
    onConfirm,
    isSubmitting,
}) => {
    return (
        <div className="space-y-5">
            <div className="rounded-lg bg-[#FBE9E9] p-4">
                <div className="mb-2 flex items-center gap-2">
                    <RateReviewOutlinedIcon className="text-[#DC2626]" fontSize="small" />
                    <p className="text-xl font-bold text-gray-800">ตรวจสอบก่อนยืนยันการปฏิเสธ</p>
                </div>
                <p className="text-lg text-gray-700">เอกสาร: {documentName}</p>
                <p className="mt-2 text-lg text-gray-700 whitespace-pre-wrap break-words">{reason}</p>
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
                    variant="danger"
                    size="sm"
                    onClick={onConfirm}
                    disabled={isSubmitting}
                    className="text-xl"
                >
                    {isSubmitting ? 'กำลังยืนยัน...' : 'ยืนยันปฏิเสธ'}
                </Button>
            </div>
        </div>
    );
};

export default RejectStep2;
