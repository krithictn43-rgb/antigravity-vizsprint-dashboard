import React from 'react';
import Dashboard from './components/Dashboard';
import DownloadReportButton from './components/DownloadReportButton';

function App() {
    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-primary">VizSprints</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <DownloadReportButton />
                            <div className="text-sm text-slate-500">Product Analytics Dashboard</div>
                        </div>
                    </div>
                </div>
            </nav>

            <main id="dashboard-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Dashboard />
            </main>
        </div>
    );
}

export default App;
