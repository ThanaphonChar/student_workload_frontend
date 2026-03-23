/**
 * useAlert Hook
 * Hook สำหรับใช้ AlertDialog แบบ Promise-based
 * 
 * Usage:
 * const { alert, AlertDialog } = useAlert();
 * 
 * await alert({
 *   title: 'เกิดข้อผิดพลาด',
 *   message: 'ไม่สามารถบันทึกข้อมูลได้',
 *   variant: 'error'
 * });
 */

import { useState, useCallback } from 'react';
import { AlertDialog as Dialog } from '../components/common/AlertDialog.jsx';

export function useAlert() {
    const [dialogState, setDialogState] = useState({
        isOpen: false,
        title: '',
        message: '',
        variant: 'error',
        buttonText: 'ตกลง',
        resolver: null
    });

    const alert = useCallback((options = {}) => {
        return new Promise((resolve) => {
            setDialogState({
                isOpen: true,
                title: options.title || 'แจ้งเตือน',
                message: options.message || '',
                variant: options.variant || 'error',
                buttonText: options.buttonText || 'ตกลง',
                resolver: resolve
            });
        });
    }, []);

    const handleClose = useCallback(() => {
        if (dialogState.resolver) {
            dialogState.resolver();
        }
        setDialogState(prev => ({ ...prev, isOpen: false }));
    }, [dialogState.resolver]);

    const AlertDialog = useCallback(() => (
        <Dialog
            isOpen={dialogState.isOpen}
            onClose={handleClose}
            title={dialogState.title}
            message={dialogState.message}
            variant={dialogState.variant}
            buttonText={dialogState.buttonText}
        />
    ), [dialogState, handleClose]);

    return { alert, AlertDialog };
}

export default useAlert;
