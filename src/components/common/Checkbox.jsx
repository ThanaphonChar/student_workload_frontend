/**
 * Checkbox Component
 * Checkbox สำหรับเลือกข้อมูล
 */

export const Checkbox = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <label
      className={`
        inline-flex items-center
        cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="
          w-4 h-4
          text-blue-600
          bg-gray-100
          border-gray-300
          rounded
          focus:ring-2 focus:ring-blue-500
          cursor-pointer
          disabled:cursor-not-allowed
        "
        {...props}
      />
      {label && (
        <span className="ml-2 text-sm text-gray-900">
          {label}
        </span>
      )}
    </label>
  );
};
