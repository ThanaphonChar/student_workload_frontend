/**
 * DatePickerField Component
 * Date picker field พร้อม label และ validation
 */

export const DatePickerField = ({ 
  label, 
  value, 
  onChange, 
  required = false,
  error = false,
  helperText = '',
  className = '',
  ...props 
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input */}
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`
          w-full
          px-4 py-2
          bg-white
          border rounded-lg
          text-sm text-gray-900
          focus:outline-none focus:ring-2
          transition-colors duration-200
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
          }
        `}
        {...props}
      />
      
      {/* Helper Text / Error Message */}
      {helperText && (
        <p className={`mt-1 text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};
