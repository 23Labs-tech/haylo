'use client';

import React, { useState, useEffect } from 'react';
import {
    Phone,
    Calendar,
    CheckCircle2,
    TrendingUp,
    Clock,
    AlertCircle,
    Database,
    RefreshCw,
    MoreVertical,
    Activity,
    ExternalLink,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface DashboardCall {
    id: string;
    status: string;
    type: string;
    startedAt: string;
    endedAt: string;
    duration: number;
    customer: string;
    summary: string;
    transcript: string;
    endedReason: string;
}

export default function CallsPage() {
    const [calls, setCalls] = useState<DashboardCall[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [clinicName, setClinicName] = useState('');
    const [hasAssistant, setHasAssistant] = useState(false);
    const [showRaw, setShowRaw] = useState(false);
    const [selectedCall, setSelectedCall] = useState<DashboardCall | null>(null);

    const fetchData = async () => {
        try {
            setRefreshing(true);
            setError(null);
            const res = await fetch('/api/dashboard');
            if (res.ok) {
                const json = await res.json();
                setCalls(json.calls || []);
                setClinicName(json.clinicName || '');
                setHasAssistant(json.hasAssistant || false);
                setError(null);
            } else if (res.status === 503) {
                setError('Service temporarily unavailable. Click Refresh to retry.');
            } else if (res.status === 401) {
                // Not logged in - show empty state
                setCalls([]);
                setHasAssistant(false);
            } else {
                const err = await res.json();
                setError(err.error || 'Failed to load call data');
            }
        } catch (e) {
            setError('Network error loading call data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatDuration = (seconds: number) => {
        if (!seconds) return '—';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Stats
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCalls = calls.filter(c => new Date(c.startedAt) >= todayStart);
    const completedCalls = calls.filter(c => c.status === 'ended');
    const avgDuration = completedCalls.length > 0
        ? Math.round(completedCalls.reduce((sum, c) => sum + c.duration, 0) / completedCalls.length)
        : 0;
    const successRate = calls.length > 0
        ? Math.round((completedCalls.length / calls.length) * 100 * 10) / 10
        : 0;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Call Intelligence Dashboard</h1>
                    <p className="text-gray-500 mt-1 text-sm flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                        {clinicName ? `Live data for ${clinicName}` : 'Your call analytics'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowRaw(!showRaw)}
                        className="px-4 py-2 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                    >
                        <Database className="w-4 h-4 text-gray-500" />
                        {showRaw ? 'View Table' : 'Raw Data'}
                    </button>
                    <button
                        onClick={fetchData}
                        disabled={refreshing}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md flex items-center gap-2 text-sm disabled:opacity-70"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {!hasAssistant && !loading && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="text-sm font-semibold text-blue-900">No AI Assistant Setup Yet</h3>
                        <p className="text-sm text-blue-700 mt-1">
                            Go to <Link href="/dashboard/settings" className="underline font-medium">Settings</Link> to configure your AI receptionist. Call data will appear here once your assistant handles calls.
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-start">
                    <AlertCircle className="w-5 h-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="text-sm font-medium text-amber-800">Connection Issue</h3>
                        <p className="mt-1 text-sm text-amber-700">{error}</p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <RefreshCw className="w-6 h-6 text-purple-600 animate-spin" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Loading call data...</h3>
                    <p className="text-gray-500">Fetching your call history</p>
                </div>
            ) : (
                <>
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Calls Today', value: todayCalls.length.toString(), icon: Phone, color: 'text-blue-600', bg: 'bg-blue-100' },
                            { label: 'Total Calls', value: calls.length.toString(), icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
                            { label: 'Avg Duration', value: formatDuration(avgDuration), icon: Clock, color: 'text-green-600', bg: 'bg-green-100' },
                            { label: 'Success Rate', value: successRate > 0 ? `${successRate}%` : '—', icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-100' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Call Data Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">Call History</h2>
                            <span className="text-xs font-medium bg-gray-200 text-gray-700 py-1 px-3 rounded-full">
                                {calls.length} calls
                            </span>
                        </div>

                        {showRaw ? (
                            <div className="p-0 max-h-[600px] overflow-auto bg-gray-900">
                                <pre className="text-sm text-green-400 p-6 font-mono whitespace-pre-wrap">
                                    {JSON.stringify(calls, null, 2)}
                                </pre>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Summary</th>
                                            <th className="px-6 py-4 relative"><span className="sr-only">Actions</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {calls.length > 0 ? (
                                            calls.map((call) => (
                                                <tr
                                                    key={call.id}
                                                    className={`group hover:bg-gray-50 transition-colors cursor-pointer ${selectedCall?.id === call.id ? 'bg-indigo-50/50' : ''}`}
                                                    onClick={() => setSelectedCall(selectedCall?.id === call.id ? null : call)}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${call.status === 'ended' ? 'bg-green-100 text-green-800'
                                                            : call.status === 'queued' ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {call.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{call.customer}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                                                        {call.type === 'inboundPhoneCall' ? 'Inbound' : call.type}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{formatDuration(call.duration)}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(call.startedAt)}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{call.summary || '—'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end gap-1.5 text-purple-600 group-hover:text-purple-800 transition-colors">
                                                            <span>View transcript</span>
                                                            <ChevronRight className="w-4 h-4" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                    <Phone className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                                    <p className="text-lg font-medium text-gray-900">No calls yet</p>
                                                    <p className="text-sm">Call data will appear here once your AI receptionist handles calls.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Selected Call Detail / Transcript */}
                    {selectedCall && (
                        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-lg p-6 text-white border border-indigo-700 relative overflow-hidden mt-6">
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                <Phone className="w-32 h-32 transform rotate-12" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-purple-300" />
                                    Call Details: {selectedCall.customer}
                                </h3>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Summary Column */}
                                    <div className="flex flex-col">
                                        <h4 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-3">Call Summary</h4>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 text-sm leading-relaxed text-indigo-50 flex-grow max-h-[300px] overflow-y-auto">
                                            {selectedCall.summary || 'No summary available for this call.'}
                                        </div>
                                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-medium text-indigo-200">
                                            <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md">
                                                <Clock className="w-4 h-4" /> {formatDuration(selectedCall.duration)}
                                            </span>
                                            <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md">
                                                <CheckCircle2 className="w-4 h-4" /> {selectedCall.endedReason || 'Completed'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Transcript Column */}
                                    <div className="flex flex-col">
                                        <h4 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-3">Transcript</h4>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 text-sm leading-relaxed text-indigo-50 flex-grow h-[300px] overflow-y-auto selection:bg-purple-500/30">
                                            {selectedCall.transcript ? (
                                                <div className="whitespace-pre-wrap font-mono text-xs opacity-90">{selectedCall.transcript}</div>
                                            ) : (
                                                <div className="flex items-center justify-center h-full italic text-indigo-300/70">
                                                    Transcript not available or processing...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
