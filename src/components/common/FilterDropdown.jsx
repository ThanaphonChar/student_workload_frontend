/**
 * FilterDropdown Component
 * Dropdown สำหรับ filter ข้อมูล
 */

export const FilterDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = 'เลือก',
  className = '',
  ...props
}) => {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      className={`
        min-w-[150px]
        px-4 py-2
        bg-white
        border border-gray-300 rounded-lg
        text-2xl text-gray-900
        focus:outline-none
        transition-colors duration-200
        cursor-pointer
        ${!value ? 'text-gray-400' : ''}
        ${className}
      `}
      {...props}
    >
      <option value="" className="text-gray-400">
        {placeholder}
      </option>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="text-gray-900"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};
