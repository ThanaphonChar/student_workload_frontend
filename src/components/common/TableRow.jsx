/**
 * TableRow Component
 * Generic row component สำหรับใช้กับ PaginatedTable
 * รองรับการ render cell แบบ custom ผ่าน renderCell function
 */

export function TableRow({ data, columns, className = '' }) {
    return (
        <div
            className={`grid px-6 py-4 ${className}`}
            style={{ gridTemplateColumns: columns.map(c => c.width || '1fr').join(' ') }}
        >
            {columns.map((column, index) => (
                <div
                    key={index}
                    className={`flex items-center ${column.align === 'center'
                        ? 'justify-center text-center'
                        : column.align === 'right'
                            ? 'justify-end text-right'
                            : 'justify-start text-left'
                        }`}
                >
                    {column.renderCell ? column.renderCell(data) : data[column.field]}
                </div>
            ))}
        </div>
    );
}

export default TableRow;
