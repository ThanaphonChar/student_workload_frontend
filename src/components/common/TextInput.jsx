/**
 * TextInput Component
 * Input field พร้อม label และ Tailwind styling
 */

export const TextInput = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    required = false,
    error = '',
    className = '',
    ...props
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-[20px] font-medium text-gray-700 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`
                    w-full px-4 py-2 border rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    outline-none transition-colors
                    ${error ? 'border-red-500' : 'border-[#d9d9d9]'}
                `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
