/**
 * UI Components Central Export
 * 
 * This file serves as the single source of truth for all reusable UI components.
 * 
 * Benefits:
 * 1. Single import path: import { IOSSwitch, IOSButton } from '@/components/ui'
 * 2. Easy to extend: Add new component categories without changing consumer code
 * 3. Encapsulation: Internal structure can change without breaking imports
 * 4. Documentation: Acts as a directory of available UI components
 * 
 * Future expansion:
 * - buttons/
 * - inputs/
 * - checkboxes/
 * - radio/
 * - modals/
 */

// Switches
export { IOSSwitch } from './switches';

// Future exports will be added here as the system grows:
// export { IOSButton } from './buttons';
// export { IOSCheckbox } from './checkboxes';
// export { IOSRadio } from './radio';
