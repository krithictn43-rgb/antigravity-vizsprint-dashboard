import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import api from '../api';

const FunnelChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/funnel');
                setData(response.data.funnel);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching funnel data:', err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="h-64 flex items-center justify-center text-slate-400">Loading...</div>;

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{
                        top: 5,
                        right: 30,
                        left: 40,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="stage"
                        type="category"
                        width={100}
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: '#334155' }}
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-700">
                                        <p className="font-medium text-white">{label}</p>
                                        <p className="text-blue-400 text-sm">Users: {data.users}</p>
                                        <p className="text-slate-400 text-xs">Conversion: {data.conversion_from_previous}%</p>
                                        <p className="text-red-400 text-xs">Drop-off: {data.drop_off}%</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="users" radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#60a5fa'} fillOpacity={1 - (index * 0.15)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FunnelChart;
