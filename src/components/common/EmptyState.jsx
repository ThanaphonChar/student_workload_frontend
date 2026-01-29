/**
 * EmptyState Component
 * แสดงเมื่อไม่มีข้อมูล
 */

export const EmptyState = ({ 
  message = 'ไม่พบข้อมูล',
  icon = null,
  action = null,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {/* Icon */}
      {icon ? (
        icon
      ) : (
        <svg
          className="mx-auto h-16 w-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      )}
      
      {/* Message */}
      <p className="mt-4 text-base text-gray-500">
        {message}
      </p>
      
      {/* Action Button */}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};
