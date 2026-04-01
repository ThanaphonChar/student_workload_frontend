import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

function formatThaiDate(dateValue) {
    if (!dateValue) return '-';
    return new Date(dateValue).toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function buildPendingState(events) {
    const submittedRounds = new Set(
        events
            .filter((event) => event?.event_type === 'submitted')
            .map((event) => event.round_number)
    );

    const reviewedRounds = new Set(
        events
            .filter((event) => event?.event_type === 'reviewed')
            .map((event) => event.round_number)
    );

    for (const roundNumber of submittedRounds) {
        if (!reviewedRounds.has(roundNumber)) {
            return true;
        }
    }

    return false;
}

function getEventTheme(event) {
    if (event.event_type === 'submitted') {
        return {
            dot: 'text-[#050C9C]',
            badge: 'bg-blue-100 text-[#050C9C]',
            card: 'border-gray-200 bg-white',
            badgeLabel: event.round_number > 1 ? 'ส่งเอกสารใหม่' : 'ส่งเอกสาร',
            body: `${event.actor_name || 'อาจารย์'} ส่งเอกสาร ${event.original_name || '-'}`,
            bodyClass: 'text-gray-800',
            timestamp: event.event_time,
            detail: null,
        };
    }

    if (event.event_type === 'reviewed' && event.action === 'approved') {
        return {
            dot: 'text-[#10B981]',
            badge: 'bg-[#E7F8F2] text-[#10B981]',
            card: 'border-gray-200 bg-white',
            badgeLabel: 'อนุมัติแล้ว',
            body: `${event.reviewer_name || 'เจ้าหน้าที่'} อนุมัติเอกสารแล้ว`,
            bodyClass: 'text-gray-800',
            timestamp: event.reviewed_at || event.event_time,
            detail: event.note
                ? { label: 'หมายเหตุ', value: event.note, className: 'text-[#10B981]' }
                : null,
        };
    }

    return {
        dot: 'text-[#DC2626]',
        badge: 'bg-red-100 text-[#DC2626]',
        card: 'border-gray-200 bg-white',
        badgeLabel: 'ไม่อนุมัติ',
        body: `${event.reviewer_name || 'เจ้าหน้าที่'} ปฏิเสธเอกสาร`,
        bodyClass: 'text-gray-800',
        timestamp: event.reviewed_at || event.event_time,
        detail: { label: 'เหตุผล', value: event.reason || '-', className: 'text-[#DC2626]' },
    };
}

export const SubmissionTimeline = ({ events = [], totalRounds = 0 }) => {
    const hasPendingReview = buildPendingState(events);

    return (
        <div className="space-y-4 pl-3">
            {events.map((event, index) => {
                const theme = getEventTheme(event);

                return (
                    <div
                        key={`${event.event_type}-${event.round_number}-${event.event_time || index}`}
                        className={`relative rounded-lg border p-4 ${theme.card}`}
                    >
                        <div className="absolute -left-3 top-6">
                            <FiberManualRecordIcon className={theme.dot} fontSize="small" />
                        </div>

                        <div className="pb-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="text-xl text-gray-900">รอบที่ {event.round_number}</p>
                                <span className={`whitespace-nowrap rounded-full px-4 py-0.5 text-xl font-bold ${theme.badge}`}>{theme.badgeLabel}</span>
                                {theme.timestamp ? (
                                    <span className="text-lg text-[#a1a1a1] sm:ml-auto">{formatThaiDate(theme.timestamp)}</span>
                                ) : null}
                            </div>
                        </div>

                        <p className={`mt-2 text-xl break-all ${theme.bodyClass}`}>{theme.body}</p>

                        {theme.detail ? (
                            <p className={`mt-1 text-xl ${theme.detail.className}`}>
                                {theme.detail.label}: {theme.detail.value}
                            </p>
                        ) : null}
                    </div>
                );
            })}

            {hasPendingReview ? (
                <div className="relative rounded-lg border border-[#FFE7CD] bg-[#fffefc] p-4">
                    <div className="absolute -left-3 top-6">
                        <FiberManualRecordIcon className="text-[#FF8D28]" fontSize="small" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <p className="text-xl text-gray-900">รอบที่ {totalRounds || '-'}</p>
                        <span className="rounded-full bg-[#FFF5EA] px-4 py-0.5 text-xl font-bold text-[#FF8D28]">รอการตรวจสอบ</span>
                    </div>

                    <p className="mt-2 text-xl text-[#FF8D28]">เอกสารอยู่ระหว่างการตรวจสอบโดยเจ้าหน้าที่</p>
                </div>
            ) : null}
        </div>
    );
};

export default SubmissionTimeline;
