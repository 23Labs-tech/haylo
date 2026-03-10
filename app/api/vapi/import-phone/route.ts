import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('vapi_assistant_id, vapi_phone_number, clinic_name')
            .eq('id', user.id)
            .single();

        if (!profile?.vapi_assistant_id) {
            return NextResponse.json({ error: 'Please save your Settings first to generate an Assistant before importing a phone number.' }, { status: 400 });
        }

        if (profile?.vapi_phone_number) {
            return NextResponse.json({ error: 'You already have a phone number.' }, { status: 400 });
        }

        const body = await request.json();
        const { number, twilioAccountSid, twilioAuthToken } = body;

        let payload: any = {
            provider: 'twilio',
            number: number,
            assistantId: profile.vapi_assistant_id,
        };

        if (!twilioAccountSid || !twilioAuthToken) {
            return NextResponse.json({ error: 'Twilio Account SID and Auth Token are required.' }, { status: 400 });
        }

        payload.twilioAccountSid = twilioAccountSid;
        payload.twilioAuthToken = twilioAuthToken;
        payload.name = `${profile.clinic_name} Twilio Number`;


        // Import phone number to Vapi
        const vapiRes = await fetch(`https://api.vapi.ai/phone-number`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.VAPI_PUBLIC_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

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

        // Update Supabase with the new number
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ vapi_phone_number: importedNumber })
            .eq('id', user.id);

        if (updateError) {
            console.error('Supabase Phone Link Error:', updateError);
            return NextResponse.json({ error: 'Failed to link number to profile.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, phoneNumber: importedNumber });

    } catch (e: unknown) {
        return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}
