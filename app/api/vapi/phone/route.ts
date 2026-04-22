import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const supabaseAdmin = getSupabaseAdmin();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Use admin client to read profile (bypasses RLS)
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('vapi_assistant_id, vapi_phone_number')
            .eq('id', user.id)
            .maybeSingle();

        return NextResponse.json({
            phoneNumber: profile?.vapi_phone_number || null,
            assistantId: profile?.vapi_assistant_id || null
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

