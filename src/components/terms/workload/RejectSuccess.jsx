import { Button } from '../../common/Button';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';

export const RejectSuccess = ({ onClose }) => {
    return (
        <div className="space-y-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FBE9E9]">
                <NotificationsActiveOutlinedIcon className="text-[#DC2626]" fontSize="large" />
            </div>

            <div>
                <p className="text-2xl font-bold text-gray-900">ปฏิเสธเอกสารเรียบร้อยแล้ว</p>
                <p className="mt-2 text-lg text-gray-600">ระบบได้แจ้งเหตุผลให้ผู้ส่งเอกสารแล้ว</p>
            </div>

            <div className="flex justify-center">
                <Button type="button" variant="primary" size="md" onClick={onClose} className="text-xl">
                    ปิด
                </Button>
            </div>
        </div>
    );
};

export default RejectSuccess;
