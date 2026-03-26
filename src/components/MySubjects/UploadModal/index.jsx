import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../common/Modal';
import { StepIndicator } from '../StepIndicator';
import { Step1FileSelect } from './Step1FileSelect';
import { Step2Confirm } from './Step2Confirm';
import { Step3Done } from './Step3Done';
import { submitDocument } from '../../../services/submission.service';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];

export const UploadModal = ({
    isOpen,
    onClose,
    termSubjectId,
    subjectName,
    documentType,
    onSuccess,
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [stepError, setStepError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const documentTypeLabel = useMemo(() => {
        return documentType === 'outline' ? 'เค้าโครงรายวิชา' : 'รายงานผล';
    }, [documentType]);

    useEffect(() => {
        if (!isOpen) {
            setCurrentStep(0);
            setSelectedFile(null);
            setStepError('');
            setIsSubmitting(false);
            setSubmitError('');
        }
    }, [isOpen]);

    const validateSelectedFile = () => {
        if (!selectedFile) {
            return 'กรุณาเลือกไฟล์ก่อนดำเนินการ';
        }

        const extension = selectedFile.name?.split('.').pop()?.toLowerCase() || '';
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            return 'รองรับเฉพาะไฟล์ PDF, DOC, DOCX เท่านั้น';
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            return 'ไฟล์มีขนาดเกิน 10MB';
        }

        return '';
    };

    const handleNextFromStep1 = () => {
        const validationError = validateSelectedFile();
        if (validationError) {
            setStepError(validationError);
            return;
        }

        setStepError('');
        setCurrentStep(1);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        const validationError = validateSelectedFile();
        if (validationError) {
            setSubmitError(validationError);
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            await submitDocument({
                termSubjectId,
                documentType,
                file: selectedFile,
            });

            setCurrentStep(2);
        } catch (error) {
            setSubmitError(error?.data?.message || error?.message || 'เกิดข้อผิดพลาดในการส่งเอกสาร');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseAfterSuccess = () => {
        if (typeof onSuccess === 'function') {
            onSuccess();
        }
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`ส่งเอกสาร${documentTypeLabel}`}
            size="md"
        >
            <div className="space-y-6">
                <StepIndicator steps={['เลือกไฟล์', 'ยืนยัน', 'สำเร็จ']} currentStep={currentStep} />

                {currentStep === 0 ? (
                    <Step1FileSelect
                        selectedFile={selectedFile}
                        onFileChange={(file) => {
                            setSelectedFile(file);
                            setStepError('');
                        }}
                        onNext={handleNextFromStep1}
                        onCancel={onClose}
                        errorMessage={stepError}
                    />
                ) : null}

                {currentStep === 1 ? (
                    <Step2Confirm
                        subjectName={subjectName}
                        documentType={documentType}
                        file={selectedFile}
                        onBack={() => {
                            setSubmitError('');
                            setCurrentStep(0);
                        }}
                        onConfirm={handleSubmit}
                        isLoading={isSubmitting}
                        errorMessage={submitError}
                    />
                ) : null}

                {currentStep === 2 ? <Step3Done onClose={handleCloseAfterSuccess} /> : null}
            </div>
        </Modal>
    );
};

export default UploadModal;
