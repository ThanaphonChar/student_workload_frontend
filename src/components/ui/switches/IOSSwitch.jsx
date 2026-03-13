/**
 * IOSSwitch Component
 * 
 * A production-grade iOS-style switch component built with Tailwind CSS.
 * Pure React implementation without Material-UI dependencies.
 * 
 * Design Principles:
 * - Single Responsibility: Only handles iOS-style switch behavior
 * - Encapsulation: All styling uses Tailwind CSS classes
 * - Extensibility: Can be extended with size/color variants without breaking changes
 * - Consistency: Matches iOS visual language and project's Tailwind design system
 * 
 * Visual Specifications:
 * - Track: 42x26px rounded pill shape
 * - Thumb: 22x22px circle with shadow
 * - Colors: iOS green (#34C759) when active, light gray (#E9E9EA) when inactive
 * - Animation: Smooth 300ms transition
 * - Disabled: 50% opacity with cursor not-allowed
 * 
 * @example
 * <IOSSwitch 
 *   checked={isEnabled} 
 *   onChange={(e) => setEnabled(e.target.checked)}
 *   disabled={false}
 * />
 */

/**
 * IOSSwitch Component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.checked - Controlled checked state
 * @param {Function} props.onChange - Change handler (e) => void
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.name] - Input name attribute
 * @param {Object} [props.inputProps] - Additional input props
 * @returns {JSX.Element} iOS-style switch component
 */
export const IOSSwitch = ({
    checked,
    onChange,
    disabled = false,
    name,
    inputProps,
    className = '',
    ...otherProps
}) => {
    return (
        <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}>
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                name={name}
                {...inputProps}
                {...otherProps}
            />
            <div
                className={`
                    w-[42px] h-[26px] 
                    rounded-full
                    transition-colors duration-300
                    ${checked ? 'bg-[#10B981]' : 'bg-[#E9E9EA]'}
                    ${disabled ? 'opacity-50' : ''}
                `}
            >
                <div
                    className={`
                        absolute top-[2px] left-[2px]
                        w-[22px] h-[22px]
                        bg-white rounded-full
                        shadow-[0_2px_4px_0_rgba(0,0,0,0.2)]
                        transition-transform duration-300 ease-in-out
                        ${checked ? 'translate-x-[16px]' : 'translate-x-0'}
                    `}
                />
            </div>
        </label>
    );
};

export default IOSSwitch;
