import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard';

    if (code) {
        const supabase = await createClient();
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && session?.user) {
            // Track user accounts created/logging into Haylo in a dedicated table
            // Sometimes Row Level Security (RLS) blocks public inserts unless explicitly allowed.
            // Using the admin client here bypasses RLS safely purely for backend logging.
            const { createClient: createAdminClient } = await import('@supabase/supabase-js');
            const supabaseAdmin = createAdminClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );

            await supabaseAdmin.from('haylo_users').upsert({
                id: session.user.id,
                email: session.user.email,
                last_login: new Date().toISOString()
            }, {
                onConflict: 'id'
            });

            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
