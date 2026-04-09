import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function GET() {
    try {
        const supabase = await createClient();
        const supabaseAdmin = getSupabaseAdmin();

        let user;
        try {
            const { data, error: authError } = await supabase.auth.getUser();
            if (authError) {
                const errMsg = authError.message?.toLowerCase() || '';
                if (errMsg.includes('timeout') || errMsg.includes('fetch') || errMsg.includes('enotfound') || errMsg.includes('connect')) {
                    return NextResponse.json({ error: 'Service temporarily unavailable. Please retry.' }, { status: 503 });
                }
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            user = data.user;
        } catch (connErr: any) {
            console.error('Auth connection error:', connErr?.message);
            return NextResponse.json({ error: 'Service temporarily unavailable. Please retry.' }, { status: 503 });
        }

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Get the user's profile using ADMIN client (bypasses RLS)
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('vapi_assistant_id, clinic_name, settings_json')
            .eq('id', user.id)
            .maybeSingle();

        if (profileError || !profile) {
            return NextResponse.json({
                calls: [],
                stats: { totalCalls: 0, bookings: 0, followUps: 0, satisfaction: 0 },
                clinicName: '',
                hasAssistant: false
            });
        }

        const assistantId = profile.vapi_assistant_id;
        let clinicName = profile.clinic_name || '';

        // Try to get clinic name from settings_json if not directly available
        if (!clinicName && profile.settings_json) {
            try {
                const settings = typeof profile.settings_json === 'string'
                    ? JSON.parse(profile.settings_json)
                    : profile.settings_json;
                clinicName = settings.clinicName || '';
            } catch (e) {
                // ignore
            }
        }

        if (!assistantId) {
            // User has no assistant yet - return empty data
            return NextResponse.json({
                calls: [],
                stats: { totalCalls: 0, bookings: 0, followUps: 0, satisfaction: 0 },
                clinicName,
                hasAssistant: false
            });
        }

        // 2. Fetch calls from Supabase call_logs table for this specific assistant
        const { data: dbCalls, error: callsError } = await supabaseAdmin
            .from('call_logs')
            .select('*')
            .eq('assistant_id', assistantId)
            .order('startedAt', { ascending: false })
            .limit(50);

        if (callsError) {
            console.error('Failed to fetch calls from database:', callsError);
            return NextResponse.json({
                calls: [],
                stats: { totalCalls: 0, bookings: 0, followUps: 0, satisfaction: 0 },
                clinicName,
                hasAssistant: true
            });
        }

        // 3. Transform call data (already in correct format from database)
        const calls = (dbCalls || []).map((call: any) => ({
            id: call.id,
            status: call.status || 'unknown',
            type: call.type || 'inbound',
            startedAt: call.startedAt || '',
            endedAt: call.endedAt || '',
            duration: call.duration || 0,
            customer: call.customer || 'Unknown',
            summary: call.summary || call.transcript || '',
            transcript: call.transcript || '',
            endedReason: call.endedReason || ''
        }));

        // 4. Calculate user-specific stats
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayCalls = calls.filter((c: any) => new Date(c.startedAt) >= todayStart);
        const totalCalls = todayCalls.length;
        const completedCalls = calls.filter((c: any) => c.status === 'ended');
        const successRate = calls.length > 0
            ? Math.round((completedCalls.length / calls.length) * 100 * 10) / 10
            : 0;

        return NextResponse.json({
            calls,
            stats: {
                totalCalls,
                totalCallsAll: calls.length,
                bookings: 0,
                followUps: 0,
                satisfaction: successRate
            },
            clinicName,
            hasAssistant: true,
            assistantId
        });

    } catch (e: unknown) {
        console.error('Dashboard data error:', e);
        return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}
