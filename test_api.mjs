import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
console.log('=== OpenAI API Key Debug ===');
console.log('API Key exists:', !!apiKey);
if (apiKey) {
    console.log('API Key starts with sk-:', apiKey.startsWith('sk-'));
    console.log('API Key length:', apiKey.length);
    console.log('API Key preview:', apiKey.substring(0, 30) + '...');
}

if (!apiKey) {
    console.log('ERROR: OPENAI_API_KEY not set');
    process.exit(1);
}

const openai = new OpenAI({ apiKey });
console.log('✓ OpenAI client created');

try {
    console.log('Calling gpt-4o-mini...');
    const res = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 50,
        messages: [
            { role: 'system', content: 'Say hello in one word' },
            { role: 'user', content: 'Hello' }
        ]
    });
    console.log('✓ API call successful');
    console.log('Response:', res.choices[0].message.content);
} catch (err) {
    console.log('✗ API Error:');
    console.log('Status:', err.status);
    console.log('Message:', err.message);
    if (err.error?.message) {
        console.log('Error message:', err.error.message);
    }
    process.exit(1);
}
