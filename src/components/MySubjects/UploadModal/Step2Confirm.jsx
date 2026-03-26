import DescriptionIcon from '@mui/icons-material/Description';
import ArticleIcon from '@mui/icons-material/Article';
import { Button } from '../../common/Button';

export const Step2Confirm = ({
    subjectName,
    documentType,
    file,
    onBack,
    onConfirm,
    isLoading,
    errorMessage,
}) => {
    const documentTypeLabel = documentType === 'outline' ? 'เค้าโครงรายวิชา' : 'รายงานผล';

    return (
        <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <ArticleIcon className="text-[#050C9C]" />
                    <p className="text-xl text-gray-700">รายวิชา</p>
                </div>
                <p className="text-2xl text-gray-900">{subjectName || '-'}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xl text-gray-700">ประเภทเอกสาร</p>
                <p className="text-2xl text-gray-900">{documentTypeLabel}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 flex items-center gap-3">
                <DescriptionIcon className="text-[#050C9C]" />
                <div>
                    <p className="text-xl text-gray-700">ชื่อไฟล์</p>
                    <p className="text-xl text-gray-900 break-all">{file?.name || '-'}</p>
                </div>
            </div>

            {errorMessage ? <p className="text-lg text-red-600">{errorMessage}</p> : null}

            <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={onBack} disabled={isLoading}>
                    ย้อนกลับ
                </Button>
                <Button variant="primary" onClick={onConfirm} disabled={isLoading} isLoading={isLoading}>
                    ยืนยันส่งเอกสาร
                </Button>
            </div>
        </div>
    );
};

export default Step2Confirm;
