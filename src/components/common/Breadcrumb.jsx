/**
 * Breadcrumb Component
 * แสดงเส้นทางหน้าปัจจุบันแบบเรียงลำดับ
 */

export const Breadcrumb = ({ items = [], className = '' }) => {
    if (!items.length) {
        return null;
    }

    return (
        <nav aria-label="breadcrumb" className={`flex items-center gap-2 text-2xl text-gray-600 ${className}`}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={`${item.label}-${index}`} className="flex items-center gap-2">
                        {item.onClick && !isLast ? (
                            <button
                                type="button"
                                onClick={item.onClick}
                                className="hover:text-[#050C9C]"
                            >
                                {item.label}
                            </button>
                        ) : (
                            <span className={isLast ? 'text-[#050C9C] font-bold' : ''}>
                                {item.label}
                            </span>
                        )}

                        {!isLast && (
                            <span className="material-symbols-outlined text-xl sm:text-xl" aria-hidden="true">
                                chevron_right
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};
