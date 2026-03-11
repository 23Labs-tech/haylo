import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
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
            .select('vapi_assistant_id, vapi_phone_number, clinic_name')
            .eq('id', user.id)
            .maybeSingle();

        if (!profile?.vapi_assistant_id) {
            return NextResponse.json({ error: 'Please save your Settings first to generate an Assistant before importing a phone number.' }, { status: 400 });
        }

        if (profile?.vapi_phone_number) {
            return NextResponse.json({ error: 'You already have a phone number.' }, { status: 400 });
        }

        const body = await request.json();
        const { number, twilioAccountSid, twilioAuthToken } = body;

        if (!twilioAccountSid || !twilioAuthToken) {
            return NextResponse.json({ error: 'Twilio Account SID and Auth Token are required.' }, { status: 400 });
        }

        const payload: any = {
            provider: 'twilio',
            number: number,
            twilioAccountSid: twilioAccountSid,
            twilioAuthToken: twilioAuthToken,
            name: `${profile.clinic_name || 'Haylo'} Twilio Number`,
            // Link phone number to the user's existing assistant
            assistantId: profile.vapi_assistant_id,
        };

        // Import phone number to Vapi with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        let vapiRes;
        try {
            vapiRes = await fetch(`https://api.vapi.ai/phone-number`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${vapiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
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
            console.error('VAPI Phone Import Error:', err);

            try {
                const errorObj = JSON.parse(err);
                return NextResponse.json({ error: errorObj.message || 'Failed to import phone number. Check your credentials.' }, { status: 500 });
            } catch (e) {
                return NextResponse.json({ error: 'Failed to import phone number. Please check your credentials and try again.' }, { status: 500 });
            }
        }

        const newPhone = await vapiRes.json();
        const importedNumber = newPhone.number; // e.g., +1XXXXXXXXXX
        const vapiPhoneId = newPhone.id; // VAPI phone number ID for linking

        // Update Supabase with the new number using ADMIN client (bypasses RLS)
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
                vapi_phone_number: importedNumber,
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('Supabase Phone Link Error:', updateError);
            return NextResponse.json({ error: `Phone imported to VAPI but failed to save to profile: ${updateError.message}` }, { status: 500 });
        }

        return NextResponse.json({ success: true, phoneNumber: importedNumber });

    } catch (e: unknown) {
        return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}
