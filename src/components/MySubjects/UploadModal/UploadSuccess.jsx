import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { Button } from '../../common/Button';

export const UploadSuccess = ({ onClose }) => {
    return (
        <div className="space-y-5 text-center">
            <div className="mx-auto p-4 rounded-full flex items-center justify-center">
                <TaskAltRoundedIcon className="text-[#10B981]" sx={{ fontSize: 98 }} />
            </div>

            <div>
                <p className="text-2xl text-gray-900">ส่งเอกสารสำเร็จ</p>
            </div>

            <div className="flex justify-center">
                <Button
                    variant="primary"
                    size="md"
                    className="text-2xl"
                    onClick={onClose}
                >
                    ปิด
                </Button>
            </div>
        </div>
    );
};

export default UploadSuccess;
