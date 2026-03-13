/**
 * useConfirm Hook
 * Hook สำหรับใช้ ConfirmDialog แบบ Promise-based
 * 
 * Usage:
 * const { confirm, ConfirmDialog } = useConfirm();
 * 
 * const handleDelete = async () => {
 *   const confirmed = await confirm({
 *     title: 'ลบรายการ',
 *     message: 'คุณต้องการลบรายการนี้ใช่หรือไม่?',
 *     variant: 'danger'
 *   });
 *   if (confirmed) {
 *     // do delete
 *   }
 * };
 */

import { useState, useCallback } from 'react';
import { ConfirmDialog as Dialog } from '../components/common/ConfirmDialog.jsx';

export function useConfirm() {
    const [dialogState, setDialogState] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'ยืนยัน',
        cancelText: 'ยกเลิก',
        variant: 'danger',
        resolver: null
    });

    const confirm = useCallback((options = {}) => {
        return new Promise((resolve) => {
            setDialogState({
                isOpen: true,
                title: options.title || 'ยืนยันการทำงาน',
                message: options.message || 'คุณแน่ใจหรือไม่?',
                confirmText: options.confirmText || 'ยืนยัน',
                cancelText: options.cancelText || 'ยกเลิก',
                variant: options.variant || 'danger',
                resolver: resolve
            });
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (dialogState.resolver) {
            dialogState.resolver(true);
        }
        setDialogState(prev => ({ ...prev, isOpen: false }));
    }, [dialogState.resolver]);

    const handleClose = useCallback(() => {
        if (dialogState.resolver) {
            dialogState.resolver(false);
        }
        setDialogState(prev => ({ ...prev, isOpen: false }));
    }, [dialogState.resolver]);

    const ConfirmDialog = useCallback(() => (
        <Dialog
            isOpen={dialogState.isOpen}
            onClose={handleClose}
            onConfirm={handleConfirm}
            title={dialogState.title}
            message={dialogState.message}
            confirmText={dialogState.confirmText}
            cancelText={dialogState.cancelText}
            variant={dialogState.variant}
        />
    ), [dialogState, handleClose, handleConfirm]);

    return { confirm, ConfirmDialog };
}

export default useConfirm;
