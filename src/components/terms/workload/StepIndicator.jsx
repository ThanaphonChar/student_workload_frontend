export const StepIndicator = ({ steps = [], currentStep = 0 }) => {
    return (
        <div className="flex items-center gap-2">
            {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isDone = index < currentStep;

                return (
                    <div key={step} className="flex flex-1 items-center gap-2">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold ${isDone || isActive
                                    ? 'bg-[#050C9C] text-white'
                                    : 'bg-gray-200 text-gray-600'
                                }`}
                        >
                            {index + 1}
                        </div>
                        <span
                            className={`text-lg font-medium ${isActive ? 'text-[#050C9C]' : 'text-gray-500'
                                }`}
                        >
                            {step}
                        </span>
                        {index < steps.length - 1 ? (
                            <div className="h-0.5 flex-1 bg-gray-200" />
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
};

export default StepIndicator;
