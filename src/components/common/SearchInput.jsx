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
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      {/* Input field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          pl-10 pr-4 py-2
          bg-white
          border border-gray-300 rounded-lg
          text-sm text-gray-900
          placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors duration-200
        "
        {...props}
      />
    </div>
  );
};
