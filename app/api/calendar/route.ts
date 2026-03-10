import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the provider token (Google OAuth access token)
        const providerToken = session.provider_token;

        if (!providerToken) {
            return NextResponse.json({ error: 'No Google token available. Please re-login with Google.' }, { status: 401 });
        }

        // Parse query params for date range
        const { searchParams } = new URL(request.url);
        const timeMin = searchParams.get('timeMin') || new Date().toISOString();
        const timeMax = searchParams.get('timeMax') || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        // Fetch events from Google Calendar API
        const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime&maxResults=100`;

        const calendarRes = await fetch(calendarUrl, {
            headers: {
                Authorization: `Bearer ${providerToken}`
            }
        });

        if (!calendarRes.ok) {
            const errText = await calendarRes.text();
            console.error('Google Calendar API Error:', calendarRes.status, errText);
            return NextResponse.json({
                error: 'Failed to fetch Google Calendar events. Token may have expired.',
                details: errText
            }, { status: calendarRes.status });
        }

        const calendarData = await calendarRes.json();

        // Transform events into a simplified format
        const events = (calendarData.items || []).map((event: any) => ({
            id: event.id,
            title: event.summary || '(No title)',
            start: event.start?.dateTime || event.start?.date || '',
            end: event.end?.dateTime || event.end?.date || '',
            allDay: !event.start?.dateTime,
            location: event.location || '',
            description: event.description || '',
            status: event.status || 'confirmed',
            htmlLink: event.htmlLink || ''
        }));

        return NextResponse.json({
            events,
            totalEvents: events.length
        });

    } catch (e: unknown) {
        console.error('Calendar API error:', e);
        return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}
