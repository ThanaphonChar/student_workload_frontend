import { Button } from '../../common/Button';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';

export const ApproveStep3 = ({ documentName, onClose }) => {
    return (
        <div className="space-y-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E7F8F2]">
                <TaskAltOutlinedIcon className="text-[#10B981]" fontSize="large" />
            </div>

            <div>
                <p className="text-2xl font-bold text-gray-900">อนุมัติเอกสารเรียบร้อยแล้ว</p>
                <p className="mt-2 text-lg text-gray-600 break-words">{documentName}</p>
            </div>

            <div className="flex justify-center">
                <Button type="button" variant="primary" size="sm" onClick={onClose} className="text-xl">
                    ปิด
                </Button>
            </div>
        </div>
    );
};

export default ApproveStep3;
