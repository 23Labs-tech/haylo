'use client';

import React, { useState, useEffect } from 'react';
import {
    Phone,
    Calendar,
    TrendingUp,
    MessageSquare,
    Clock,
    Building2,
    Activity,
    AlertCircle
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
    endedReason: string;
}

interface DashboardData {
    calls: DashboardCall[];
    stats: {
        totalCalls: number;
        totalCallsAll: number;
        bookings: number;
        followUps: number;
        satisfaction: number;
    };
    clinicName: string;
    hasAssistant: boolean;
}

export default function OverviewPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let retryCount = 0;
        const fetchData = async () => {
            try {
                const res = await fetch('/api/dashboard');
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                    setError(null);
                    retryCount = 0; // reset on success
                } else if (res.status === 503) {
                    // Temporary connectivity issue — auto-retry
                    retryCount++;
                    if (retryCount <= 3) {
                        setTimeout(fetchData, 3000); // retry in 3s
                    } else {
                        setError('Service temporarily unavailable. Please refresh the page.');
                    }
                } else if (res.status === 401) {
                    // Not logged in - don't show error, just empty state
                    setData(null);
                } else {
                    const err = await res.json();
                    setError(err.error || 'Failed to load dashboard');
                }
            } catch (e) {
                setError('Network error loading dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatDuration = (seconds: number) => {
        if (!seconds) return '0s';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };

    const formatTimeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const diff = Date.now() - new Date(dateStr).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const totalCalls = data?.stats?.totalCalls || 0;
    const totalCallsAll = data?.stats?.totalCallsAll || 0;
    const bookings = data?.stats?.bookings || 0;
    const followUps = data?.stats?.followUps || 0;
    const satisfaction = data?.stats?.satisfaction || 0;
    const recentCalls = data?.calls?.slice(0, 5) || [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {data?.clinicName ? `${data.clinicName} — daily snapshot` : "Your clinic's daily snapshot"}
                </p>
            </div>

            {!data?.hasAssistant && !loading && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="text-sm font-semibold text-blue-900">No AI Assistant Setup Yet</h3>
                        <p className="text-sm text-blue-700 mt-1">
                            Go to <Link href="/dashboard/settings" className="underline font-medium">Settings</Link> to configure your AI receptionist. Once saved, your dashboard will start showing real call data.
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                    {error}
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Calls Today */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                            <Phone className="w-6 h-6 text-purple-600" />
                        </div>
                        {totalCallsAll > 0 && (
                            <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                {totalCallsAll} total
                            </span>
                        )}
                    </div>
                    <div>
                        {loading ? (
                            <div className="h-10 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                        ) : (
                            <h3 className="text-4xl font-bold text-gray-900 mb-1">{totalCalls}</h3>
                        )}
                        <p className="text-sm font-medium text-gray-500">Calls handled today</p>
                    </div>
                </div>

                {/* Bookings */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-pink-500" />
                        </div>
                    </div>
                    <div>
                        {loading ? (
                            <div className="h-10 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                        ) : (
                            <h3 className="text-4xl font-bold text-gray-900 mb-1">{bookings}</h3>
                        )}
                        <p className="text-sm font-medium text-gray-500">Bookings made today</p>
                    </div>
                </div>

                {/* Enquiries */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <div>
                        {loading ? (
                            <div className="h-10 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                        ) : (
                            <h3 className="text-4xl font-bold text-gray-900 mb-1">{followUps}</h3>
                        )}
                        <p className="text-sm font-medium text-gray-500">Enquiries to follow up</p>
                    </div>
                </div>

                {/* Success Rate */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-500" />
                        </div>
                        {satisfaction > 0 && (
                            <span className="flex items-center text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-lg">
                                {satisfaction >= 90 ? 'Excellent' : satisfaction >= 70 ? 'Good' : 'Needs Improvement'}
                            </span>
                        )}
                    </div>
                    <div>
                        {loading ? (
                            <div className="h-10 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                        ) : (
                            <h3 className="text-4xl font-bold text-gray-900 mb-1">{satisfaction > 0 ? `${satisfaction}%` : '—'}</h3>
                        )}
                        <p className="text-sm font-medium text-gray-500">Call success rate</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                    <Link href="/dashboard/calls" className="text-sm font-medium text-purple-600 hover:text-purple-700">
                        View all calls &rarr;
                    </Link>
                </div>

                <div className="space-y-8">
                    {loading ? (
                        <div className="animate-pulse space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : recentCalls.length === 0 ? (
                        <div className="text-center py-12">
                            <Phone className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No calls yet</p>
                            <p className="text-sm text-gray-400 mt-1">
                                {data?.hasAssistant
                                    ? 'Your AI receptionist is set up and ready. Calls will appear here.'
                                    : 'Set up your AI receptionist in Settings to start receiving calls.'}
                            </p>
                        </div>
                    ) : (
                        recentCalls.map((call, index) => (
                            <div key={call.id} className="flex gap-4 relative">
                                {index !== recentCalls.length - 1 && (
                                    <div className="absolute top-10 left-5 bottom-[-2rem] w-px bg-gray-100 -ml-px" />
                                )}
                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center relative z-10 ${call.status === 'ended' ? 'bg-green-100' : 'bg-purple-100'
                                    }`}>
                                    <Phone className={`w-5 h-5 ${call.status === 'ended' ? 'text-green-500' : 'text-purple-500'
                                        }`} />
                                </div>
                                <div className="flex-1 pb-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-bold text-gray-900">
                                            {call.type === 'inboundPhoneCall' ? 'Inbound Call' : 'Call'} — {call.status}
                                        </h4>
                                        <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatTimeAgo(call.startedAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {call.customer !== 'Unknown' ? call.customer : 'Unknown caller'}
                                        {call.duration > 0 && ` · ${formatDuration(call.duration)}`}
                                    </p>
                                    {call.summary && (
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{call.summary}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
