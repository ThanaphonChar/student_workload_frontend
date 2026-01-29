/**
 * Button Component
 * ปุ่มแบบต่างๆ สำหรับใช้ทั่วทั้งระบบ
 */

const VARIANTS = {
  primary: `
    bg-blue-600 hover:bg-blue-700
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
    text-blue-600
    border-blue-600
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
  type = 'button',
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        font-medium
        border rounded-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        transition-all duration-200
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
