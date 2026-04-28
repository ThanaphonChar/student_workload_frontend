/**
 * StudentDashboardPage
 * Clean, simple student dashboard with subject chip filtering
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import { DropdownMenu } from '../../components/common/DropdownMenu';
import { getAllTerms } from '../../services/termService';
import * as dashboardService from '../../services/dashboardService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const COLORS = ['#050C9C', '#1D9E75', '#D85A30', '#D4537E', '#BA7517'];
const BG_COLORS = ['#E6F1FB', '#E1F5EE', '#FAECE7', '#FBEAF0', '#FAEEDA'];
const TEXT_COLORS = ['#0C447C', '#085041', '#712B13', '#72243E', '#633806'];

const CHART_CONFIG = {
    hours: { label: 'ชั่วโมง', color: '#050C9C' },
};

const STUDENT_YEARS = [1, 2, 3, 4];

/**
 * Subject chips for filtering
 */
const SubjectChips = ({ termSubjects, selectedIds, onSelectionChange }) => {
    const allSelected = selectedIds.size === termSubjects.length && termSubjects.length > 0;

    const handleSelectAll = () => {
        onSelectionChange(
            allSelected
                ? new Set()
                : new Set(termSubjects.map(ts => ts.id))
        );
    };

    const handleToggle = (subjectId) => {
        const next = new Set(selectedIds);
        next.has(subjectId) ? next.delete(subjectId) : next.add(subjectId);
        onSelectionChange(next);
    };

    return (
        <div className="bg-white rounded-xl shadow px-6 py-4">
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={handleSelectAll}
                    className={`px-4 py-2 rounded-full text-base font-medium transition-colors ${allSelected
                        ? 'bg-[#050C9C] text-white'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    ทั้งหมด
                </button>

                {termSubjects.map((subject, index) => {
                    const isSelected = selectedIds.has(subject.id);
                    const colorIdx = index % COLORS.length;
                    return (
                        <button
                            key={subject.id}
                            onClick={() => handleToggle(subject.id)}
                            className={`px-4 py-2 rounded-full text-base font-medium transition-colors ${isSelected
                                ? ''
                                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            style={isSelected ? {
                                backgroundColor: BG_COLORS[colorIdx],
                                color: TEXT_COLORS[colorIdx],
                            } : {}}
                        >
                            {subject.code_eng || subject.code_th}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

/**
 * Stat cards — styled like SummaryCard
 */
const StatCards = ({ selectedSubjects, weeks = 15 }) => {
    const selectedCount = selectedSubjects.length;

    const totalWeeklyHours = useMemo(() => {
        return selectedSubjects.reduce((sum, s) => {
            return sum + (s.weekly_hours || []).reduce((a, b) => a + b, 0);
        }, 0);
    }, [selectedSubjects]);

    const avgHoursPerWeek = weeks > 0 ? (totalWeeklyHours / weeks).toFixed(1) : '0.0';

    const totalWorkloadCount = useMemo(() => {
        return selectedSubjects.reduce((sum, s) => sum + (s.workload_count || 0), 0);
    }, [selectedSubjects]);

    const cards = [
        { label: 'รายวิชาที่เลือก', value: selectedCount, suffix: 'รายวิชา' },
        { label: 'ชั่วโมง/สัปดาห์เฉลี่ย', value: avgHoursPerWeek, suffix: 'ชั่วโมง' },
        { label: 'ภาระงานทั้งหมด', value: totalWorkloadCount, suffix: 'รายการ' },
    ];

    return (
        <div className="grid grid-cols-3 gap-6">
            {cards.map((card) => (
                <div key={card.label} className="bg-white rounded-xl shadow p-6">
                    <p className="text-gray-600 text-2xl font-bold">{card.label}</p>
                    <div className="text-7xl font-bold text-[#050C9C] mt-1">{card.value}</div>
                    <p className="text-gray-500 text-xl mt-1">{card.suffix}</p>
                </div>
            ))}
        </div>
    );
};

/**
 * Subject list — styled like WorkloadAveragePanel
 */
const SubjectList = ({ termSubjects, selectedIds, onSelectionChange }) => {
    const navigate = useNavigate();

    const handleRowClick = (subject) => {
        navigate(`/term-subjects/${subject.id}/workload`, {
            state: {
                fromPath: '/dashboard/student',
                fromLabel: 'แดชบอร์ดนักศึกษา',
                subjectCode: subject.code_eng || subject.code_th,
            },
        });
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 h-[420px] flex flex-col">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex-shrink-0">รายวิชา</h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {termSubjects.map((subject, index) => {
                    const isSelected = selectedIds.has(subject.id);
                    const colorIdx = index % COLORS.length;
                    const dotColor = isSelected ? COLORS[colorIdx] : '#D1D5DB';

                    return (
                        <div
                            key={subject.id}
                            onClick={() => handleRowClick(subject)}
                            className={`bg-white shadow rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-50'
                                }`}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: dotColor }}
                                />
                                <div className="min-w-0">
                                    <div className="text-gray-700 text-2xl font-bold">
                                        {subject.code_eng || subject.code_th}
                                    </div>
                                    <div className="text-gray-600 text-lg truncate mr-4">
                                        {subject.name_th || subject.name_eng}
                                    </div>
                                    <div className="text-gray-400 text-md">
                                        {subject.workload_count || 0} งาน
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <div className="text-5xl font-bold text-[#050C9C]">
                                        {subject.total_hours || 0}
                                    </div>
                                    <div className="text-md text-gray-400">ชั่วโมง</div>
                                </div>
                                <span className="material-symbols-outlined text-gray-400 text-2xl">
                                    chevron_right
                                </span>
                            </div>
                        </div>
                    );
                })}

                {termSubjects.length === 0 && (
                    <div className="text-center text-gray-400 py-8 text-lg">
                        ไม่มีข้อมูลรายวิชา
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Workload chart — styled like WorkloadChart component
 */
const WorkloadChart = ({ selectedSubjects, weeks = 15, currentTerm }) => {
    const chartData = useMemo(() => {
        const totals = Array(weeks).fill(0);
        selectedSubjects.forEach(subject => {
            (subject.weekly_hours || []).forEach((h, i) => {
                if (i < weeks) totals[i] += h;
            });
        });
        return Array.from({ length: weeks }, (_, i) => ({
            week: i + 1,
            hours: totals[i],
        }));
    }, [selectedSubjects, weeks]);

    return (
        <Card className="bg-white rounded-xl shadow p-1">
            <CardHeader>
                <CardTitle>
                    ภาระงานภาคการศึกษา
                    {currentTerm ? ` ${currentTerm.academic_sector}/${currentTerm.academic_year}` : ''}
                </CardTitle>
                <CardDescription>แสดงภาระงานรวมต่อสัปดาห์ (15 สัปดาห์)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[280px]">
                    <ChartContainer config={CHART_CONFIG} className="h-full w-full aspect-auto">
                        <AreaChart
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
                                dataKey="hours"
                                type="linear"
                                fill="var(--color-hours)"
                                fillOpacity={0.15}
                                stroke="var(--color-hours)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
};

/**
 * Main StudentDashboardPage
 */
const StudentDashboardPage = () => {
    const [allTerms, setAllTerms] = useState([]);
    const [selectedTermId, setSelectedTermId] = useState(null);
    const [termSubjects, setTermSubjects] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [selectedYear, setSelectedYear] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const currentTerm = useMemo(
        () => allTerms.find(t => t.id === selectedTermId),
        [allTerms, selectedTermId]
    );

    // Filter subjects by selected year level
    const yearFilteredSubjects = useMemo(() => {
        if (!selectedYear) return termSubjects;
        return termSubjects.filter(s => (s.student_year_ids || []).includes(selectedYear));
    }, [termSubjects, selectedYear]);

    const selectedSubjects = useMemo(
        () => yearFilteredSubjects.filter(ts => selectedIds.has(ts.id)),
        [yearFilteredSubjects, selectedIds]
    );

    // When year changes, reset selectedIds to all subjects in that year
    const handleYearChange = (year) => {
        setSelectedYear(year);
        const filtered = year
            ? termSubjects.filter(s => (s.student_year_ids || []).includes(year))
            : termSubjects;
        setSelectedIds(new Set(filtered.map(s => s.id)));
    };

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                setLoading(true);
                const terms = await getAllTerms();
                if (!terms || terms.length === 0) {
                    setError('ไม่พบข้อมูลภาคการศึกษา');
                    return;
                }
                setAllTerms(terms);
                const activeTerm = terms.find(t => t.is_active);
                setSelectedTermId(activeTerm ? activeTerm.id : terms[0].id);
            } catch (err) {
                setError(err?.message || 'ไม่สามารถโหลดข้อมูลภาคการศึกษา');
            } finally {
                setLoading(false);
            }
        };
        fetchTerms();
    }, []);

    useEffect(() => {
        if (!selectedTermId) return;
        const fetchTermSubjects = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await dashboardService.getStudentTermSubjects(selectedTermId);
                const subjects = Array.isArray(data) ? data : (data?.subjects || []);
                setTermSubjects(subjects);
                setSelectedIds(new Set(subjects.map(ts => ts.id)));
                setSelectedYear(null);
            } catch (err) {
                setError(err?.message || 'ไม่สามารถโหลดข้อมูลรายวิชา');
                setTermSubjects([]);
                setSelectedIds(new Set());
            } finally {
                setLoading(false);
            }
        };
        fetchTermSubjects();
    }, [selectedTermId]);

    if (loading) {
        return (
            <AppShell title="แดชบอร์ดนักศึกษา">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050C9C] mx-auto" />
                        <p className="mt-4 text-gray-600 text-xl">กำลังโหลดข้อมูล...</p>
                    </div>
                </div>
            </AppShell>
        );
    }

    if (error) {
        return (
            <AppShell title="แดชบอร์ดนักศึกษา">
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
        <AppShell title="แดชบอร์ดนักศึกษา">
            {/* Header — matches DashboardPage */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ดนักศึกษา</h1>
                <div className="flex items-center gap-3">
                    <DropdownMenu
                        trigger={
                            <button className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none text-left flex items-center justify-between min-w-[130px]">
                                <span className="text-gray-900 text-xl">
                                    {selectedYear ? `ชั้นปี ${selectedYear}` : 'ทุกชั้นปี'}
                                </span>
                                <ExpandMoreIcon className="text-gray-500 ml-2" fontSize="small" />
                            </button>
                        }
                        items={[
                            { id: null, label: 'ทุกชั้นปี', onClick: () => handleYearChange(null) },
                            ...STUDENT_YEARS.map(y => ({
                                id: y,
                                label: `ชั้นปี ${y}`,
                                onClick: () => handleYearChange(y),
                            })),
                        ]}
                        position="left"
                    />
                    <DropdownMenu
                        trigger={
                            <button className="flex-none w-64 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none text-left flex items-center justify-between">
                                <span className="text-gray-900 text-xl truncate">
                                    {currentTerm
                                        ? `ภาคการศึกษา ${currentTerm.academic_sector}/${currentTerm.academic_year}${currentTerm.is_active ? ' (ปัจจุบัน)' : ''}`
                                        : 'เลือกภาคการศึกษา'}
                                </span>
                                <ExpandMoreIcon className="text-gray-500" fontSize="small" />
                            </button>
                        }
                        items={allTerms.map(term => ({
                            id: term.id,
                            label: `ภาคการศึกษา ${term.academic_sector}/${term.academic_year}${term.is_active ? ' (ปัจจุบัน)' : ''}`,
                            onClick: () => setSelectedTermId(term.id),
                        }))}
                        position="left"
                        className="w-96 max-h-96 overflow-y-auto"
                    />
                </div>
            </div>

            <div className="space-y-6">
                {/* Stat cards */}
                <StatCards selectedSubjects={selectedSubjects} weeks={15} />

                {/* Subject chips */}
                <SubjectChips
                    termSubjects={yearFilteredSubjects}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                />

                {/* Subject list + chart — matches DashboardPage col-span-1 / col-span-3 */}
                <div className="grid grid-cols-4 gap-6">
                    <div className="col-span-1">
                        <SubjectList
                            termSubjects={yearFilteredSubjects}
                            selectedIds={selectedIds}
                            onSelectionChange={setSelectedIds}
                        />
                    </div>
                    <div className="col-span-3">
                        <WorkloadChart
                            selectedSubjects={selectedSubjects}
                            weeks={15}
                            currentTerm={currentTerm}
                        />
                    </div>
                </div>
            </div>
        </AppShell>
    );
};

export default StudentDashboardPage;
