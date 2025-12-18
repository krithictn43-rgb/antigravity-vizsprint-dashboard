import React, { useEffect, useState } from 'react';
import api from '../api';
import MetricsCard from './MetricsCard';
import CohortHeatmap from './CohortHeatmap';
import FunnelChart from './FunnelChart';
import ABTestResults from './ABTestResults';
import UserSessions from './UserSessions';
import KPITimeSeries from './KPITimeSeries';

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api.get('/metrics');
                setMetrics(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching metrics:', err);
                setError('Failed to load dashboard data');
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/20 border-l-4 border-red-400 p-4">
                <div className="flex">
                    <div className="ml-3">
                        <p className="text-sm text-red-300">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <MetricsCard title="Total Users" value={metrics.total_users.toLocaleString()} subtext="Registered users" />
                <MetricsCard title="Active Users" value={metrics.active_users.toLocaleString()} subtext="Last 30 days" />
                <MetricsCard title="Conversion Rate" value={`${metrics.conversion_rate}%`} subtext="Task completion" />
            </div>

            {/* KPI Time Series */}
            <div className="bg-slate-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium leading-6 text-white mb-4">KPI Trends</h3>
                <KPITimeSeries />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-slate-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium leading-6 text-white mb-4">Conversion Funnel</h3>
                    <FunnelChart />
                </div>
            </div>

            {/* Detailed components stacked */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-slate-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium leading-6 text-white mb-4">Cohort Retention Analysis</h3>
                    <CohortHeatmap />
                </div>
                <div className="bg-slate-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium leading-6 text-white mb-4">A/B Test Results</h3>
                    <ABTestResults />
                </div>
                <div className="bg-slate-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium leading-6 text-white mb-4">User Activity Tracking</h3>
                    <UserSessions />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
