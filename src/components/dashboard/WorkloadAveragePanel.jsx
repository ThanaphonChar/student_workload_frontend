/**
 * WorkloadAveragePanel Component
 * แสดงค่าเฉลี่ยภาระงานแยกตามปีการศึกษา (ปี 1-4)
 */

import React from 'react';

const WorkloadAveragePanel = ({ averageData = [] }) => {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
                ภาระงานเฉลี่ยทั้งเทอม
            </h3>

            <div className="space-y-4">
                {averageData.map((item) => (
                    <div
                        key={item.yearLevel}
                        className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#050C9C] rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                    {item.yearLevel}
                                </span>
                            </div>
                            <span className="text-gray-700 font-medium">
                                ปี {item.yearLevel}
                            </span>
                        </div>

                        <div className="text-right">
                            <div className="text-2xl font-bold text-[#050C9C]">
                                {item.avgHours}
                            </div>
                            <div className="text-sm text-gray-500">hrs</div>
                        </div>
                    </div>
                ))}
            </div>

            {averageData.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                    ไม่มีข้อมูลภาระงาน
                </div>
            )}
        </div>
    );
};

export default WorkloadAveragePanel;
