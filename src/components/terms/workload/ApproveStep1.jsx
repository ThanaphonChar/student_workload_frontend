import { Button } from '../../common/Button';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

export const ApproveStep1 = ({
    documentName,
    note,
    onNoteChange,
    onCancel,
    onNext,
}) => {
    return (
        <div className="space-y-5">
            <div className="rounded-lg bg-[#F7F8FA] p-4">
                <div className="mb-2 flex items-center gap-2">
                    <DescriptionOutlinedIcon className="text-[#050C9C]" fontSize="small" />
                    <p className="text-xl font-bold text-gray-800">เอกสารที่กำลังอนุมัติ</p>
                </div>
                <p className="text-lg text-gray-700 break-words">{documentName}</p>
            </div>

            <div>
                <label htmlFor="approve-note" className="mb-1 block text-xl font-bold text-gray-700">
                    หมายเหตุ (ไม่บังคับ)
                </label>
                <textarea
                    id="approve-note"
                    value={note}
                    onChange={(e) => onNoteChange(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-lg text-gray-800 focus:outline-none"
                    placeholder="ระบุหมายเหตุเพิ่มเติม"
                />
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

export default ApproveStep1;
