import { useRef, useState } from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';
import { Button } from '../../common/Button';

export const Step1FileSelect = ({ selectedFile, onFileChange, onNext, onCancel, errorMessage }) => {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files?.[0];
        if (file) {
            onFileChange(file);
        }
    };

    const handleBrowse = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileChange(file);
        }
    };

    return (
        <div className="space-y-4">
            <div
                onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`
                    rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors
                    ${isDragging ? 'border-[#050C9C] bg-blue-50' : 'border-gray-300 bg-white hover:border-[#050C9C]'}
                `}
            >
                <UploadFileIcon className="text-gray-400" sx={{ fontSize: 48 }} />
                <p className="mt-2 text-2xl text-gray-900">ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์</p>
                <p className="mt-1 text-lg text-gray-500">รองรับ PDF, DOC, DOCX และขนาดไม่เกิน 10MB</p>
            </div>

            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleBrowse}
            />

            {selectedFile && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 flex items-center gap-3">
                    <DescriptionIcon className="text-[#050C9C]" />
                    <div>
                        <p className="text-xl text-gray-900">{selectedFile.name}</p>
                        <p className="text-lg text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                </div>
            )}

            {errorMessage ? <p className="text-lg text-red-600">{errorMessage}</p> : null}

            <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={onCancel}>
                    ยกเลิก
                </Button>
                <Button variant="primary" onClick={onNext} disabled={!selectedFile}>
                    ถัดไป
                </Button>
            </div>
        </div>
    );
};

export default Step1FileSelect;
