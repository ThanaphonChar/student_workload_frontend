/**
 * TextField Component
 * Input field พร้อม label และ validation
 */

export const TextField = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  error = false,
  helperText = '',
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-2xl font-bold text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input */}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full
          px-4 py-2
          bg-white
          border rounded-lg
          text-2xl text-gray-900
          placeholder-gray-400
          focus:outline-none
          transition-colors duration-200
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error
            ? 'border-red-500'
            : 'border-gray-300'
          }
        `}
        {...props}
      />

      {/* Helper Text / Error Message */}
      {helperText && (
        <p className={`mt-1 text-2xl ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};
