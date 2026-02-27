/**
 * WorkloadChart Component
 * Displays area chart of workload per week (1-16)
 * Filterable by student year via checkboxes
 */

import React, { useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { CHART_CONFIG, STUDENT_YEARS } from '@/constants/dashboard';

const WorkloadChart = ({ semester = '1', termYear = '2568', chartData = [], onFilterChange }) => {
    const [selectedYears, setSelectedYears] = useState(STUDENT_YEARS);

    const handleYearToggle = (year) => {
        const newSelection = selectedYears.includes(year)
            ? selectedYears.filter(y => y !== year)
            : [...selectedYears, year].sort();

        if (newSelection.length === 0) return;

        setSelectedYears(newSelection);
        onFilterChange?.(newSelection);
    };

    const hasData = chartData && chartData.length > 0;

    return (
        <Card className="col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>ภาระงานภาคการศึกษา {semester}/{termYear}</CardTitle>
                        <CardDescription>
                            แสดงภาระงานเฉลี่ยต่อสัปดาห์ (16 สัปดาห์)
                        </CardDescription>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 font-medium">ชั้นปี</span>
                        {STUDENT_YEARS.map((year) => (
                            <label
                                key={year}
                                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedYears.includes(year)}
                                    onChange={() => handleYearToggle(year)}
                                    className="w-4 h-4 text-[#050C9C] border-gray-300 rounded focus:ring-[#050C9C]"
                                />
                                <span className="text-sm font-medium text-gray-700">{year}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {hasData ? (
                    <div style={{ width: '100%', height: 400 }}>
                        <ChartContainer config={CHART_CONFIG} className="h-full w-full">
                            <AreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{ left: 12, right: 12 }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="week"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => `สัปดาห์ ${value}`}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <Area
                                    dataKey="totalHours"
                                    type="natural"
                                    fill="var(--color-total_hours)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-total_hours)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                ) : (
                    <EmptyChartState />
                )}
            </CardContent>
        </Card>
    );
};

const EmptyChartState = () => (
    <div className="flex items-center justify-center h-[300px] text-gray-400">
        <div className="text-center">
            <svg
                className="mx-auto h-12 w-12 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
            </svg>
            <p className="mt-2 text-sm">ไม่พบข้อมูลภาระงาน</p>
        </div>
    </div>
);

export default WorkloadChart;
