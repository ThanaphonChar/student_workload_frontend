/**
 * Table Component
 * ตารางแสดงข้อมูลแบบ responsive
 */

export const Table = ({ children, className = '' }) => (
  <div className="overflow-x-auto">
    <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
      {children}
    </table>
  </div>
);

export const TableHead = ({ children, className = '' }) => (
  <thead className={`bg-gray-50 ${className}`}>
    {children}
  </thead>
);

export const TableBody = ({ children, className = '' }) => (
  <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
    {children}
  </tbody>
);

export const TableRow = ({ 
  children, 
  onClick,
  hoverable = true,
  className = '' 
}) => (
  <tr
    onClick={onClick}
    className={`
      ${hoverable ? 'hover:bg-gray-50' : ''}
      ${onClick ? 'cursor-pointer' : ''}
      transition-colors duration-150
      ${className}
    `}
  >
    {children}
  </tr>
);

export const TableHeader = ({ 
  children, 
  align = 'left',
  className = '' 
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <th
      className={`
        px-6 py-3
        text-xs font-medium text-gray-500 uppercase tracking-wider
        ${alignClasses[align]}
        ${className}
      `}
    >
      {children}
    </th>
  );
};

export const TableCell = ({ 
  children, 
  align = 'left',
  className = '' 
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td
      className={`
        px-6 py-4
        text-sm text-gray-900
        ${alignClasses[align]}
        ${className}
      `}
    >
      {children}
    </td>
  );
};
