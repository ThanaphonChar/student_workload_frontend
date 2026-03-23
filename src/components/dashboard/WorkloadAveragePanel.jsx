/**
 * WorkloadAveragePanel Component
 * แสดงค่าเฉลี่ยภาระงานแยกตามปีการศึกษา (ปี 1-4)
 */

import React from 'react';

const WorkloadAveragePanel = ({ averageData = [] }) => {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-5.5">
                ภาระงานเฉลี่ยทั้งเทอม
            </h3>

            <div className="space-y-4">
                {averageData.map((item) => (
                    <div
                        key={item.yearLevel}
                        className="bg-white shadow rounded-lg p-2 flex items-center justify-between"
                    >
                        <div>
                            <div className="text-gray-700 text-lg font-bold px-5">
                                ปี {item.yearLevel}
                            </div>
                            <div className="text-5xl font-bold text-[#050C9C] px-5">
                                {item.avgHours} <span className="text-xl text-gray-500">ชั่วโมง</span>
                            </div>

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
