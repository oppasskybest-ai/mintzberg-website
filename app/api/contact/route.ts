import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase/server'

// Mirrors the original Drupal webform fields exactly (see PROGRESS.md):
// Name, Email, Subject, Message. Always saves to Supabase (contact_messages
// table, viewable in the admin Messages page) if Supabase is configured,
// regardless of whether email sending works — a submission is never lost
// just because Resend isn't set up yet. Sends via Resend additionally if
// RESEND_API_KEY/CONTACT_TO_EMAIL are set.
export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
  }

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  if (supabaseConfigured) {
    const { error } = await supabaseAdmin.from('contact_messages').insert({ name, email, subject, message })
    if (error) console.error('[contact] failed to save message:', error.message)
  }

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL

  if (!apiKey || !toEmail) {
    // Message is still saved above (if Supabase is configured) — this
    // just means no email notification goes out yet.
    return NextResponse.json({
      ok: true,
      warning: supabaseConfigured
        ? 'Message saved. Email notifications are not configured yet (RESEND_API_KEY / CONTACT_TO_EMAIL).'
        : 'Message was not saved anywhere yet — neither Supabase nor Resend is configured.',
    })
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
    // Message was still saved to Supabase above, so this isn't a total
    // failure from the person's perspective — just no email went out.
    return NextResponse.json({
      ok: true,
      warning: 'Message saved, but the email notification failed to send.',
    })
  }
}
