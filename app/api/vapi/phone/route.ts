import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
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
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
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

        // Buy phone number from Vapi
        const vapiRes = await fetch(`https://api.vapi.ai/phone-number/buy`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.VAPI_PUBLIC_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                areaCode: areaCode || "415", // default to SF area code if none provided
                assistantId: profile.vapi_assistant_id,
                name: `${profile.clinic_name} Phone Number`
            })
        });

        if (!vapiRes.ok) {
            const err = await vapiRes.text();
            console.error('VAPI Phone Buy Error:', err);
            return NextResponse.json({ error: 'Failed to purchase phone number. Please try another area code.' }, { status: 500 });
        }

        const newPhone = await vapiRes.json();
        const purchasedNumber = newPhone.number; // +1XXXXXXXXXX

        // Update Supabase with the new number
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ vapi_phone_number: purchasedNumber })
            .eq('id', user.id);

        if (updateError) {
            console.error('Supabase Phone Link Error:', updateError);
        }

        return NextResponse.json({ success: true, phoneNumber: purchasedNumber });

    } catch (e: unknown) {
        return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}
