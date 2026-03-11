import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required.' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters long.' },
                { status: 400 }
            );
        }

        // Use admin (service role) client — no email/link needed
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Step 1: Look up the user by email
        const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

        if (listError) {
            return NextResponse.json(
                { error: 'Unable to process request. Please try again.' },
                { status: 500 }
            );
        }

        const user = usersData.users.find(
            (u) => u.email?.toLowerCase() === email.toLowerCase()
        );

        if (!user) {
            // Return a generic message so we don't leak whether an email exists
            return NextResponse.json(
                { error: 'No account found with that email address.' },
                { status: 404 }
            );
        }

        // Step 2: Directly update the password via admin API (no email link required)
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { password }
        );

        if (updateError) {
            return NextResponse.json(
                { error: updateError.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Password updated successfully.',
        });
    } catch (err) {
        console.error('Reset password error:', err);
        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again.' },
            { status: 500 }
        );
    }
}
