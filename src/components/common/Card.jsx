/**
 * Card Component
 * Card container สำหรับแสดงข้อมูล
 */

export const Card = ({ 
  children, 
  onClick,
  hoverable = false,
  className = '',
  ...props 
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white
        rounded-lg
        border border-gray-200
        shadow-sm
        ${hoverable ? 'hover:shadow-md hover:border-gray-300 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        transition-all duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);
