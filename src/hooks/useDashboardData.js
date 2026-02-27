/**
 * Custom Hook: useDashboardData
 * Single responsibility: Fetch all dashboard data
 * Returns: { stats, averageWorkload, chartData, activeTerm, allTerms, selectedTermId, setSelectedTermId, isLoading, error }
 */

import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import { getAllTerms } from '../services/termService';

export function useDashboardData(selectedYears = [1, 2, 3, 4]) {
    const [selectedTermId, setSelectedTermId] = useState(null);
    const [state, setState] = useState({
        stats: null,
        averageWorkload: [],
        chartData: [],
        activeTerm: null,
        allTerms: [],
        isLoading: true,
        error: null
    });

    // Fetch all terms and active term on mount
    useEffect(() => {
        async function fetchInitialData() {
            try {
                setState(prev => ({ ...prev, isLoading: true, error: null }));

                const [termsData, activeTermData] = await Promise.all([
                    getAllTerms(),
                    dashboardService.getActiveTerm()
                ]);

                // Validate data before setting state
                if (!termsData || termsData.length === 0) {
                    throw new Error('ไม่พบข้อมูลภาคการศึกษา');
                }

                // Set selectedTermId ทันทีใน effect เดียวกัน (with null check)
                if (activeTermData && activeTermData.id) {
                    setSelectedTermId(activeTermData.id);
                } else if (termsData.length > 0) {
                    // Fallback: ใช้ term แรกถ้าไม่มี active term
                    setSelectedTermId(termsData[0].id);
                }

                setState(prev => ({
                    ...prev,
                    allTerms: termsData,
                    activeTerm: activeTermData || termsData[0],
                    isLoading: false
                }));
            } catch (err) {
                console.error('❌ Failed to fetch initial data:', err);
                setState(prev => ({
                    ...prev,
                    error: err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณา login ใหม่',
                    isLoading: false
                }));
            }
        }

        fetchInitialData();
    }, []);

    // Fetch dashboard data when term or year filter changes
    useEffect(() => {
        if (!selectedTermId) return;

        async function fetchDashboardData() {
            try {
                setState(prev => ({ ...prev, isLoading: true, error: null }));

                const [statsData, avgData, chartDataResult] = await Promise.all([
                    dashboardService.getSummaryStatistics(selectedTermId),
                    dashboardService.getAverageWorkload(selectedTermId),
                    dashboardService.getWorkloadChart(selectedTermId, selectedYears)
                ]).catch(err => {
                    console.error('❌ Promise.all failed:', err);
                    throw err;
                });

                // Debug: ดู response shape
                console.log('📊 statsData:', statsData);
                console.log('📊 avgData:', avgData);
                console.log('📊 chartDataResult:', chartDataResult);

                // Validate data
                if (!statsData && !avgData && !chartDataResult) {
                    throw new Error('ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่อ');
                }

                setState(prev => ({
                    ...prev,
                    stats: statsData?.statistics || statsData,
                    averageWorkload: avgData?.averageByYear || [],
                    chartData: chartDataResult?.chartData || [],
                    isLoading: false
                }));
            } catch (err) {
                console.error('❌ Failed to fetch dashboard data:', err);
                setState(prev => ({
                    ...prev,
                    error: err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง',
                    isLoading: false
                }));
            }
        }

        fetchDashboardData();
    }, [selectedTermId, selectedYears.join(',')]);

    return {
        ...state,
        selectedTermId,
        setSelectedTermId
    };
}
