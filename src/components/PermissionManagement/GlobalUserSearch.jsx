import SearchIcon from '@mui/icons-material/Search';

export default function GlobalUserSearch({ value, onChange }) {
    return (
        <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="ค้นหาผู้ใช้ทุกส่วน (ชื่อ / นามสกุล / อีเมล)"
                className="w-full bg-[#F1F1F1] rounded-full pl-10 pr-4 py-2 text-xl text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
        </div>
    );
}
