import DeleteIcon from '@mui/icons-material/Delete';

function getInitials(member) {
    const first = member?.first_name_th?.[0] || member?.first_name_en?.[0] || '';
    const last = member?.last_name_th?.[0] || member?.last_name_en?.[0] || '';
    return `${first}${last}` || 'U';
}

function getDisplayName(member) {
    const th = `${member?.first_name_th || ''} ${member?.last_name_th || ''}`.trim();
    if (th) return th;
    return `${member?.first_name_en || ''} ${member?.last_name_en || ''}`.trim() || member?.username || '-';
}

export default function MemberList({ title, members, onRemove, removingKey }) {
    if (!members || members.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-4 text-lg text-gray-500">
                {`ยังไม่มี ${title} ในระบบ`}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {members.map((member) => {
                const rowKey = `${member.id}-${member.role_id}`;
                const isRemoving = removingKey === rowKey;

                return (
                    <div key={rowKey} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-[#050a9c] text-white flex items-center justify-center text-lg font-bold shrink-0">
                                {getInitials(member)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xl text-gray-900 font-semibold truncate">{getDisplayName(member)}</p>
                                <p className="text-lg text-gray-500 truncate">{member.email}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onRemove(member)}
                            disabled={isRemoving}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="ลบสิทธิ์"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
