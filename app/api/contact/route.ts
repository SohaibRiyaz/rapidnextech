import { NextResponse } from 'next/server';
import { Resend } from 'resend';


export async function POST(req: Request) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is missing');
            return NextResponse.json({ error: 'Mail service unconfigured' }, { status: 500 });
        }
        const {
            name,
            email,
            message,
            phone,
            inquiryType,
            preferredCallTime,
            bookingSource,
        } = await req.json();

        // Basic server-side validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Email to the company..
        const data = await resend.emails.send({
            from: 'RapidNexTech <notifications@rapidnextech.com>', // Matches working Loveable pattern
            to: ['sohaib@rapidnextech.com'], // Sent to confirmed working inbox
            replyTo: email, // Allow replying directly to the user
            subject: `${inquiryType ? `[${inquiryType}] ` : ""}New Lead: ${name} via Website`,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone / WhatsApp:</strong> ${phone}</p>` : ""}
        ${inquiryType ? `<p><strong>Inquiry Type:</strong> ${inquiryType}</p>` : ""}
        ${preferredCallTime ? `<p><strong>Preferred Call Time:</strong> ${preferredCallTime}</p>` : ""}
        ${bookingSource ? `<p><strong>Booking Source:</strong> ${bookingSource}</p>` : ""}
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
          ${message.replace(/\n/g, '<br>')}
        </blockquote>
      `,
        });

        if (data.error) {
            console.error('Resend API Error:', data.error);
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
