import React, { useEffect, useState } from 'react';
import api from '../api';

const UserSessions = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('total_hours');

    useEffect(() => {
        fetchData();
    }, [sortBy]);

    const fetchData = async () => {
        try {
            const response = await api.get(`/user-sessions?limit=50&sort_by=${sortBy}`);
            setData(response.data.user_sessions);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching user sessions:', err);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div className="h-64 flex items-center justify-center text-slate-400">Loading...</div>;

    return (
        <div className="space-y-4">
            {/* Header with sorting */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-slate-400">
                    Showing top 50 users by activity
                </div>
                <div className="flex gap-2">
                    <label className="text-sm text-slate-400">Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-slate-700 text-white text-sm rounded px-2 py-1 border border-slate-600 focus:outline-none focus:border-blue-500"
                    >
                        <option value="total_hours">Total Hours</option>
                        <option value="total_sessions">Total Sessions</option>
                        <option value="last_activity">Last Activity</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                User ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                First Activity
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                Last Activity
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                                Sessions
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                                Total Hours
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                                Avg Session
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-800 divide-y divide-slate-700">
                        {data.map((user) => (
                            <tr key={user.user_id} className="hover:bg-slate-750 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                                    {user.user_id}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                                    {formatDate(user.first_activity)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                                    {formatDate(user.last_activity)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-white">
                                    {user.total_sessions}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-semibold text-blue-400">
                                    {user.total_hours.toFixed(2)}h
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-slate-300">
                                    {user.avg_session_duration.toFixed(2)}h
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'active'
                                        ? 'bg-green-900/50 text-green-300'
                                        : 'bg-slate-700 text-slate-400'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {data.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                    No user session data available
                </div>
            )}
        </div>
    );
};

export default UserSessions;
