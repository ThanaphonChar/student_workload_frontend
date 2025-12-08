/**
 * SubjectCard Component
 * แสดงข้อมูลรายวิชาในรูปแบบการ์ด
 */

export const SubjectCard = ({ subject, onDelete }) => {
    const handleDelete = () => {
        if (window.confirm(`คุณต้องการลบรายวิชา "${subject.name_th}" ใช่หรือไม่?`)) {
            onDelete(subject.id);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200">
            <div className="flex justify-between items-center">
                {/* Left - Code & Name */}
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-[20px] font-bold text-gray-900">
                            {subject.code_th || subject.code_eng}
                        </h3>
                        {subject.code_eng && subject.code_th !== subject.code_eng && (
                            <span className="text-[14px] text-gray-500">
                                ({subject.code_eng})
                            </span>
                        )}
                    </div>
                    <p className="text-[14px] text-gray-600 mt-1">
                        {subject.name_th}
                    </p>
                    {subject.name_eng && (
                        <p className="text-[12px] text-gray-400 uppercase mt-0.5">
                            {subject.name_eng}
                        </p>
                    )}
                </div>

                {/* Right - Program, Credit, Actions */}
                <div className="flex items-center gap-6">
                    {/* Program Year */}
                    <div className="text-center">
                        <p className="text-[12px] text-gray-500">หลักสูตร</p>
                        <p className="text-[16px] font-semibold text-gray-900">
                            {subject.program_year || '-'}
                        </p>
                    </div>

                    {/* Credit */}
                    <div className="text-center">
                        <p className="text-[12px] text-gray-500">หน่วยกิต</p>
                        <p className="text-[16px] font-semibold text-gray-900">
                            {subject.credit}
                        </p>
                    </div>

                    {/* Student Year */}
                    <div className="text-center">
                        <p className="text-[12px] text-gray-500">ชั้นปี</p>
                        <p className="text-[16px] font-semibold text-gray-900">
                            {subject.student_year || '-'}
                        </p>
                    </div>

                    {/* Status Badge */}
                    <div>
                        {subject.is_active ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-green-100 text-green-800">
                                เปิดใช้งาน
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-gray-100 text-gray-800">
                                ปิดใช้งาน
                            </span>
                        )}
                    </div>

                    {/* Delete Button */}
                    <button
                        onClick={handleDelete}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="ลบรายวิชา"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            delete
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubjectCard;
