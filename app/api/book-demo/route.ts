import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fullName, email, mobile, company, address } = body;

        if (!fullName || !email || !mobile) {
            return NextResponse.json({ error: 'Please provide all required fields.' }, { status: 400 });
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from('book_a_demo')
            .insert([
                {
                    full_name: fullName,
                    email,
                    mobile,
                    company,
                    address,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) {
            console.error('Error inserting demo booking:', error);
            // Even if table doesn't exist, don't crash hard explicitly, return standard error
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Send Email
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: process.env.SMTP_USER || '"Haylo Demo Request" <no-reply@haylo.co>',
                to: 'hello23labs@gmail.com',
                subject: `New Demo Request from ${fullName}`,
                text: `New Demo Request:\n\nName: ${fullName}\nEmail: ${email}\nMobile: ${mobile}\nCompany: ${company}\nAddress: ${address}`,
                html: `
                  <h2>New Demo Request</h2>
                  <p><strong>Name:</strong> ${fullName}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Mobile:</strong> ${mobile}</p>
                  <p><strong>Company:</strong> ${company || 'N/A'}</p>
                  <p><strong>Address:</strong> ${address || 'N/A'}</p>
                `
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // We just log the error to avoid failing the whole request process if SMTP isn't setup yet.
        }

        // Trigger n8n Webhook
        try {
            const webhookUrl = new URL('https://cypk23.app.n8n.cloud/webhook/700a7a5a-9831-472a-8bd4-221df5b5a66b');
            webhookUrl.searchParams.append('fullName', fullName);
            webhookUrl.searchParams.append('email', email);
            webhookUrl.searchParams.append('mobile', mobile);
            webhookUrl.searchParams.append('company', company || '');
            webhookUrl.searchParams.append('address', address || '');

            await fetch(webhookUrl.toString(), {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
        } catch (webhookError) {
            console.error('Webhook trigger failed:', webhookError);
        }

        return NextResponse.json({ success: true, message: 'Your demo request has been submitted.' });

    } catch (e: unknown) {
        console.error('Book a Demo POST error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
