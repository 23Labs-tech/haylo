import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { searchParams, origin } = new URL(request.url);
        const next = searchParams.get('next') || '/dashboard/bookings';

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
                scopes: 'https://www.googleapis.com/auth/calendar.readonly',
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });

        if (error) {
            console.error('Google OAuth error:', error);
            return NextResponse.redirect(`${origin}/dashboard/bookings?error=google_auth_failed`);
        }

        if (data?.url) {
            return NextResponse.redirect(data.url);
        }

        return NextResponse.redirect(`${origin}/dashboard/bookings?error=no_redirect_url`);
    } catch (e: unknown) {
        console.error('Google Calendar auth error:', e);
        const { origin } = new URL(request.url);
        return NextResponse.redirect(`${origin}/dashboard/bookings?error=unexpected`);
    }
}
