import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { AI_MODELS, DEFAULT_AI_MODEL } from '@/constants/models';
import OpenAI from 'openai';
import { VAPI_REFINEMENT_SYSTEM_PROMPT } from '@/constants/vapiPromptingGuidelines';

// Admin client that bypasses RLS for profile updates
function getSupabaseAdmin() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

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

        const supabaseAdmin = getSupabaseAdmin();
        const { data: profile } = await supabaseAdmin
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
        const supabaseAdmin = getSupabaseAdmin();

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

        // 2. Fetch the user's profile using admin client (bypasses RLS)
        let { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        if (profileError) {
            console.error('Profile fetch error:', profileError);
            return NextResponse.json({ error: 'Database error fetching profile.' }, { status: 500 });
        }

        if (!profile) {
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

        const vapiKey = process.env.VAPI_PRIVATE_KEY;
        if (!vapiKey) {
            console.error('VAPI_PRIVATE_KEY is not set in environment variables!');
            return NextResponse.json({ error: 'Server misconfiguration: VAPI private key is missing.' }, { status: 500 });
        }

        const { botName, clinicName, location, knowledgeBase, hours, adminEmail, adminPhone, greeting, customPrompt, aiModel, voiceId } = await request.json();

        // Validate all required fields
        const requiredFields = { botName, clinicName, location, knowledgeBase, hours, adminEmail, adminPhone, greeting, customPrompt };
        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                return NextResponse.json({ error: `${field} is required and cannot be empty.` }, { status: 400 });
            }
        }

        // Validate and parse Model selection (format: "provider|modelName", eg. "openai|gpt-4o")
        const selectedModel = aiModel || DEFAULT_AI_MODEL;
        const isValidModel = AI_MODELS.some(m => m.id === selectedModel);

        if (!isValidModel) {
            return NextResponse.json({ error: `Unsupported AI model: ${selectedModel}` }, { status: 400 });
        }

        const [provider, modelName] = selectedModel.split('|');

        // 4. Build base prompt and refine it with AI
        const basePrompt = `You are ${botName}, a professional AI receptionist for ${clinicName} located at ${location}.

ROLE:
You handle inbound phone calls for a healthcare clinic. You are warm, calm, professional, and empathetic. You speak Australian English naturally.

CLINIC INFORMATION:
- Practice: ${clinicName}
- Location: ${location}
- Operating Hours: ${hours}
- Admin Email: ${adminEmail}
- Admin Phone (for transfers): ${adminPhone}

SERVICES & KNOWLEDGE:
${knowledgeBase}

CALL HANDLING GUIDELINES:
1. APPOINTMENTS: Help callers enquire about availability and services. Do not book directly unless instructed — offer to take a message or direct to the online booking system if available.
2. CANCELLATIONS: Acknowledge and note the request. Always remind callers of the cancellation policy.
3. GENERAL ENQUIRIES: Answer based on the services and knowledge provided above. If unsure, offer to take a message.
4. EMERGENCIES: If a caller describes a medical emergency, immediately advise them to call 000 and do not delay.
5. ESCALATION: If a caller is distressed or requests to speak to a human, offer to transfer to ${adminPhone} or take a message for a callback.

IMPORTANT RULES:
- Never provide specific medical advice or diagnoses.
- Maintain patient privacy and confidentiality at all times.
- Keep responses concise — callers are on the phone, not reading.
- Always confirm the caller's name and contact number when taking a message.`;

        let promptWithOverrides = basePrompt;
        if (customPrompt && customPrompt.trim() !== '') {
            promptWithOverrides += `\n\nCLINIC-SPECIFIC OVERRIDES:\n${customPrompt}`;
        }

        // Refine the prompt with OpenAI to follow Vapi best practices
        let prompt = promptWithOverrides;
        const openaiKey = process.env.OPENAI_API_KEY;
        if (openaiKey) {
            try {
                const openai = new OpenAI({ apiKey: openaiKey });
                const completion = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    temperature: 0.3,
                    max_tokens: 2000,
                    messages: [
                        {
                            role: 'system',
                            content: VAPI_REFINEMENT_SYSTEM_PROMPT
                        },
                        {
                            role: 'user',
                            content: `Here is the current system prompt to restructure:\n\n${promptWithOverrides}`
                        }
                    ]
                });
                const refinedContent = completion.choices[0]?.message?.content?.trim();
                if (refinedContent) {
                    prompt = refinedContent;
                }
            } catch (openaiError: any) {
                console.error('OpenAI refinement error:', openaiError?.message);
                console.warn('Falling back to unrefined prompt');
            }
        } else {
            console.warn('OPENAI_API_KEY not set, using unrefined prompt');
        }

        // Create the VAPI payload that works for both creation and updating
        const vapiPayload = {
            name: `${clinicName} Assistant`,
            model: {
                provider: provider || "openai",
                model: modelName || "gpt-3.5-turbo",
                messages: [
                    { role: 'system', content: prompt }
                ]
            },
            voice: {
                provider: "11labs",
                voiceId: voiceId || "XB0fDUnXU5powFXDhCwa", // Charlotte (Australian female, default)
            },
            firstMessage: greeting,
            serverUrl: "https://cypk23.app.n8n.cloud/webhook/94bd9da8-4db8-4e6b-897a-daca90aae8c1"
        };

        // 15-second timeout for VAPI calls so the button never gets permanently stuck
        const makeVapiRequest = (url: string, method: string, body: object) => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);
            return fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${vapiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
                signal: controller.signal
            }).finally(() => clearTimeout(timeout));
        };

        let assistantId = profile.vapi_assistant_id;

        // 5. Automatic Provisioning Logic
        if (!assistantId) {
            // THEY DON'T HAVE A BOT YET! CREATE ONE ON THE FLY.
            let vapiCreateRes;
            try {
                vapiCreateRes = await makeVapiRequest(`https://api.vapi.ai/assistant`, 'POST', vapiPayload);
            } catch (fetchErr: any) {
                const msg = fetchErr?.name === 'AbortError' ? 'VAPI request timed out. Please try again.' : 'Failed to reach VAPI. Check your connection.';
                return NextResponse.json({ error: msg }, { status: 500 });
            }

            if (!vapiCreateRes.ok) {
                const err = await vapiCreateRes.text();
                console.error('VAPI Create Error:', err);
                return NextResponse.json({ error: `VAPI Error: ${err}` }, { status: 500 });
            }

            const newAssistant = await vapiCreateRes.json();
            assistantId = newAssistant.id; // Grab the newly created ID

            // Instantly link this new bot directly to their Supabase profile using ADMIN client!
            const { error: updateError } = await supabaseAdmin
                .from('profiles')
                .update({
                    vapi_assistant_id: assistantId,
                    clinic_name: clinicName
                })
                .eq('id', user.id);

            if (updateError) {
                console.error('Failed to link new Assistant ID to profile:', updateError);
                return NextResponse.json({ error: `Assistant created but failed to save ID: ${updateError.message}` }, { status: 500 });
            }

        } else {
            // THEY ALREADY HAVE A BOT! JUST UPDATE IT.
            let vapiUpdateRes;
            try {
                vapiUpdateRes = await makeVapiRequest(`https://api.vapi.ai/assistant/${assistantId}`, 'PATCH', vapiPayload);
            } catch (fetchErr: any) {
                const msg = fetchErr?.name === 'AbortError' ? 'VAPI request timed out. Please try again.' : 'Failed to reach VAPI. Check your connection.';
                return NextResponse.json({ error: msg }, { status: 500 });
            }

            if (!vapiUpdateRes.ok) {
                const err = await vapiUpdateRes.text();
                console.error('VAPI Update Error:', err);
                return NextResponse.json({ error: `VAPI Error: ${err}` }, { status: 500 });
            }
        }

        // Save metadata into Supabase using ADMIN client so we can fetch it when they log in later!
        const settingsPayload = { botName, clinicName, location, knowledgeBase, hours, adminEmail, adminPhone, greeting, customPrompt, aiModel, voiceId: voiceId || "XB0fDUnXU5powFXDhCwa" };
        const { error: settingsError } = await supabaseAdmin.from('profiles').update({
            clinic_name: clinicName,
            settings_json: JSON.stringify(settingsPayload)
        }).eq('id', user.id);

        if (settingsError) {
            console.error("Settings save error:", settingsError.message);
            return NextResponse.json({ error: `Failed to save settings: ${settingsError.message}` }, { status: 500 });
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
