import React, { useEffect, useState } from 'react';
import api from '../api';

const CohortHeatmap = () => {
    const [data, setData] = useState([]);
    const [maxMonths, setMaxMonths] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/cohorts');
                setData(response.data.cohorts);
                setMaxMonths(response.data.max_months);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching cohort data:', err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="h-64 flex items-center justify-center text-slate-400">Loading...</div>;

    const getBackgroundColor = (value) => {
        if (value === 0) return 'bg-slate-800';
        if (value < 20) return 'bg-blue-950';
        if (value < 40) return 'bg-blue-900';
        if (value < 60) return 'bg-blue-700';
        if (value < 80) return 'bg-blue-600';
        return 'bg-blue-500';
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-300 uppercase tracking-wider sticky left-0 bg-slate-700">Cohort</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Users</th>
                        {[...Array(maxMonths + 1)].map((_, i) => (
                            <th key={i} className="px-3 py-2 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                                Month {i}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                    {data.map((row) => (
                        <tr key={row.cohort}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-white sticky left-0 bg-slate-800">
                                {row.cohort}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-300">
                                {row.size}
                            </td>
                            {[...Array(maxMonths + 1)].map((_, i) => {
                                const value = row[`month_${i}`];
                                return (
                                    <td
                                        key={i}
                                        className={`px-3 py-2 whitespace-nowrap text-sm text-center ${getBackgroundColor(value)}`}
                                        title={`${value}% retention`}
                                    >
                                        {value > 0 ? `${value}%` : '-'}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CohortHeatmap;
