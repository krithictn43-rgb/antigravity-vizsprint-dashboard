import React, { useEffect, useState } from 'react';
import api from '../api';

const ABTestResults = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Live Data Filters
    const [sampleSize, setSampleSize] = useState('');
    const [eventLimit, setEventLimit] = useState('');

    // Simulation Mode State
    const [isSimulation, setIsSimulation] = useState(false);

    // Simulation / Stats Parameters
    const [confidenceLevel, setConfidenceLevel] = useState(0.95);
    const [simNA, setSimNA] = useState(1000);
    const [simNB, setSimNB] = useState(1000);
    const [simConvA, setSimConvA] = useState(10.0);
    const [simConvB, setSimConvB] = useState(12.0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams();

                // Common Params
                params.append('confidence_level', confidenceLevel);

                if (isSimulation) {
                    params.append('manual_n_a', simNA);
                    params.append('manual_n_b', simNB);
                    params.append('manual_conv_a', simConvA);
                    params.append('manual_conv_b', simConvB);
                } else {
                    if (sampleSize) params.append('limit', sampleSize);
                    if (eventLimit) params.append('event_limit', eventLimit);
                }

                const url = `/ab-test?${params.toString()}`;
                const response = await api.get(url);
                setData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching A/B test data:', err);
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchData();
        }, 500); // Debounce API calls

        return () => clearTimeout(timeoutId);
    }, [sampleSize, eventLimit, isSimulation, confidenceLevel, simNA, simNB, simConvA, simConvB]);

    if (loading && !data) return <div className="h-64 flex items-center justify-center text-slate-400">Loading...</div>;

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
                    <dt className="text-xs text-slate-400">{isSimulation ? 'Est. Conv Rate' : 'Events/User'}</dt>
                    <dd className="text-lg font-medium text-white">
                        {isSimulation ? `${data.funnel[0].conversion_rate}%` : data.avg_events_per_user}
                    </dd>
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
            {/* Header / Controls */}
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            A/B Test Analysis
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${isSimulation ? 'border-purple-500 text-purple-400' : 'border-blue-500 text-blue-400'}`}>
                                {isSimulation ? 'Calculator Mode' : 'Live Data'}
                            </span>
                        </h3>
                        <p className="text-sm text-slate-400">
                            {isSimulation ? 'Input data from two variations (A and B) to see if the difference is real.' : 'Analyzing real user events from database.'}
                        </p>
                    </div>

                    <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-700">
                        <button
                            onClick={() => setIsSimulation(false)}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${!isSimulation ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Live Data
                        </button>
                        <button
                            onClick={() => setIsSimulation(true)}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${isSimulation ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Calculator
                        </button>
                    </div>
                </div>

                {/* Parameters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-slate-400">Confidence Level</label>
                        <select
                            value={confidenceLevel}
                            onChange={(e) => setConfidenceLevel(parseFloat(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:border-blue-500 outline-none"
                        >
                            <option value="0.90">90%</option>
                            <option value="0.95">95%</option>
                            <option value="0.99">99%</option>
                        </select>
                    </div>

                    {!isSimulation ? (
                        <>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">Max Users (Sample)</label>
                                <input
                                    type="number"
                                    value={sampleSize}
                                    onChange={(e) => setSampleSize(e.target.value)}
                                    placeholder="All"
                                    className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">Max Events</label>
                                <input
                                    type="number"
                                    value={eventLimit}
                                    onChange={(e) => setEventLimit(e.target.value)}
                                    placeholder="All"
                                    className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:border-blue-500 outline-none"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">Sample Size</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={simNA}
                                        onChange={(e) => setSimNA(parseInt(e.target.value) || 0)}
                                        className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:border-purple-500 outline-none"
                                        placeholder="A"
                                    />
                                    <input
                                        type="number"
                                        value={simNB}
                                        onChange={(e) => setSimNB(parseInt(e.target.value) || 0)}
                                        className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:border-purple-500 outline-none"
                                        placeholder="B"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">Conversion Rate (%)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={simConvA}
                                        onChange={(e) => setSimConvA(parseFloat(e.target.value) || 0)}
                                        className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:border-purple-500 outline-none"
                                        placeholder="A %"
                                    />
                                    <input
                                        type="number"
                                        value={simConvB}
                                        onChange={(e) => setSimConvB(parseFloat(e.target.value) || 0)}
                                        className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:border-purple-500 outline-none"
                                        placeholder="B %"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {data && (
                <>
                    {/* Statistical Significance Banner */}
                    <div className={`p-4 rounded-lg flex items-center justify-between ${data.stats.significant
                        ? 'bg-green-900/30 border border-green-500/50'
                        : 'bg-slate-800 border border-slate-700'
                        }`}>
                        <div>
                            <div className={`text-lg font-bold ${data.stats.significant ? 'text-green-400' : 'text-slate-300'}`}>
                                {data.stats.significant
                                    ? `Statistically Significant! Variation ${data.lift > 0 ? 'B' : 'A'} is better.`
                                    : "Not Statistically Significant."
                                }
                            </div>
                            <div className="text-sm text-slate-400 mt-1">
                                P-Value: <span className="text-white font-mono">{data.stats.p_value}</span>
                                <span className="mx-2">•</span>
                                Confidence Level: <span className="text-white">{(data.stats.confidence_level * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-400">Statistical Power</div>
                            <div className={`text-2xl font-bold ${data.stats.power > 0.8 ? 'text-green-400' : 'text-yellow-400'}`}>
                                {Math.round(data.stats.power * 100)}%
                            </div>
                            <div className="text-xs text-slate-500">Prob. of detecting effect</div>
                        </div>
                    </div>

                    {/* Cards */}
                    < div className="flex justify-end" >
                        <div className={`text-sm font-medium ${data.lift > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {data.lift > 0 ? '+' : ''}{data.lift}% Lift (B vs A)
                        </div>
                    </div >

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <VariantCard
                            variant="A"
                            data={data.variant_A}
                            isWinner={data.lift < 0 && data.stats.significant}
                        />
                        <VariantCard
                            variant="B"
                            data={data.variant_B}
                            isWinner={data.lift > 0 && data.stats.significant}
                        />
                    </div>
                </>
            )}
        </div >
    );
};

export default ABTestResults;
