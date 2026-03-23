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
import { DropdownMenu } from '../../components/common/DropdownMenu';

const DashboardPage = () => {
    const [selectedYears, setSelectedYears] = useState([1]);

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

    const formatThaiDate = (dateValue) => {
        if (!dateValue) return '-';

        return new Date(dateValue).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const currentTerm = allTerms.find(t => t.id === selectedTermId);

    if (isLoading) {
        return (
            <AppShell title="แดชบอร์ด">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050C9C] mx-auto"></div>
                        <p className="mt-4 text-gray-600 text-xl">กำลังโหลดข้อมูล...</p>
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
                <label className="text-2xl text-gray-700 whitespace-nowrap">
                    เลือกภาคการศึกษา:
                </label>
                <div className="flex-1 flex items-center gap-4">
                    <DropdownMenu
                        trigger={
                            <button className="flex-none w-64 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none text-left flex items-center justify-between">
                                <span className="text-gray-900 text-xl truncate">
                                    {currentTerm
                                        ? `ภาคการศึกษา ${currentTerm.academic_sector}/${currentTerm.academic_year}${currentTerm.is_active ? ' (ปัจจุบัน)' : ''}`
                                        : 'เลือกภาคการศึกษา'
                                    }
                                </span>
                                <span className="material-symbols-outlined text-gray-500">
                                    expand_more
                                </span>
                            </button>
                        }
                        items={allTerms.map(term => ({
                            id: term.id,
                            label: `ภาคการศึกษา ${term.academic_sector}/${term.academic_year}${term.is_active ? ' (ปัจจุบัน)' : ''}`,
                            onClick: () => handleTermChange(term.id)
                        }))}
                        position="left"
                        className="w-96 max-h-96 overflow-y-auto"
                    />
                    {currentTerm && (
                        <span className="text-2xl text-gray-600">
                            {formatThaiDate(currentTerm.term_start_date)} - {formatThaiDate(currentTerm.term_end_date)}
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

                <div className="grid grid-cols-4 gap-6">
                    <div className="col-span-1">
                        <WorkloadAveragePanel averageData={averageWorkload} />
                    </div>
                    <div className="col-span-3">
                        <WorkloadChart
                            semester={currentTerm?.academic_sector || 'ภาคการศึกษา'}
                            termYear={currentTerm?.academic_year || 'ปีการศึกษา'}
                            chartData={chartData}
                            selectedYear={selectedYears[0]}
                            onFilterChange={handleYearFilterChange}
                        />
                    </div>
                </div>
            </div>
        </AppShell>
    );
};

export default DashboardPage;
