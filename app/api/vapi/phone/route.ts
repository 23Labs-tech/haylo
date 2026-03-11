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

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const supabaseAdmin = getSupabaseAdmin();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const vapiKey = process.env.VAPI_PRIVATE_KEY;
        if (!vapiKey) {
            return NextResponse.json({ error: 'Server misconfiguration: VAPI private key is missing.' }, { status: 500 });
        }

        // Use admin client to read profile (bypasses RLS)
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        if (!profile?.vapi_assistant_id) {
            return NextResponse.json({ error: 'Please save your Settings first to generate an Assistant before provisioning a phone number.' }, { status: 400 });
        }

        if (profile?.vapi_phone_number) {
            return NextResponse.json({ error: 'You already have a phone number.' }, { status: 400 });
        }

        const { areaCode } = await request.json();

        // Buy phone number from Vapi with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        let vapiRes;
        try {
            vapiRes = await fetch(`https://api.vapi.ai/phone-number/buy`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${vapiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    areaCode: areaCode || "415",
                    assistantId: profile.vapi_assistant_id,
                    name: `${profile.clinic_name || 'Haylo'} Phone Number`
                }),
                signal: controller.signal
            });
        } catch (fetchErr: any) {
            clearTimeout(timeout);
            const msg = fetchErr?.name === 'AbortError' ? 'VAPI request timed out.' : 'Failed to reach VAPI.';
            return NextResponse.json({ error: msg }, { status: 500 });
        } finally {
            clearTimeout(timeout);
        }

        if (!vapiRes.ok) {
            const err = await vapiRes.text();
            console.error('VAPI Phone Buy Error:', err);
            return NextResponse.json({ error: 'Failed to purchase phone number. Please try another area code.' }, { status: 500 });
        }

        const newPhone = await vapiRes.json();
        const purchasedNumber = newPhone.number; // +1XXXXXXXXXX

        // Update Supabase with the new number using ADMIN client (bypasses RLS)
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ vapi_phone_number: purchasedNumber })
            .eq('id', user.id);

        if (updateError) {
            console.error('Supabase Phone Link Error:', updateError);
            return NextResponse.json({ error: `Phone purchased but failed to save to profile: ${updateError.message}` }, { status: 500 });
        }

        return NextResponse.json({ success: true, phoneNumber: purchasedNumber });

    } catch (e: unknown) {
        return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}
