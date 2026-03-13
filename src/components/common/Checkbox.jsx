/**
 * Checkbox Component
 * Custom checkbox ที่สวยงาม พร้อม checkmark animation
 */

export const Checkbox = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = '',
  labelClassName = '',
  ...props
}) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9'
  };

  const iconSizes = {
    sm: 'text-xl',
    md: 'text-xl',
    lg: 'text-xl'
  };

  return (
    <label
      className={`
        inline-flex items-center gap-2
        cursor-pointer select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked, e)}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div
          className={`
            ${sizes[size]}
            border-2 rounded-lg
            flex items-center justify-center
            transition-all duration-200
            ${checked
              ? 'bg-[#10B981] border-[#10B981]'
              : 'bg-white border-[#E1E1E1] hover:border-[#D1D1D1]'
            }
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {checked && (
            <svg
              className={`${iconSizes[size]} text-white`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      {label && (
        <span className={`text-2xl text-gray-700 ${labelClassName}`}>
          {label}
        </span>
      )}
    </label>
  );
};
