import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function GET() {
    try {
        const supabase = await createClient();

        let user;
        try {
            const { data, error: authError } = await supabase.auth.getUser();
            if (authError) {
                const errMsg = authError.message?.toLowerCase() || '';
                if (errMsg.includes('timeout') || errMsg.includes('fetch') || errMsg.includes('enotfound') || errMsg.includes('connect')) {
                    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
                }
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            user = data.user;
        } catch (connErr: any) {
            console.error('Vapi GET auth error:', connErr?.message);
            return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
        }

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        return NextResponse.json(profile || {});
    } catch (e: unknown) {
        console.error('Vapi GET error:', e);
        return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Authenticate user to ensure they are logged in
        let user;
        try {
            const { data, error: authError } = await supabase.auth.getUser();
            if (authError) {
                const errMsg = authError.message?.toLowerCase() || '';
                if (errMsg.includes('timeout') || errMsg.includes('fetch') || errMsg.includes('enotfound') || errMsg.includes('connect')) {
                    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
                }
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            user = data.user;
        } catch (connErr: any) {
            console.error('Vapi POST auth error:', connErr?.message);
            return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
        }

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Fetch the user's profile from the Supabase database
        // 2. Fetch the user's profile from the Supabase database
        let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        if (profileError) {
            return NextResponse.json({ error: 'Database error fetching profile.' }, { status: 500 });
        }

        if (!profile) {
            const supabaseAdmin = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );

            const { data: newProfile, error: upsertError } = await supabaseAdmin
                .from('profiles')
                .upsert([{ id: user.id, email: user.email }], { onConflict: 'id' })
                .select()
                .single();

            if (upsertError) {
                console.error("Profile upsert error:", upsertError);
                return NextResponse.json({ error: `Failed to create profile: ${upsertError.message}` }, { status: 500 });
            }
            profile = newProfile;
        }

        const { botName, clinicName, location, knowledgeBase, hours, adminEmail, adminPhone, greeting, customPrompt, aiModel } = await request.json();

        // Parse Model selection (format: "provider|modelName", eg. "openai|gpt-4o")
        const [provider, modelName] = (aiModel || 'openai|gpt-3.5-turbo').split('|');

        // 4. Construct the new system prompt
        let prompt = `You are a helpful AI receptionist named ${botName} working for ${clinicName} at the ${location} branch.\n\nKnowledge Base:\n${knowledgeBase}\n\nOperating Hours:\n${hours}\n\nAlways be polite and professional. Admin email is ${adminEmail} and phone is ${adminPhone}.`;

        // Append custom user prompt
        if (customPrompt && customPrompt.trim() !== '') {
            prompt += `\n\nAdditional Instructions:\n${customPrompt}`;
        }

        // Create the VAPI payload that works for both creation and updating
        const vapiPayload = {
            name: `${clinicName} Assistant`,
            model: {
                provider: provider || "openai",
                model: modelName || "gpt-3.5-turbo",
                toolIds: ["775ffe36-e032-470d-b70f-7a529c50180b"],
                messages: [
                    { role: 'system', content: prompt }
                ]
            },
            voice: {
                provider: "11labs",
                voiceId: "Ksdv9ebj41pjuicmeoou",
                model: "eleven_turbo_v2_5"
            },
            firstMessage: greeting
        };

        let assistantId = profile.vapi_assistant_id;

        // 5. Automatic Provisioning Logic
        if (!assistantId) {
            // THEY DON'T HAVE A BOT YET! CREATE ONE ON THE FLY.
            const vapiCreateRes = await fetch(`https://api.vapi.ai/assistant`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vapiPayload)
            });

            if (!vapiCreateRes.ok) {
                const err = await vapiCreateRes.text();
                console.error('VAPI Create Error:', err);
                return NextResponse.json({ error: 'Failed to automatically provision a new VAPI assistant.' }, { status: 500 });
            }

            const newAssistant = await vapiCreateRes.json();
            assistantId = newAssistant.id; // Grab the newly created ID

            // Instantly link this new bot directly to their Supabase profile!
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    vapi_assistant_id: assistantId,
                    clinic_name: clinicName
                })
                .eq('id', user.id);

            if (updateError) {
                console.error('Failed to link new Assistant ID to profile:', updateError);
                // We won't block the request, but we should log it
            }

        } else {
            // THEY ALREADY HAVE A BOT! JUST UPDATE IT.
            const vapiUpdateRes = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vapiPayload)
            });

            if (!vapiUpdateRes.ok) {
                const err = await vapiUpdateRes.text();
                console.error('VAPI Update Error:', err);
                return NextResponse.json({ error: 'Failed to update your existing VAPI assistant.' }, { status: 500 });
            }
        }

        // Save metadata into Supabase so we can fetch it when they log in later!
        const settingsPayload = { botName, clinicName, location, knowledgeBase, hours, adminEmail, adminPhone, greeting, customPrompt, aiModel };
        const { error: settingsError } = await supabase.from('profiles').update({
            clinic_name: clinicName,
            settings_json: JSON.stringify(settingsPayload)
        }).eq('id', user.id);

        if (settingsError) {
            console.error("Settings save error:", settingsError.message);
        }

        return NextResponse.json({
            success: true,
            message: 'Assistant synced successfully!',
            assistant_id: assistantId
        });

    } catch (e: unknown) {
        return NextResponse.json({ error: e instanceof Error ? e.message : 'Internal Server Error' }, { status: 500 });
    }
}
