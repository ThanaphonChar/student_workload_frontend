import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { PaginatedTable } from '../common/PaginatedTable';

function getInitials(member) {
    const first = member?.first_name_en?.[0] || '';
    const last = member?.last_name_en?.[0] || '';
    return (`${first}${last}` || 'U').toUpperCase();
}

function getDisplayName(member) {
    const th = `${member?.first_name_th || ''} ${member?.last_name_th || ''}`.trim();
    if (th) return th;
    return `${member?.first_name_en || ''} ${member?.last_name_en || ''}`.trim() || member?.username || '-';
}

export default function MemberList({ roleKey, title, members, onOpenAdd, onRemove, removingKey }) {
    const columns = [
        { label: 'ผู้ใช้', width: '4fr' },
        { label: 'จัดการ', width: '1fr' },
    ];

    return (
        <PaginatedTable
            data={members}
            columns={columns}
            defaultRowsPerPage={5}
            emptyMessage={`ยังไม่มี ${title} ในระบบ`}
            showHeader
            showPaginationControls={roleKey === 'professor'}
            headerContent={(
                <div className="flex items-center justify-between">
                    <h2 className="ml-6 text-2xl text-white font-bold">{title}</h2>
                    <button
                        type="button"
                        onClick={() => onOpenAdd(roleKey)}
                        className="inline-flex items-center gap-2 mr-8 rounded-lg text-white text-xl font-semibold"
                    >
                        <PersonAddIcon fontSize="medium" />
                    </button>
                </div>
            )}
            renderRow={(member) => {
                const rowKey = `${member.id}-${member.role_id}`;
                const isRemoving = removingKey === rowKey;

                return (
                    <div className="grid grid-cols-[4fr_1fr] items-center gap-4 px-4 py-3">
                        <div className="min-w-0">
                            {/* <div className="w-10 h-10 rounded-full bg-[#050a9c] text-white flex items-center justify-center text-lg font-bold shrink-0">
                                {getInitials(member)}
                            </div> */}
                            <p className="ml-6 text-2xl text-gray-900 font-bold truncate">{getDisplayName(member)}</p>
                            <p className="ml-6 text-xl text-gray-500 truncate">{member.email || '-'}</p>
                        </div>



                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => onRemove(member)}
                                disabled={isRemoving}
                                className="mr-2 p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="ลบสิทธิ์"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                );
            }}
        />
    );
}
