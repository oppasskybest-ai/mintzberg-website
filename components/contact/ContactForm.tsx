'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Something went wrong.')
      }
      setStatus('sent')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'sent') {
    return (
      <div className="premium-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ marginBottom: 0 }}>Thank you — your message has been sent.</p>
      </div>
    )
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.7rem 0.9rem',
    border: '1px solid var(--rule)',
    borderRadius: '3px',
    fontFamily: 'inherit',
    fontSize: '1rem',
    background: 'var(--paper)',
    color: 'var(--ink)',
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
          Name *
        </label>
        <input id="name" name="name" type="text" required style={fieldStyle} />
      </div>
      <div>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
          Email *
        </label>
        <input id="email" name="email" type="email" required style={fieldStyle} />
      </div>
      <div>
        <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
          Subject
        </label>
        <input id="subject" name="subject" type="text" style={fieldStyle} />
      </div>
      <div>
        <label htmlFor="message" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
          Message *
        </label>
        <textarea id="message" name="message" required rows={6} style={{ ...fieldStyle, resize: 'vertical' }} />
      </div>
      {status === 'error' && (
        <p style={{ color: 'var(--orange)', fontSize: '0.9rem' }}>{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="pager-link"
        style={{
          alignSelf: 'flex-start',
          padding: '0 1.5rem',
          height: '2.75rem',
          background: 'var(--navy)',
          borderColor: 'var(--navy)',
          color: 'var(--paper)',
          cursor: status === 'sending' ? 'wait' : 'pointer',
        }}
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
