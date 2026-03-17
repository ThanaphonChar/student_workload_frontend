/**
 * SearchInput Component
 * Input สำหรับค้นหาข้อมูล
 */

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'ค้นหา...',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Icon ค้นหา */}
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#acacac] pointer-events-none">
        search
      </span>

      {/* Input field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          pl-10 pr-6 py-2
          rounded-full
          bg-[#F1F1F1]
          text-lg text-gray-900
          placeholder:text-gray-400
          focus:outline-none
          transition-colors duration-200
        "
        {...props}
      />
    </div>
  );
};
