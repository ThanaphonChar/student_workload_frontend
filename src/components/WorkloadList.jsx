/**
 * WorkloadList Component
 * แสดงรายการภาระงานทั้งหมด
 */

import { useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';

const WorkloadList = ({ workloads = [], termSubjectData, onEdit, onRefresh }) => {
    const [loading, setLoading] = useState(false);

    // Format date จาก YYYY-MM-DD เป็น DD เดือน YYYY
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        
        const date = new Date(dateString);
        const day = date.getDate();
        const months = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];
        const month = months[date.getMonth()];
        const year = date.getFullYear() + 543; // แปลง ค.ศ. เป็น พ.ศ.
        
        return `${day} ${month} ${year}`;
    };

    return (
        <div>
            {/* Table Header */}
            <div className="bg-[#050C9C] grid grid-cols-12 gap-4 px-6 py-4 text-white font-medium">
                <div className="col-span-4">ชื่องาน</div>
                <div className="col-span-3 text-center">เริ่มต้น</div>
                <div className="col-span-3 text-center">สิ้นสุด</div>
                <div className="col-span-2 text-center">ชั่วโมง/สัปดาห์</div>
            </div>

            {/* Table Body - Each row is a separate card */}
            {workloads && workloads.length > 0 ? (
                <div className="p-4 space-y-3">
                    {workloads.map((work, index) => (
                        <div 
                            key={work.id || index}
                            className="bg-gray-50 rounded-lg px-6 py-4 hover:bg-gray-100 transition-colors"
                        >
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-4 text-gray-900">
                                    {work.work_title}
                                </div>
                                <div className="col-span-3 text-center text-gray-900">
                                    {formatDate(work.start_date)}
                                </div>
                                <div className="col-span-3 text-center text-gray-900">
                                    {formatDate(work.end_date)}
                                </div>
                                <div className="col-span-1 text-center text-gray-900">
                                    {work.hours_per_week}
                                </div>
                                <div className="col-span-1 text-center">
                                    <button
                                        onClick={() => onEdit && onEdit(work)}
                                        className="text-[#050C9C] hover:text-[#040a7a] transition-colors"
                                        title="แก้ไข"
                                    >
                                        <FiEdit2 className="w-5 h-5 mx-auto" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-12 text-center">
                    <div className="text-gray-400 mb-3">
                        <svg
                            className="w-16 h-16 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <p className="text-lg font-medium text-red-500 mb-1">ยังไม่มีภาระงาน</p>
                    <p className="text-sm text-gray-500">
                        กรุณาเพิ่มภาระงานเพื่อให้ระบบสามารถคำนวณภาระงานได้
                    </p>
                </div>
            )}
        </div>
    );
};

export default WorkloadList;
