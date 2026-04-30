import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Allow up to 30 seconds for this route (VAPI phone import)
export const maxDuration = 30;

function getSupabaseAdmin() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

/**
 * POST - Import a phone number from Twilio into VAPI and link it to the user's assistant.
 * If the user already has a phone number, the old one is deleted from VAPI first (edit/replace flow).
 * Also stores Twilio credentials in Supabase for future edits.
 */
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
            .select('vapi_assistant_id, vapi_phone_number, vapi_phone_id, clinic_name')
            .eq('id', user.id)
            .maybeSingle();

        if (!profile?.vapi_assistant_id) {
            return NextResponse.json({ error: 'Please save your Settings first to generate an Assistant before importing a phone number.' }, { status: 400 });
        }

        const body = await request.json();
        const { number, twilioAccountSid, twilioAuthToken } = body;

        if (!number || !number.trim()) {
            return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
        }

        if (!twilioAccountSid || !twilioAuthToken) {
            return NextResponse.json({ error: 'Twilio Account SID and Auth Token are required.' }, { status: 400 });
        }

        // --- If user already has a phone number in VAPI, delete it first (edit/replace flow) ---
        if (profile.vapi_phone_id) {
            console.log('Replacing existing phone. Deleting old VAPI phone ID:', profile.vapi_phone_id);
            try {
                const deleteController = new AbortController();
                // Increased to 25s to avoid premature timeouts before Vercel limits out
                const deleteTimeout = setTimeout(() => deleteController.abort(), 25000);
                const deleteRes = await fetch(`https://api.vapi.ai/phone-number/${profile.vapi_phone_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${vapiKey}`,
                        'Content-Type': 'application/json'
                    },
                    signal: deleteController.signal
                });
                clearTimeout(deleteTimeout);

                if (!deleteRes.ok) {
                    const errText = await deleteRes.text();
                    console.warn('Failed to delete old VAPI phone (continuing anyway):', errText);
                }
            } catch (delErr: any) {
                console.warn('Error deleting old VAPI phone (continuing anyway):', delErr?.message);
            }
        }

        // --- Import the new phone number to VAPI ---
        const payload: any = {
            provider: 'twilio',
            number: number,
            twilioAccountSid: twilioAccountSid,
            twilioAuthToken: twilioAuthToken,
            name: `${profile.clinic_name || 'Haylo'} Twilio Number`,
            // Link phone number to the user's existing assistant
            assistantId: profile.vapi_assistant_id,
        };

        const controller = new AbortController();
        // Increased to 25s to give Vapi enough time to provision Twilio numbers
        const timeout = setTimeout(() => controller.abort(), 25000);

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
                const errorMessage = errorObj.message || errorObj.error?.message || 'Failed to import phone number. Check your credentials.';
                return NextResponse.json({ error: errorMessage }, { status: 500 });
            } catch (e) {
                // If it's not JSON, it could be a Vercel 504 Gateway Timeout HTML page
                if (vapiRes.status === 504) {
                    return NextResponse.json({ error: 'Request timed out waiting for Vapi. Please try again.' }, { status: 504 });
                }
                return NextResponse.json({ error: `Failed to import phone number. Server returned status ${vapiRes.status}.` }, { status: 500 });
            }
        }

        const newPhone = await vapiRes.json();
        const importedNumber = newPhone.number; // e.g., +1XXXXXXXXXX
        const vapiPhoneId = newPhone.id; // VAPI phone number ID for future operations

        // Update Supabase with the new number, phone ID, and Twilio credentials using ADMIN client (bypasses RLS)
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
                vapi_phone_number: importedNumber,
                vapi_phone_id: vapiPhoneId || null,
                twilio_account_sid: twilioAccountSid,
                twilio_auth_token: twilioAuthToken,
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('Supabase Phone Link Error:', updateError);
            return NextResponse.json({ error: `Phone imported to VAPI but failed to save to profile: ${updateError.message}` }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            phoneNumber: importedNumber,
            phoneId: vapiPhoneId,
            twilioAccountSid: twilioAccountSid,
        });

    } catch (e: unknown) {
        return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}
