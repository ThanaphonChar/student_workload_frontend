/**
 * SummaryCard Component
 * การ์ดแสดงสถิติสรุป (รายวิชาทั้งหมด, เค้าโครง, ภาระงาน, รายงาน)
 */

import React from 'react';
import { FiFileText, FiCheckCircle, FiClipboard } from 'react-icons/fi';

const SummaryCard = ({ title, count, total, icon: Icon, color = 'green' }) => {
    // กำหนดสีตาม type
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        purple: 'bg-purple-50 text-purple-600'
    };

    const bgClass = colorClasses[color] || colorClasses.green;

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>

                    {total !== undefined ? (
                        // แสดงแบบ count/total
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-bold text-[#050C9C]">
                                {count}
                            </span>
                            <span className="text-2xl text-gray-400 font-medium">
                                /{total}
                            </span>
                        </div>
                    ) : (
                        // แสดงแค่ตัวเลข
                        <div className="text-5xl font-bold text-[#050C9C]">
                            {count}
                        </div>
                    )}

                    <p className="text-gray-500 text-sm mt-1">
                        {total !== undefined ? 'ส่งแล้ว' : 'รายวิชา'}
                    </p>
                </div>

                {/* Icon */}
                <div className={`${bgClass} rounded-full p-4`}>
                    {Icon && <Icon className="w-8 h-8" />}
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;
