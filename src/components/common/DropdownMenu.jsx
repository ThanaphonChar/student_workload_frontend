/**
 * DropdownMenu Component
 * Reusable dropdown menu component with trigger button
 * รองรับการใช้งานทั่วไป เช่น user menu, action menu ฯลฯ
 */

import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export const DropdownMenu = ({
    trigger,
    items = [],
    position = 'right',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // ปิด dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const positionClasses = {
        right: 'right-0',
        left: 'left-0',
        center: 'left-1/2 -translate-x-1/2'
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className={`
            absolute ${positionClasses[position]} mt-2 
            w-48 bg-white rounded-lg shadow-lg py-2 z-50
            ${className}
          `}
                >
                    {items.map((item, index) => {
                        // รองรับ divider
                        if (item.type === 'divider') {
                            return <hr key={`divider-${index}`} className="my-2" />;
                        }

                        // รองรับ menu item ปกติ
                        return (
                            <button
                                key={item.id || index}
                                onClick={() => {
                                    if (item.onClick) {
                                        item.onClick();
                                    }
                                    setIsOpen(false);
                                }}
                                disabled={item.disabled}
                                className={`
                  block w-full text-left px-4 py-2 text-xl 
                  transition-colors
                  ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'}
                  ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${item.className || ''}
                `}
                            >
                                {item.icon && (
                                    <span className="material-symbols-outlined text-[20px] mr-2 inline-block align-middle">
                                        {item.icon}
                                    </span>
                                )}
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

DropdownMenu.propTypes = {
    // Trigger element (ปุ่มหรือ element ที่จะคลิกเพื่อเปิด dropdown)
    trigger: PropTypes.node.isRequired,

    // รายการ menu items
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            label: PropTypes.string,
            icon: PropTypes.string, // Material icon name
            onClick: PropTypes.func,
            disabled: PropTypes.bool,
            danger: PropTypes.bool, // สำหรับ item ที่เป็นอันตราย เช่น ลบ, ออกจากระบบ
            className: PropTypes.string,
            type: PropTypes.oneOf(['item', 'divider']) // 'divider' จะแสดงเป็นเส้นแบ่ง
        })
    ),

    // ตำแหน่งของ dropdown (relative to trigger)
    position: PropTypes.oneOf(['left', 'right', 'center']),

    // Custom className สำหรับ dropdown container
    className: PropTypes.string
};

export default DropdownMenu;
