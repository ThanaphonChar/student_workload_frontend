/**
 * TextAreaInput Component
 * Textarea พร้อม label, error message และ styling มาตรฐาน
 */

export const TextAreaInput = ({
    label,
    name,
    value,
    onChange,
    placeholder = '',
    required = false,
    error = '',
    rows = 4,
    className = '',
    ...props
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-2xl font-bold text-gray-700 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
                placeholder={placeholder}
                required={required}
                className={
                    `text-2xl w-full px-4 py-2 border rounded-lg focus:outline-none resize-none transition-colors ${error ? 'border-red-500' : 'border-[#d9d9d9]'}`
                }
                {...props}
            />

            {error && (
                <p className="mt-1 text-2xl text-red-600">{error}</p>
            )}
        </div>
    );
};
