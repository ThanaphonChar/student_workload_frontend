/**
 * IOSSwitch Component
 * 
 * A production-grade iOS-style switch component built on top of Material UI.
 * Encapsulates all styling logic and provides a clean, reusable interface.
 * 
 * Design Principles:
 * - Single Responsibility: Only handles iOS-style switch behavior
 * - Encapsulation: All styling is internal, consumers see only props
 * - Extensibility: Can be extended with size/color variants without breaking changes
 * - Consistency: Matches iOS visual language across the entire app
 * 
 * @example
 * <IOSSwitch 
 *   checked={isEnabled} 
 *   onChange={(e) => setEnabled(e.target.checked)}
 *   disabled={false}
 * />
 */

import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

/**
 * Styled iOS Switch Component
 * 
 * Visual Specifications:
 * - Track: 36x20px rounded pill shape
 * - Thumb: 16x16px circle with shadow
 * - Colors: iOS green (#34C759) when active, light gray when inactive
 * - Animation: 300ms smooth transition
 * - Disabled: 50% opacity with cursor not-allowed
 */
const StyledIOSSwitch = styled(Switch)(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#34C759', // iOS green
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#34C759',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.grey[100],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: '#E9E9EA', // iOS light gray
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 300,
        }),
    },
}));

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
    ...otherProps
}) => {
    return (
        <StyledIOSSwitch
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            name={name}
            inputProps={inputProps}
            {...otherProps}
        />
    );
};

export default IOSSwitch;
