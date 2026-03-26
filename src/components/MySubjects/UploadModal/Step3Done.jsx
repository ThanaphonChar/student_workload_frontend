import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button } from '../../common/Button';

export const Step3Done = ({ onClose }) => {
    return (
        <div className="space-y-5 text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-[#D6FFF0] flex items-center justify-center">
                <CheckCircleIcon className="text-[#10B981]" sx={{ fontSize: 56 }} />
            </div>

            <div>
                <p className="text-2xl text-gray-900">ส่งเอกสารสำเร็จ</p>
                <p className="mt-2 text-xl text-gray-700">สถานะเปลี่ยนเป็น รออนุมัติ แล้ว</p>
            </div>

            <div className="flex justify-center">
                <Button variant="primary" onClick={onClose}>
                    ปิด
                </Button>
            </div>
        </div>
    );
};

export default Step3Done;
