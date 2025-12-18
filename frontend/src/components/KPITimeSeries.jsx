import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../api';

const KPITimeSeries = () => {
    const [data, setData] = useState([]);
    const [metric, setMetric] = useState('dau'); // 'dau' or 'signups'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/kpi-time-series');
                setData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching KPI data:', err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="h-64 flex items-center justify-center text-slate-400">Loading...</div>;

    const formatXAxis = (tickItem) => {
        const date = new Date(tickItem);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    return (
        <div className="w-full">
            <div className="flex justify-end mb-4">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                        type="button"
                        onClick={() => setMetric('dau')}
                        className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${metric === 'dau'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
                            }`}
                    >
                        DAU
                    </button>
                    <button
                        type="button"
                        onClick={() => setMetric('signups')}
                        className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${metric === 'signups'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
                            }`}
                    >
                        Signups
                    </button>
                </div>
            </div>

            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            tickFormatter={formatXAxis}
                            minTickGap={30}
                        />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                            itemStyle={{ color: '#f8fafc' }}
                            labelStyle={{ color: '#94a3b8' }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey={metric}
                            name={metric === 'dau' ? 'Daily Active Users' : 'Signups per Day'}
                            stroke={metric === 'dau' ? '#3b82f6' : '#10b981'}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default KPITimeSeries;
