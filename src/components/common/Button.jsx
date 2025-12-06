/**
 * Button Component
 * Reusable button พร้อม Tailwind styling
 */

export const Button = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    variant = 'primary',
    className = '',
    ...props
}) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-[#050C9C] hover:bg-[#040a7a] text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    };

    const variantClasses = variants[variant] || variants.primary;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
