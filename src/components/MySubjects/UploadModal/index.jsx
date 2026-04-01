import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../common/Modal';
import { UploadSuccess } from './UploadSuccess';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import UploadFileOutlinedRoundedIcon from '@mui/icons-material/UploadFileRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { submitDocument } from '../../../services/submission.service';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];

const getFileExtension = (filename) => {
    return filename?.split('.').pop()?.toLowerCase() || '';
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const UploadModal = ({
    isOpen,
    onClose,
    termSubjectId,
    subjectCode,
    subjectName,
    documentType,
    onSuccess,
}) => {
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const documentTypeLabel = useMemo(() => {
        return documentType === 'outline' ? 'เค้าโครงรายวิชา' : 'รายงานผล';
    }, [documentType]);

    useEffect(() => {
        if (!isOpen) {
            setIsSuccess(false);
            setSelectedFile(null);
            setFileError('');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const validateSelectedFile = () => {
        if (!selectedFile) {
            return 'กรุณาเลือกไฟล์ก่อน';
        }

        const extension = getFileExtension(selectedFile.name);
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            return 'รองรับเฉพาะไฟล์: PDF, DOC, DOCX';
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            return 'ไฟล์มีขนาดเกิน 10MB';
        }

        return '';
    };

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setFileError('');
    };

    const handleSubmit = async () => {
        const validationError = validateSelectedFile();
        if (validationError) {
            setFileError(validationError);
            return;
        }

        setIsSubmitting(true);
        setFileError('');

        try {
            await submitDocument({
                termSubjectId,
                documentType,
                file: selectedFile,
            });

            setIsSuccess(true);
            setTimeout(() => {
                if (typeof onSuccess === 'function') {
                    onSuccess();
                }
                onClose();
            }, 1500);
        } catch (error) {
            setFileError(error?.data?.message || error?.message || 'เกิดข้อผิดพลาดในการส่งเอกสาร');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} size="md">
                <UploadSuccess onClose={onClose} />
            </Modal>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`ส่งเอกสาร${documentTypeLabel}`}
            size="md"
        >
            <div className="space-y-5">
                {/* Subject & Document Type Info */}
                <div className="rounded-lg bg-white pb-3">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <p className="text-3xl font-bold text-gray-900">
                                {subjectCode || '-'}
                            </p>
                            <p className="text-2xl text-[#757575]">
                                {subjectName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* File Upload Area */}
                <div>

                    <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-[#E9E9E9] bg-[#F1F1F1] rounded-lg cursor-pointer hover:bg-[#E9E9E9] transition">
                        <div className="flex flex-col items-center justify-center">
                            <UploadFileOutlinedRoundedIcon fontSize="large" className="text-[#050A9C] mb-2" />
                            <p className="text-xl text-gray-600">
                                <span className="font-semibold">คลิกเพื่อเลือก</span>
                                {' '}หรือลากไฟล์มาวาง
                            </p>
                            <p className="text-xl text-gray-500">
                                PDF, DOC, DOCX (สูงสุด 10MB)
                            </p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileSelect(file);
                            }}
                            disabled={isSubmitting}
                        />
                    </label>
                </div>

                {/* File Preview */}
                {selectedFile && (
                    <div className="rounded-lg shadow bg-white p-3">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0 px-3">
                                <p className="text-xl font-bold text-gray-900 truncate">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xl text-[#757575]">
                                    {formatFileSize(selectedFile.size)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setFileError('');
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <CloseRoundedIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {fileError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                        <p className="text-sm text-red-700">{fileError}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-5 py-2 bg-[#F1F1F1] hover:bg-[#E1E1E1] text-[#3B3B3B] text-xl rounded-lg disabled:opacity-50 transition"
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!selectedFile || isSubmitting}
                        className="px-5 py-2 bg-[#050C9C] text-white hover:bg-[#040879] text-xl rounded-lg disabled:opacity-50 transition"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <LoadingSpinner size="small" />
                                <span>กำลังส่ง...</span>
                            </span>
                        ) : 'ส่งเอกสาร'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default UploadModal;
