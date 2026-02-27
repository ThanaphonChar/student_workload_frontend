/**
 * DashboardPage - Clean Architecture
 * Responsibilities: Layout and orchestration only
 * Business logic delegated to: useDashboardData hook
 */

import React, { useState, useEffect } from 'react';
import AppShell from '../../components/layout/AppShell';
import SummaryCard from '../../components/dashboard/SummaryCard';
import WorkloadAveragePanel from '../../components/dashboard/WorkloadAveragePanel';
import WorkloadChart from '../../components/dashboard/WorkloadChart';
import { useDashboardData } from '../../hooks/useDashboardData';
import { STAT_CARD_CONFIG } from '../../constants/dashboard';

const DashboardPage = () => {
    const [selectedYears, setSelectedYears] = useState([1, 2, 3, 4]);

    const {
        stats,
        averageWorkload,
        chartData,
        activeTerm,
        allTerms,
        selectedTermId,
        setSelectedTermId,
        isLoading,
        error
    } = useDashboardData(selectedYears);

    const handleTermChange = (termId) => {
        setSelectedTermId(parseInt(termId));
    };

    const handleYearFilterChange = (newYears) => {
        setSelectedYears(newYears);
    };

    const currentTerm = allTerms.find(t => t.id === selectedTermId);

    if (isLoading) {
        return (
            <AppShell title="แดชบอร์ด">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050C9C] mx-auto"></div>
                        <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
                    </div>
                </div>
            </AppShell>
        );
    }

    if (error) {
        return (
            <AppShell title="แดชบอร์ด">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">เกิดข้อผิดพลาด</h3>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell title="แดชบอร์ด">
            <div className="mb-6 flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">เลือกภาคการศึกษา:</label>
                <div className="flex-1 flex items-center gap-4">
                    <select
                        value={selectedTermId || ''}
                        onChange={(e) => handleTermChange(e.target.value)}
                        className="flex-none w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#050C9C]"
                    >
                        <option value="" disabled>เลือกภาคการศึกษา</option>
                        {allTerms.map(term => (
                            <option key={term.id} value={term.id}>
                                ภาคการศึกษา {term.academic_sector}/{term.academic_year}
                                {term.is_active && ' (ปัจจุบัน)'}
                            </option>
                        ))}
                    </select>
                    {currentTerm && (
                        <span className="text-sm text-gray-600">
                            {new Date(currentTerm.term_start_date).toLocaleDateString('th-TH')} - {new Date(currentTerm.term_end_date).toLocaleDateString('th-TH')}
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-4 gap-6">
                    {STAT_CARD_CONFIG.map((config) => {
                        const value = stats?.[config.valueKey];

                        return (
                            <SummaryCard
                                key={config.key}
                                title={config.title}
                                count={typeof value === 'object' ? value?.count || 0 : value || 0}
                                total={typeof value === 'object' ? value?.total : undefined}
                                icon={config.icon}
                                color={config.color}
                            />
                        );
                    })}
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <WorkloadAveragePanel averageData={averageWorkload} />
                    <WorkloadChart
                        semester={currentTerm?.academic_sector || '1'}
                        termYear={currentTerm?.academic_year || '2568'}
                        chartData={chartData}
                        onFilterChange={handleYearFilterChange}
                    />
                </div>
            </div>
        </AppShell>
    );
};

export default DashboardPage;
