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
