/**
 * SummaryCard Component
 * การ์ดแสดงสถิติสรุป (รายวิชาทั้งหมด, เค้าโครง, ภาระงาน, รายงาน)
 */

import React from 'react';

const SummaryCard = ({ title, count, total, icon: Icon, color = 'green' }) => {
    // กำหนดสีตาม type
    const colorClasses = {
        blue: 'bg-white text-[#F1F1F1]',
        green: 'bg-white text-[#F1F1F1]',
        yellow: 'bg-white text-[#F1F1F1]',
        purple: 'bg-white text-[#F1F1F1]',
    };

    const bgClass = colorClasses[color] || colorClasses.green;

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-gray-600 text-2xl font-bold">{title}</p>

                    {total !== undefined ? (
                        // แสดงแบบ count/total
                        <div className="flex items-baseline gap-1">
                            <span className="text-7xl font-bold text-[#050C9C]">
                                {count}
                            </span>
                            <span className="text-2xl text-gray-400 font-medium">
                                /{total}
                            </span>
                        </div>
                    ) : (
                        // แสดงแค่ตัวเลข
                        <div className="text-7xl font-bold text-[#050C9C]">
                            {count}
                        </div>
                    )}

                    <p className="text-gray-500 text-xl mt-1">
                        {total !== undefined ? 'ส่งแล้ว' : 'รายวิชา'}
                    </p>
                </div>

                {/* Icon */}
                <div className={`${bgClass} w-32 h-32 flex items-end justify-center`}>
                    {Icon && <Icon sx={{ fontSize: 94, color: 'currentColor' }} />}
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;
