# VizSprints - Frontend Code

## Frontend (React)
### frontend/index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VizSprints Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

### frontend/package.json
```json
{
    "name": "vizsprints-frontend",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
    },
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "recharts": "^2.10.3",
        "axios": "^1.6.2"
    },
    "devDependencies": {
        "@types/react": "^18.2.43",
        "@types/react-dom": "^18.2.17",
        "@vitejs/plugin-react": "^4.2.1",
        "autoprefixer": "^10.4.16",
        "postcss": "^8.4.32",
        "tailwindcss": "^3.3.6",
        "vite": "^5.0.8"
    }
}
```

### frontend/tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',
                secondary: '#64748b',
                dark: '#0f172a',
                light: '#f8fafc',
            },
        },
    },
    plugins: [],
}

```

### frontend/postcss.config.js
```javascript
export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
}

```

### frontend/src/api.js
```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

```

### frontend/src/components/ABTestResults.jsx
```javascript
import React, { useEffect, useState } from 'react';
import api from '../api';

const ABTestResults = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/ab-test');
                setData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching A/B test data:', err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="h-64 flex items-center justify-center text-slate-400">Loading...</div>;

    const VariantCard = ({ variant, data, isWinner }) => (
        <div className={`p-4 rounded-lg border ${isWinner ? 'border-green-500 bg-slate-700' : 'border-slate-600 bg-slate-800'}`}>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-white">Variant {variant}</h4>
                {isWinner && <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900/50 rounded-full">Winner</span>}
            </div>
            <dl className="grid grid-cols-2 gap-4">
                <div>
                    <dt className="text-xs text-slate-400">Users</dt>
                    <dd className="text-lg font-medium text-white">{data.total_users}</dd>
                </div>
                <div>
                    <dt className="text-xs text-slate-400">Events/User</dt>
                    <dd className="text-lg font-medium text-white">{data.avg_events_per_user}</dd>
                </div>
            </dl>

            <div className="mt-4">
                <h5 className="text-sm font-medium text-slate-300 mb-2">Funnel Conversion</h5>
                <div className="space-y-2">
                    {data.funnel.map((stage) => (
                        <div key={stage.stage} className="flex justify-between items-center text-sm">
                            <span className="text-slate-400 truncate w-24">{stage.stage}</span>
                            <div className="flex-1 mx-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${variant === 'A' ? 'bg-blue-400' : 'bg-purple-400'}`}
                                    style={{ width: `${stage.conversion_rate}%` }}
                                />
                            </div>
                            <span className="text-slate-300 w-12 text-right">{stage.conversion_rate}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">
                    Comparison based on average events per user
                </div>
                <div className={`text-sm font-medium ${data.lift > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {data.lift > 0 ? '+' : ''}{data.lift}% Lift (B vs A)
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <VariantCard
                    variant="A"
                    data={data.variant_A}
                    isWinner={data.lift < 0}
                />
                <VariantCard
                    variant="B"
                    data={data.variant_B}
                    isWinner={data.lift > 0}
                />
            </div>
        </div>
    );
};

export default ABTestResults;

```

### frontend/src/components/CohortHeatmap.jsx
```javascript
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

```

### frontend/src/components/Dashboard.jsx
```javascript
import React, { useEffect, useState } from 'react';
import api from '../api';
import MetricsCard from './MetricsCard';
import CohortHeatmap from './CohortHeatmap';
import FunnelChart from './FunnelChart';
import ABTestResults from './ABTestResults';
import EngagementChart from './EngagementChart';
import UserSessions from './UserSessions';

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
                <MetricsCard
                    title="Total Users"
                    value={metrics.total_users.toLocaleString()}
                    subtext="Registered users"
                />
                <MetricsCard
                    title="Active Users"
                    value={metrics.active_users.toLocaleString()}
                    subtext="Last 30 days"
                />
                <MetricsCard
                    title="Conversion Rate"
                    value={`${metrics.conversion_rate}%`}
                    subtext="Task completion"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium leading-6 text-white mb-4">Engagement Over Time</h3>
                    <EngagementChart />
                </div>
                <div className="bg-slate-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium leading-6 text-white mb-4">Conversion Funnel</h3>
                    <FunnelChart />
                </div>
            </div>

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

```

### frontend/src/components/EngagementChart.jsx
```javascript
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api';

const EngagementChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/engagement');
                setData(response.data.timeline);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching engagement data:', err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="h-64 flex items-center justify-center text-slate-400">Loading...</div>;

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        tickLine={false}
                        axisLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)', color: '#fff' }}
                    />
                    <Legend />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="active_users"
                        name="Active Users"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="event_count"
                        name="Total Events"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EngagementChart;

```

### frontend/src/components/FunnelChart.jsx
```javascript
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

```

### frontend/src/components/MetricsCard.jsx
```javascript
import React from 'react';

const MetricsCard = ({ title, value, subtext, trend }) => {
    return (
        <div className="bg-slate-800 overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow duration-300">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-1">
                        <dt className="text-sm font-medium text-slate-400 truncate">{title}</dt>
                        <dd className="mt-1 text-3xl font-semibold text-white">{value}</dd>
                    </div>
                </div>
                <div className="mt-4">
                    <div className={`text-sm ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {subtext}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricsCard;

```

### frontend/src/components/UserSessions.jsx
```javascript
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

```

