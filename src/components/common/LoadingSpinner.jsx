/**
 * LoadingSpinner Component
 * แสดง loading indicator
 */

export const LoadingSpinner = ({ size = 'medium', fullScreen = false }) => {
    const sizes = {
        small: 'w-4 h-4 border-2',
        medium: 'w-8 h-8 border-3',
        large: 'w-12 h-12 border-4',
    };

    const spinnerClasses = `
        ${sizes[size]}
        border-blue-600 border-t-transparent
        rounded-full animate-spin
    `;

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <div className="text-center">
                    <div className={spinnerClasses}></div>
                    <p className="mt-4 text-gray-600">กำลังโหลด...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center">
            <div className={spinnerClasses}></div>
        </div>
    );
};
