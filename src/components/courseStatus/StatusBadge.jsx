/**
 * StatusBadge Component
 * แสดง badge สำหรับสถานะต่างๆ
 */

/**
 * Badge สำหรับแสดงสถานะอนุมัติ (outline_approved, report_approved)
 * ใช้สำหรับ outline และ report เท่านั้น (workload ไม่มีระบบอนุมัติ)
 */
export function ApprovalBadge({ status }) {
    // status: 'pending' | 'approved' | 'rejected'

    if (!status) return <span className="text-gray-400">-</span>;

    const styles = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        approved: 'bg-green-100 text-green-800 border-green-300',
        rejected: 'bg-red-100 text-red-800 border-red-300',
    };

    const labels = {
        pending: 'รออนุมัติ',
        approved: 'อนุมัติแล้ว',
        rejected: 'ไม่อนุมัติ',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
            {labels[status] || status}
        </span>
    );
}

/**
 * Badge สำหรับแสดงสถานะการส่ง (outline_status, workload_status, report_status)
 */
export function SubmissionBadge({ submitted, approved, label }) {
    // submitted: boolean
    // approved: string ('pending' | 'approved' | 'rejected')
    // label: string (ชื่อที่จะแสดง)

    if (!submitted) {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300">
                ยังไม่ส่ง
            </span>
        );
    }

    return <ApprovalBadge status={approved} />;
}

/**
 * Icon สำหรับแสดงสถานะแบบย่อ
 */
export function StatusIcon({ submitted }) {
    if (submitted) {
        return (
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        );
    }

    return (
        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
    );
}

/**
 * Badge สำหรับแสดงจำนวนไฟล์
 */
export function FileCountBadge({ count, type }) {
    if (!count || count === '0' || count === 0) {
        return null;
    }

    return (
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            {count} ไฟล์
        </span>
    );
}
