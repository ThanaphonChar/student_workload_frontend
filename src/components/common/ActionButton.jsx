/**
 * ActionButton Component
 * ปุ่มสำหรับ action ต่างๆ (เพิ่ม, แก้ไข, ลบ) แบบ reusable
 */

export const ActionButton = ({ 
    onClick, 
    children,
    icon,
    variant = "primary",
    className = "" 
}) => {
    const variants = {
        primary: "bg-[#050C9C] hover:bg-[#040879] text-white",
        secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300",
        danger: "bg-red-600 hover:bg-red-700 text-white"
    };

    return (
        <button
            onClick={onClick}
            className={`px-6 py-2 rounded-full font-semibold text-xl flex items-center justify-center gap-2 whitespace-nowrap transition-colors shadow-sm ${variants[variant]} ${className}`}
        >
            {icon && (
                <span className="material-symbols-outlined text-xl">
                    {icon}
                </span>
            )}
            {children}
        </button>
    );
};
