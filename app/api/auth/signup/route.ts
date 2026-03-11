import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Use the admin client (service role) to create user with auto-confirm
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Create user with admin API - this auto-confirms the email
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm the email
        });

        if (error) {
            // If user already exists, return a friendly message
            if (error.message?.includes('already been registered') || error.message?.includes('already exists')) {
                return NextResponse.json(
                    { error: 'An account with this email already exists. Please sign in instead.' },
                    { status: 409 }
                );
            }
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        // Also upsert into haylo_users table for tracking
        if (data.user) {
            await supabaseAdmin.from('haylo_users').upsert({
                id: data.user.id,
                email: data.user.email,
                last_login: new Date().toISOString()
            }, {
                onConflict: 'id'
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Account created successfully. You can now sign in.'
        });
    } catch (err) {
        console.error('Signup error:', err);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
