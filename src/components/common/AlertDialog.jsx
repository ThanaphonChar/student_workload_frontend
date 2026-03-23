/**
 * AlertDialog Component
 * Modal dialog สำหรับแสดงข้อความแจ้งเตือน
 */

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export function AlertDialog({
    isOpen = false,
    onClose = () => { },
    title = 'แจ้งเตือน',
    message = '',
    variant = 'error', // 'error', 'warning', 'success', 'info'
    buttonText = 'ตกลง'
}) {
    const getIcon = () => {
        switch (variant) {
            case 'error':
                return <ErrorOutlineIcon sx={{ fontSize: '3rem' }} className="text-red-500" />;
            case 'warning':
                return <WarningAmberIcon sx={{ fontSize: '3rem' }} className="text-yellow-500" />;
            case 'success':
                return <CheckCircleOutlineIcon sx={{ fontSize: '3rem' }} className="text-green-500" />;
            case 'info':
            default:
                return <InfoOutlinedIcon sx={{ fontSize: '3rem' }} className="text-blue-500" />;
        }
    };

    const getTitleColor = () => {
        switch (variant) {
            case 'error':
                return 'text-red-600';
            case 'warning':
                return 'text-yellow-600';
            case 'success':
                return 'text-green-600';
            case 'info':
            default:
                return 'text-blue-600';
        }
    };

    const getButtonVariant = () => {
        switch (variant) {
            case 'error':
                return 'danger';
            case 'warning':
                return 'warning';
            case 'success':
                return 'success';
            case 'info':
            default:
                return 'primary';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            closeOnEsc={false}
            closeOnBackdropClick={false}
        >
            <div className="flex flex-col items-center gap-4 py-6">
                {/* Icon */}
                <div className="flex justify-center">
                    {getIcon()}
                </div>

                {/* Title */}
                <h2 className={`text-2xl font-bold ${getTitleColor()}`}>
                    {title}
                </h2>

                {/* Message */}
                {message && (
                    <p className="text-lg text-gray-700 text-center">
                        {message}
                    </p>
                )}

                {/* Button */}
                <Button
                    onClick={onClose}
                    variant={getButtonVariant()}
                    size="md"
                    className="mt-4 px-8 text-lg font-semibold"
                >
                    {buttonText}
                </Button>
            </div>
        </Modal>
    );
}

export default AlertDialog;
