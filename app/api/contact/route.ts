import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Mirrors the original Drupal webform fields exactly (see PROGRESS.md):
// Name, Email, Subject, Message. Sends via Resend if configured;
// otherwise returns a clear error so the failure isn't silent.
export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL

  if (!apiKey || !toEmail) {
    return NextResponse.json(
      { error: 'Contact form is not configured yet (missing RESEND_API_KEY / CONTACT_TO_EMAIL).' },
      { status: 503 }
    )
  }

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: 'Mintzberg Website <onboarding@resend.dev>',
      to: toEmail,
      replyTo: email,
      subject: subject ? `[Website] ${subject}` : '[Website] New contact form submission',
      text: `From: ${name} <${email}>\n\n${message}`,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form send failed:', err)
    return NextResponse.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 })
  }
}
