/**
 * Alert Component
 * แสดงข้อความแจ้งเตือนแบบต่างๆ (success, error, warning, info)
 */

export const Alert = ({ 
    type = 'info', 
    message, 
    onClose,
    className = '' 
}) => {
    const types = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: 'check_circle'
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: 'error'
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: 'warning'
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: 'info'
        }
    };

    const config = types[type] || types.info;

    return (
        <div className={`${config.bg} border ${config.border} rounded-lg p-4 flex items-center justify-between ${className}`}>
            <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined ${config.text}`}>
                    {config.icon}
                </span>
                <span className={`${config.text} text-xl`}>
                    {message}
                </span>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className={`${config.text} hover:opacity-70 transition-opacity`}
                >
                    <span className="material-symbols-outlined text-xl">
                        close
                    </span>
                </button>
            )}
        </div>
    );
};
