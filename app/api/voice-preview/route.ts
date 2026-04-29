import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { VOICE_OPTIONS } from '@/constants/voices';

function generateToneWav(frequency: number, durationMs: number): Buffer {
    const sampleRate = 44100;
    const samples = Math.floor(durationMs * sampleRate / 1000);
    const buffer = Buffer.alloc(44 + samples * 2);

    // WAV header
    const headerView = new DataView(buffer.buffer);
    let offset = 0;

    // RIFF header
    headerView.setUint32(offset, 0x46464952, true); offset += 4; // "RIFF"
    headerView.setUint32(offset, 36 + samples * 2, true); offset += 4;
    headerView.setUint32(offset, 0x45564157, true); offset += 4; // "WAVE"

    // fmt subchunk
    headerView.setUint32(offset, 0x20746d66, true); offset += 4; // "fmt "
    headerView.setUint32(offset, 16, true); offset += 4;
    headerView.setUint16(offset, 1, true); offset += 2; // PCM
    headerView.setUint16(offset, 1, true); offset += 2; // mono
    headerView.setUint32(offset, sampleRate, true); offset += 4;
    headerView.setUint32(offset, sampleRate * 2, true); offset += 4;
    headerView.setUint16(offset, 2, true); offset += 2;
    headerView.setUint16(offset, 16, true); offset += 2;

    // data subchunk
    headerView.setUint32(offset, 0x61746164, true); offset += 4; // "data"
    headerView.setUint32(offset, samples * 2, true); offset += 4;

    // Generate sine wave
    const amplitude = 30000;
    const view = new Int16Array(buffer.buffer, 44);
    for (let i = 0; i < samples; i++) {
        const sample = amplitude * Math.sin(2 * Math.PI * frequency * i / sampleRate);
        view[i] = Math.max(-32768, Math.min(32767, sample));
    }

    return buffer;
}

export async function GET(request: Request) {
    try {
        const supabase = await createClient();

        let user;
        try {
            const { data, error: authError } = await supabase.auth.getUser();
            if (authError) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            user = data.user;
        } catch (connErr: any) {
            console.error('Voice preview GET auth error:', connErr?.message);
            return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
        }

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(request.url);
        const voiceId = url.searchParams.get('voiceId');

        if (!voiceId) {
            return NextResponse.json({ error: 'voiceId is required' }, { status: 400 });
        }

        const voice = VOICE_OPTIONS.find(v => v.id === voiceId);
        if (!voice) {
            return NextResponse.json({ error: 'Invalid voice ID' }, { status: 400 });
        }

        console.log('Generating preview for voice:', voice.name);

        const frequencyMap: Record<string, number> = {
            'Charlotte': 220, // A3
            'Bella': 246.94, // B3
            'Rachel': 261.63, // C4
            'Domi': 293.66, // D4
            'Will': 330, // E4
        };

        const frequency = frequencyMap[voice.name] || 440; // Default to A4
        const audioBuffer = generateToneWav(frequency, 500);

        return new NextResponse(new Uint8Array(audioBuffer), {
            headers: {
                'Content-Type': 'audio/wav',
                'Content-Length': audioBuffer.length.toString(),
                'Cache-Control': 'public, max-age=86400'
            }
        });
    } catch (e: unknown) {
        console.error('Voice preview GET error:', e);
        return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}
