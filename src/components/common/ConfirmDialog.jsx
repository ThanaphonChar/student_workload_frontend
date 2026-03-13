/**
 * ConfirmDialog Component
 * Dialog สำหรับยืนยันการกระทำ
 */

import { Modal } from './Modal';
import { Button } from './Button';

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'ยืนยันการทำงาน',
    message = 'คุณต้องการดำเนินการต่อหรือไม่?',
    confirmText = 'ยืนยัน',
    cancelText = 'ยกเลิก',
    variant = 'danger'
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
        >
            <div className="space-y-6">
                <p className="text-xl text-gray-700">{message}</p>

                <div className="flex gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default ConfirmDialog;
