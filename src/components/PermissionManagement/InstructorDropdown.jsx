import { useEffect, useMemo, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import * as permissionService from '../../services/permission.service';

let instructorCache = null;

function getDisplayName(instructor) {
    const th = `${instructor.first_name_th || ''} ${instructor.last_name_th || ''}`.trim();
    if (th) return th;
    return `${instructor.first_name_en || ''} ${instructor.last_name_en || ''}`.trim() || instructor.email;
}

export default function InstructorDropdown({ onConfirm, loading = false }) {
    const [query, setQuery] = useState('');
    const [allInstructors, setAllInstructors] = useState([]);
    const [selectedMap, setSelectedMap] = useState({});
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            if (instructorCache) {
                setAllInstructors(instructorCache);
                return;
            }

            try {
                setFetching(true);
                setError('');
                const data = await permissionService.getInstructors();
                if (!mounted) return;
                instructorCache = data;
                setAllInstructors(data);
            } catch (err) {
                if (!mounted) return;
                setError(err.message || 'ไม่สามารถดึงรายชื่ออาจารย์จาก TU API ได้');
            } finally {
                if (mounted) setFetching(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return allInstructors;
        return allInstructors.filter((item) => {
            const nameTh = `${item.first_name_th || ''} ${item.last_name_th || ''}`.toLowerCase();
            const nameEn = `${item.first_name_en || ''} ${item.last_name_en || ''}`.toLowerCase();
            const email = (item.email || '').toLowerCase();
            return nameTh.includes(q) || nameEn.includes(q) || email.includes(q);
        });
    }, [allInstructors, query]);

    const selected = useMemo(() => Object.values(selectedMap), [selectedMap]);

    const toggleSelect = (instructor) => {
        setSelectedMap((prev) => {
            const next = { ...prev };
            if (next[instructor.tu_id]) {
                delete next[instructor.tu_id];
            } else {
                next[instructor.tu_id] = instructor;
            }
            return next;
        });
    };

    const removeSelected = (tuId) => {
        setSelectedMap((prev) => {
            const next = { ...prev };
            delete next[tuId];
            return next;
        });
    };

    const handleConfirm = async () => {
        if (selected.length === 0 || loading) return;
        await onConfirm(selected);
        setSelectedMap({});
        setQuery('');
    };

    return (
        <div className="rounded-b-lg border border-t-0 border-gray-200 p-4 bg-white space-y-3">
            <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ค้นหารายชื่อ"
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-lg focus:outline-none"
                />
            </div>

            {selected.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selected.map((item) => (
                        <button
                            key={item.tu_id}
                            type="button"
                            onClick={() => removeSelected(item.tu_id)}
                            className="px-3 py-1 rounded-full bg-[#E8F0FE] text-[#0C447C] text-lg"
                            title="กดเพื่อลบออกจากที่เลือก"
                        >
                            {getDisplayName(item)}
                        </button>
                    ))}
                </div>
            )}

            <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200">
                {fetching ? (
                    <p className="p-3 text-lg text-gray-500">กำลังโหลดรายชื่ออาจารย์...</p>
                ) : error ? (
                    <p className="p-3 text-lg text-red-600">{error}</p>
                ) : filtered.length === 0 ? (
                    <p className="p-3 text-lg text-gray-500">ไม่พบรายชื่อที่ค้นหา</p>
                ) : (
                    filtered.map((item) => {
                        const checked = !!selectedMap[item.tu_id];
                        return (
                            <label key={item.tu_id} className="flex items-center gap-3 px-3 py-2 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleSelect(item)}
                                    className="w-4 h-4"
                                />
                                <div className="min-w-0">
                                    <p className="text-xl text-gray-900 truncate">{getDisplayName(item)}</p>
                                    <p className="text-lg text-gray-500 truncate">{item.email}</p>
                                </div>
                            </label>
                        );
                    })
                )}
            </div>

            <button
                type="button"
                onClick={handleConfirm}
                disabled={selected.length === 0 || loading}
                className="w-full rounded-lg bg-[#050a9c] text-white py-2 text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'กำลังเพิ่มผู้ใช้...' : `เพิ่มที่เลือก (${selected.length})`}
            </button>
        </div>
    );
}
