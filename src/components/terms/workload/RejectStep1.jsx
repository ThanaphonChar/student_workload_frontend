import { Button } from '../../common/Button';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

export const RejectStep1 = ({
    reason,
    reasonError,
    onReasonChange,
    onCancel,
    onNext,
}) => {
    return (
        <div className="space-y-5">
            <div className="rounded-lg bg-[#FFF5EA] p-4">
                <div className="mb-2 flex items-center gap-2">
                    <WarningAmberOutlinedIcon className="text-[#FF8D28]" fontSize="small" />
                    <p className="text-xl font-bold text-gray-800">กรุณาระบุเหตุผลการปฏิเสธ</p>
                </div>
                <p className="text-lg text-gray-700">เหตุผลนี้จะถูกส่งให้ผู้ส่งเอกสาร</p>
            </div>

            <div>
                <label htmlFor="reject-reason" className="mb-1 block text-xl font-bold text-gray-700">
                    เหตุผลการปฏิเสธ <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="reject-reason"
                    value={reason}
                    onChange={(e) => onReasonChange(e.target.value)}
                    rows={5}
                    className={`w-full rounded-lg border px-4 py-2 text-lg text-gray-800 focus:outline-none ${reasonError ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="ระบุเหตุผลที่ชัดเจนเพื่อให้ผู้ส่งแก้ไขได้ถูกต้อง"
                />
                {reasonError ? <p className="mt-1 text-lg text-red-500">{reasonError}</p> : null}
            </div>

            <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" size="sm" onClick={onCancel} className="text-xl">
                    ยกเลิก
                </Button>
                <Button type="button" variant="primary" size="sm" onClick={onNext} className="text-xl">
                    ถัดไป
                </Button>
            </div>
        </div>
    );
};

export default RejectStep1;
