/**
 * WarningBox Component
 * กล่องเตือน deadline พร้อมไอคอนและข้อความ
 */

export const WarningBox = ({ message, daysRemaining, className = '' }) => {
  return (
    <div 
      className={`
        p-4 md:p-6
        bg-yellow-50
        border border-yellow-400
        rounded-lg
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Warning Icon */}
        <svg
          className="w-8 h-8 text-yellow-500 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        
        {/* Content */}
        <div className="flex-1">
          <h4 className="text-base font-semibold text-yellow-900 mb-1">
            แจ้งเตือน
          </h4>
          <p className="text-sm text-yellow-950">
            {message}
            {daysRemaining !== undefined && (
              <span className="font-semibold">
                {' '}(เหลือเวลาอีก {daysRemaining} วัน)
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
