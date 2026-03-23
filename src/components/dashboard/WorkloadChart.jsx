/**
 * WorkloadChart Component
 * Displays area chart of workload per week (1-16)
 * Filterable by student year via dropdown
 */

import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { DropdownMenu } from '../common/DropdownMenu';
import { CHART_CONFIG, STUDENT_YEARS } from '@/constants/dashboard';

const WorkloadChart = ({
    semester = '1',
    termYear = '2568',
    chartData = [],
    selectedYear = STUDENT_YEARS[0],
    onFilterChange,
}) => {

    const handleYearChange = (year) => {
        if (!year) return;

        onFilterChange?.([year]);
    };

    const hasData = chartData && chartData.length > 0;

    return (
        <Card className="col-span-3 bg-white rounded-xl shadow p-1">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>ภาระงานภาคการศึกษา {semester}/{termYear}</CardTitle>
                        <CardDescription>
                            แสดงภาระงานเฉลี่ยต่อสัปดาห์ (15 สัปดาห์)
                        </CardDescription>
                    </div>

                    <div className="flex items-center gap-4">
                        <DropdownMenu
                            trigger={
                                <button className="px-4 py-2 rounded-lg bg-white border-1 border-[#F1F1F1] hover:bg-gray-50 focus:outline-none text-left flex items-center justify-between min-w-[100px]">
                                    <span className="text-[#989898] font-bold text-xl">{`ชั้นปี ${selectedYear}`}</span>
                                    <span className="material-symbols-outlined text-[#989898] ml-2">
                                        expand_more
                                    </span>
                                </button>
                            }
                            items={STUDENT_YEARS.map((year) => ({
                                id: year,
                                label: `ชั้นปี ${year}`,
                                onClick: () => handleYearChange(year),
                            }))}
                            position="left"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {hasData ? (
                    <div className="w-full h-[260px] sm:h-[320px] lg:h-[380px]">
                        <ChartContainer config={CHART_CONFIG} className="h-full w-full aspect-auto">
                            <AreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{ top: 8, right: 12, left: 12, bottom: 24 }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="week"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    label={{ value: 'สัปดาห์', position: 'insideBottom', offset: -12 }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    width={44}
                                    label={{ value: 'ชั่วโมง', angle: -90, position: 'insideLeft' }}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <Area
                                    dataKey="totalHours"
                                    type="linear"
                                    fill="var(--color-total_hours)"
                                    fillOpacity={0}
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
            <p className="mt-2 text-2xl">ไม่พบข้อมูลภาระงาน</p>
        </div>
    </div>
);

export default WorkloadChart;
