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
            .select('vapi_assistant_id, vapi_phone_number, vapi_phone_id, twilio_account_sid')
            .eq('id', user.id)
            .maybeSingle();

        return NextResponse.json({
            phoneNumber: profile?.vapi_phone_number || null,
            phoneId: profile?.vapi_phone_id || null,
            assistantId: profile?.vapi_assistant_id || null,
            twilioAccountSid: profile?.twilio_account_sid || null,
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

        const body = await request.json();
        const { areaCode } = body;

        if (!areaCode) {
            return NextResponse.json({ error: 'Area code is required' }, { status: 400 });
        }

        // Get user's profile to check if assistant exists and get clinic name
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('vapi_assistant_id, settings_json')
            .eq('id', user.id)
            .maybeSingle();

        if (profileError) {
            return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
        }

        if (!profile?.vapi_assistant_id) {
            return NextResponse.json({
                error: 'Please save your clinic settings first to create an assistant'
            }, { status: 400 });
        }

        let clinicName = 'Clinic';
        try {
            const settings = typeof profile.settings_json === 'string'
                ? JSON.parse(profile.settings_json)
                : profile.settings_json;
            if (settings?.clinicName) {
                clinicName = settings.clinicName;
            }
        } catch (e) {
            console.error('Failed to parse settings');
        }

        // Call Vapi API to buy a phone number
        const vapiKey = process.env.VAPI_PRIVATE_KEY;
        if (!vapiKey) {
            return NextResponse.json({ error: 'Vapi configuration missing' }, { status: 500 });
        }

        console.log('Purchasing phone number with area code:', areaCode);
        const vapiResponse = await fetch('https://api.vapi.ai/phone-number', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${vapiKey}`
            },
            body: JSON.stringify({
                provider: 'vapi',
                numberDesiredAreaCode: areaCode,
                assistantId: profile.vapi_assistant_id,
                name: `${clinicName} - Receptionist`
            })
        });

        const vapiData = await vapiResponse.json();

        if (!vapiResponse.ok) {
            console.error('Vapi error:', vapiData);
            return NextResponse.json({
                error: vapiData.message || 'Failed to purchase phone number from Vapi'
            }, { status: 500 });
        }

        console.log('Vapi response:', JSON.stringify(vapiData, null, 2));
        const phoneNumber = vapiData.phoneNumber || vapiData.number || vapiData.inboundPhoneNumber;
        const vapiPhoneId = vapiData.id; // Store the VAPI phone number ID for future operations

        if (!phoneNumber) {
            console.error('Phone number not found in response. Full response:', vapiData);
            return NextResponse.json({
                error: `No phone number returned from Vapi. Response: ${JSON.stringify(vapiData)}`
            }, { status: 500 });
        }

        // Save the phone number and VAPI phone ID to Supabase
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
                vapi_phone_number: phoneNumber,
                vapi_phone_id: vapiPhoneId || null
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('Failed to save phone number:', updateError);
            return NextResponse.json({
                error: 'Failed to save phone number'
            }, { status: 500 });
        }

        console.log('Successfully purchased phone number:', phoneNumber);
        return NextResponse.json({ phoneNumber, phoneId: vapiPhoneId });

    } catch (e: any) {
        console.error('Phone purchase error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

/**
 * DELETE - Remove the phone number from VAPI and clear it + Twilio creds from Supabase
 */
export async function DELETE(request: Request) {
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

        // Get the user's current phone ID from Supabase
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('vapi_phone_number, vapi_phone_id')
            .eq('id', user.id)
            .maybeSingle();

        if (!profile?.vapi_phone_number) {
            return NextResponse.json({ error: 'No phone number to delete.' }, { status: 400 });
        }

        // If we have a VAPI phone ID, delete from VAPI first
        if (profile.vapi_phone_id) {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);

            try {
                const vapiRes = await fetch(`https://api.vapi.ai/phone-number/${profile.vapi_phone_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${vapiKey}`,
                        'Content-Type': 'application/json'
                    },
                    signal: controller.signal
                });

                if (!vapiRes.ok) {
                    const errText = await vapiRes.text();
                    console.error('VAPI Phone Delete Error:', errText);
                    // Continue to clear from Supabase even if VAPI fails (phone may already be removed)
                }
            } catch (fetchErr: any) {
                console.error('VAPI delete fetch error:', fetchErr?.message);
                // Continue to clear from Supabase even if VAPI request fails
            } finally {
                clearTimeout(timeout);
            }
        }

        // Clear the phone number AND Twilio credentials from Supabase
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
                vapi_phone_number: null,
                vapi_phone_id: null,
                twilio_account_sid: null,
                twilio_auth_token: null,
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('Failed to clear phone number from Supabase:', updateError);
            return NextResponse.json({ error: `Failed to remove phone number: ${updateError.message}` }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Phone number deleted successfully.' });

    } catch (e: unknown) {
        return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}
