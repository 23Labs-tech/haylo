'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    location: string;
    description: string;
    status: string;
    htmlLink: string;
}

export default function BookingsPage() {
    const [isCalendarConnected, setIsCalendarConnected] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [calendarError, setCalendarError] = useState<string | null>(null);

    // Fetch events from Google Calendar
    const fetchEvents = useCallback(async () => {
        setLoadingEvents(true);
        setCalendarError(null);
        try {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();
            const timeMin = new Date(year, month, 1).toISOString();
            const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

            const res = await fetch(`/api/calendar?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`);

            if (res.status === 401) {
                // Not connected to Google Calendar — show calendar anyway, just no events
                setIsCalendarConnected(false);
                setEvents([]);
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setEvents(data.events || []);
                setIsCalendarConnected(true);
            } else {
                const data = await res.json();
                setCalendarError(data.error || 'Could not fetch events');
                setIsCalendarConnected(false);
            }
        } catch (e) {
            setCalendarError('Network error');
            setIsCalendarConnected(false);
        } finally {
            setLoadingEvents(false);
        }
    }, [currentMonth]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Calendar Helper Functions
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0=Sunday

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month); // 0=Sunday matching Google Calendar
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    // Previous month trailing days
    const prevMonthDays = getDaysInMonth(year, month - 1);
    const trailingDays = firstDay;

    // Total cells needed (minimum 35, max 42)
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    // Get events for a specific date
    const getEventsForDate = (day: number): CalendarEvent[] => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(event => {
            const eventDate = event.start.substring(0, 10);
            return eventDate === dateStr;
        });
    };

    // Get today's events
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayEvents = events.filter(event => event.start.substring(0, 10) === todayStr);

    // Format time from ISO string
    const formatTime = (isoStr: string) => {
        if (!isoStr || isoStr.length <= 10) return 'All Day';
        const d = new Date(isoStr);
        return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Calendar & Bookings</h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        {isCalendarConnected ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Google Calendar Synced
                            </>
                        ) : (
                            <>
                                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                Google Calendar not connected
                            </>
                        )}
                    </p>
                </div>
                <button
                    onClick={fetchEvents}
                    disabled={loadingEvents}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${loadingEvents ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Google Calendar Connection Banner */}
            {!isCalendarConnected && !loadingEvents && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-semibold text-blue-900">Google Calendar Not Connected</h3>
                            <p className="text-sm text-blue-700 mt-0.5">
                                Sign in with Google to sync your real calendar events here.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={async () => {
                            try {
                                const { createClient: createBrowserClient } = await import('@/utils/supabase/client');
                                const supabase = createBrowserClient();

                                // Use signInWithOAuth to connect Google Calendar
                                // Supabase's automatic linking will merge with existing email/password account
                                const { data, error } = await supabase.auth.signInWithOAuth({
                                    provider: 'google',
                                    options: {
                                        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/bookings`,
                                        scopes: 'https://www.googleapis.com/auth/calendar.readonly',
                                        queryParams: {
                                            access_type: 'offline',
                                            prompt: 'consent',
                                        },
                                    },
                                });

                                if (error) {
                                    console.error('Google auth error:', error);
                                    alert('Failed to connect Google Calendar: ' + error.message);
                                    return;
                                }

                                if (data?.url) {
                                    window.location.href = data.url;
                                }
                            } catch (err) {
                                console.error('Error connecting Google:', err);
                                alert('Network error. Please try again.');
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors flex-shrink-0"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Connect Google
                    </button>
                </div>
            )}

            {calendarError && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm">
                    {calendarError}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left side: Today's events */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Today&apos;s Schedule</h2>
                            <a
                                href="https://calendar.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Open Google Calendar"
                            >
                                <ExternalLink className="w-4 h-4 text-gray-400" />
                            </a>
                        </div>

                        <div className="space-y-4">
                            {loadingEvents ? (
                                <div className="animate-pulse space-y-3">
                                    {[1, 2].map(i => (
                                        <div key={i} className="h-16 bg-gray-100 rounded-xl" />
                                    ))}
                                </div>
                            ) : todayEvents.length === 0 ? (
                                <div className="text-center py-8">
                                    <CalendarIcon className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                    <p className="text-sm text-gray-400">
                                        {isCalendarConnected
                                            ? 'No events scheduled for today'
                                            : 'Connect Google Calendar to see events'}
                                    </p>
                                </div>
                            ) : (
                                todayEvents.map((event) => (
                                    <a
                                        key={event.id}
                                        href={event.htmlLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all bg-white group cursor-pointer relative overflow-hidden block"
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-l-xl opacity-80"></div>
                                        <div className="flex-1 pl-2">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
                                                <Clock className="w-4 h-4 text-purple-600" />
                                                {event.allDay ? 'All Day' : formatTime(event.start)}
                                                {event.end && !event.allDay && ` – ${formatTime(event.end)}`}
                                            </div>
                                            <p className="font-bold text-md text-gray-900">{event.title}</p>
                                            {event.location && (
                                                <p className="text-sm text-gray-500 mt-0.5">{event.location}</p>
                                            )}
                                        </div>
                                    </a>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right side: Calendar Grid (Sunday start, like Google Calendar) */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                {monthNames[month]} {year}
                            </h2>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                                    className="p-1.5 hover:bg-gray-100 rounded-md transition-all border border-gray-200"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <button
                                    onClick={() => setCurrentMonth(new Date())}
                                    className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-all border border-gray-200"
                                >
                                    Today
                                </button>
                                <button
                                    onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                                    className="p-1.5 hover:bg-gray-100 rounded-md transition-all border border-gray-200"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Week Header - Sunday Start (like Google Calendar) */}
                        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
                            {days.map((day) => (
                                <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 border-r border-gray-100 last:border-0">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7" style={{ minHeight: '500px' }}>
                            {Array.from({ length: totalCells }).map((_, i) => {
                                const dayNumber = i - trailingDays + 1;
                                const isCurrentMonthDay = dayNumber >= 1 && dayNumber <= daysInMonth;
                                const isToday = isCurrentMonth && dayNumber === today.getDate();
                                const dayEvents = isCurrentMonthDay ? getEventsForDate(dayNumber) : [];

                                // Display number for trailing/leading days
                                let displayNumber: number;
                                if (dayNumber < 1) {
                                    displayNumber = prevMonthDays + dayNumber;
                                } else if (dayNumber > daysInMonth) {
                                    displayNumber = dayNumber - daysInMonth;
                                } else {
                                    displayNumber = dayNumber;
                                }

                                return (
                                    <div
                                        key={i}
                                        className={`border-r border-b border-gray-100 p-1.5 min-h-[80px] transition-colors ${isCurrentMonthDay ? 'hover:bg-gray-50' : 'bg-gray-50/30'
                                            }`}
                                    >
                                        <span
                                            className={`text-sm font-medium inline-flex items-center justify-center w-7 h-7 rounded-full ${isToday
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : isCurrentMonthDay
                                                    ? 'text-gray-800'
                                                    : 'text-gray-300'
                                                }`}
                                        >
                                            {displayNumber}
                                        </span>

                                        {/* Show real events from Google Calendar */}
                                        {dayEvents.length > 0 && (
                                            <div className="mt-1 space-y-0.5">
                                                {dayEvents.slice(0, 2).map((ev) => (
                                                    <a
                                                        key={ev.id}
                                                        href={ev.htmlLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[11px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium truncate block cursor-pointer hover:bg-blue-200 transition-colors"
                                                        title={ev.title}
                                                    >
                                                        {ev.allDay ? '' : formatTime(ev.start) + ' '}{ev.title}
                                                    </a>
                                                ))}
                                                {dayEvents.length > 2 && (
                                                    <span className="text-[10px] text-gray-500 px-1.5">
                                                        +{dayEvents.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
