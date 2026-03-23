import { Modal } from '../../common/Modal';

import { StepIndicator } from './StepIndicator';

export const ApprovalFlowModal = ({
    isOpen,
    onClose,
    title,
    Icon,
    steps,
    currentStep,
    children,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" closeOnOverlay>
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                    {Icon ? <Icon className="text-[#050C9C]" fontSize="large" /> : null}
                    <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                </div>

                <StepIndicator steps={steps} currentStep={currentStep} />

                {children}
            </div>
        </Modal>
    );
};

export default ApprovalFlowModal;
