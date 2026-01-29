/**
 * StatusBadge Component
 * แสดง badge สถานะต่างๆ พร้อมสีที่เหมาะสม
 */

import { TERM_STATUS_LABEL, TERM_STATUS_COLOR, APPROVAL_STATUS_LABEL, APPROVAL_STATUS_COLOR } from '../../constants/academicYear';

export const StatusBadge = ({ status, type = 'term' }) => {
  // เลือก config ตาม type
  const labelMap = type === 'term' ? TERM_STATUS_LABEL : APPROVAL_STATUS_LABEL;
  const colorMap = type === 'term' ? TERM_STATUS_COLOR : APPROVAL_STATUS_COLOR;
  
  const label = labelMap[status] || status;
  const colors = colorMap[status] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
  };
  
  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1
        rounded-full
        text-sm font-medium
        border
        ${colors.bg}
        ${colors.text}
        ${colors.border}
      `}
    >
      {label}
    </span>
  );
};
