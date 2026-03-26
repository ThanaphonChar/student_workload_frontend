import CheckIcon from '@mui/icons-material/Check';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export const StepIndicator = ({ steps = [], currentStep = 0 }) => {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between gap-3">
                {steps.map((step, index) => {
                    const isDone = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div key={step} className="flex items-center flex-1 min-w-0">
                            <div className="flex flex-col items-center w-full">
                                <div
                                    className={`
                                        h-10 w-10 rounded-full flex items-center justify-center
                                        ${isDone ? 'bg-[#10B981] text-white' : ''}
                                        ${isCurrent ? 'bg-[#050C9C] text-white' : ''}
                                        ${!isDone && !isCurrent ? 'bg-gray-300 text-gray-600' : ''}
                                    `}
                                >
                                    {isDone ? <CheckIcon fontSize="small" /> : <FiberManualRecordIcon fontSize="small" />}
                                </div>
                                <p className={`mt-2 text-lg text-center ${isCurrent ? 'text-[#050C9C] font-semibold' : 'text-gray-600'}`}>
                                    {step}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`h-1 flex-1 mx-2 rounded ${index < currentStep ? 'bg-[#10B981]' : 'bg-gray-300'}`} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StepIndicator;
