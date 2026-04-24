/**
 * Dashboard Constants
 * Single source of truth for colors, icons, and configuration
 */

import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const COLORS = {
    primary: '#050C9C',
    blue: '#3572EF',
    green: '#22c55e',
    yellow: '#f59e0b',
    purple: '#a855f7',
    gray: '#6b7280',
    background: '#ffffff',
    border: '#e5e7eb',
};

export const STAT_CARD_CONFIG = [
    {
        key: 'totalSubjects',
        title: 'รายวิชาทั้งหมด',
        icon: MenuBookOutlinedIcon,
        color: 'blue',
        valueKey: 'totalSubjects'
    },
    {
        key: 'outline',
        title: 'เค้าโครงรายวิชา',
        icon: DescriptionOutlinedIcon,
        color: 'green',
        valueKey: 'outlineSubmitted'
    },
    {
        key: 'workload',
        title: 'ภาระงาน',
        icon: AssignmentOutlinedIcon,
        color: 'yellow',
        valueKey: 'workloadFilled'
    },
    {
        key: 'report',
        title: 'รายงานผล',
        icon: CheckCircleOutlineIcon,
        color: 'purple',
        valueKey: 'reportSubmitted'
    }
];

export const STUDENT_YEARS = [1, 2, 3, 4];

export const CHART_CONFIG = {
    total_hours: {
        label: 'ชั่วโมงรวม',
        color: COLORS.primary,
    },
};
