/**
 * Button Component
 * ปุ่มแบบต่างๆ สำหรับใช้ทั่วทั้งระบบ
 */

const VARIANTS = {
  primary: `
    bg-[#050C9C] hover:bg-[#040A8A]
    text-white
    border-transparent
  `,
  secondary: `
    bg-white hover:bg-gray-50
    text-gray-700
    border-gray-300
  `,
  danger: `
    bg-red-600 hover:bg-red-700
    text-white
    border-transparent
  `,
  success: `
    bg-green-600 hover:bg-green-700
    text-white
    border-transparent
  `,
  outline: `
    bg-transparent hover:bg-blue-50
    text-[#050C9C]
    border-[#050C9C]
  `,
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  type = 'button',
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center
        font-medium
        border rounded-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#050C9C]
        transition-all duration-200
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};
