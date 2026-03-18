import { useState } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InstructorDropdown from './InstructorDropdown';
import MemberList from './MemberList';

export default function RoleSection({ roleKey, title, members, onAdd, onRemove, adding, removingKey }) {
    const [openAddPanel, setOpenAddPanel] = useState(false);

    const handleAdd = async (selected) => {
        await onAdd(roleKey, selected);
        setOpenAddPanel(false);
    };

    return (
        <section className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-[#050a9c] px-4 py-3 flex items-center justify-between">
                <h2 className="text-2xl text-white font-bold">{title}</h2>
                <button
                    type="button"
                    onClick={() => setOpenAddPanel((prev) => !prev)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-[#050a9c] text-lg font-semibold"
                >
                    <PersonAddIcon fontSize="small" />
                    เพิ่มผู้ใช้
                </button>
            </div>

            {openAddPanel && (
                <InstructorDropdown onConfirm={handleAdd} loading={adding} />
            )}

            <div className="p-4">
                <MemberList title={title} members={members} onRemove={onRemove} removingKey={removingKey} />
            </div>
        </section>
    );
}
