'use client'
import { useState } from 'react'
import { useAdmin } from '../layout'
import { useAuthFetch } from '@/lib/hooks/useAuthFetch'

function SeedSection() {
  const authFetch = useAuthFetch()
  const [seeding, setSeeding] = useState(false)
  const [result, setResult] = useState('')

  const handleSeed = async () => {
    if (!confirm(
      '⚠️ SEED DATA\n\nThis will insert all parsed blog posts, books, and videos into the database.\n\nAnything already in the database (matched by slug) will be SKIPPED — your admin edits are always safe.\n\nRun the seed?'
    )) return

    setSeeding(true)
    setResult('')
    try {
      const res = await authFetch('/api/admin/seed', { method: 'POST' })
      const data = await res.json()
      setResult(data.message || (res.ok ? 'Done.' : 'Something went wrong.'))
    } catch {
      setResult('Request failed. Please try again.')
    }
    setSeeding(false)
  }

  return (
    <div style={{ background: '#141b26', border: '1px solid rgba(224,92,26,0.15)', borderRadius: '4px', padding: '1.75rem', marginBottom: '1.5rem' }}>
      <p style={{ fontSize: '0.62rem', color: 'rgba(224,140,80,0.85)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
        ⚠ Seed Parsed Content
      </p>
      <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '1.25rem', maxWidth: '560px' }}>
        Inserts every parsed blog post, book, and video (231 / 21 / 18) into Supabase so they
        appear on the public site and become editable from this panel. Items already in the
        database are <strong style={{ color: 'rgba(255,255,255,0.75)' }}>always skipped</strong> —
        running this more than once is safe and will never overwrite anything you've already
        edited here.
      </p>
      <button
        onClick={handleSeed}
        disabled={seeding}
        style={{ padding: '0.7rem 1.5rem', background: seeding ? 'rgba(224,92,26,0.15)' : 'rgba(224,92,26,0.12)', border: '1px solid rgba(224,92,26,0.3)', color: seeding ? 'rgba(224,92,26,0.4)' : 'rgba(224,92,26,0.9)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: seeding ? 'not-allowed' : 'pointer', borderRadius: '2px' }}
      >
        {seeding ? 'Seeding…' : 'Run Seed'}
      </button>
      {result && (
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: result.toLowerCase().includes('error') || result.toLowerCase().includes('failed') ? '#e74c3c' : 'rgba(90,216,138,0.85)', lineHeight: 1.6 }}>
          {result}
        </p>
      )}
    </div>
  )
}

export default function AdminSettings() {
  const { logout } = useAdmin()

  return (
    <div style={{ padding: '2.5rem' }}>
      <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: 'white', fontWeight: 400, marginBottom: '0.5rem' }}>Settings</h1>
      <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginBottom: '2.5rem' }}>Site configuration and account settings.</p>

      <div style={{ background: '#141b26', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '1.75rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.62rem', color: 'rgba(224,92,26,0.7)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Required Environment Variables</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            'NEXT_PUBLIC_SUPABASE_URL',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            'SUPABASE_SERVICE_ROLE_KEY',
            'ADMIN_USERNAME',
            'ADMIN_PASSWORD',
            'ADMIN_SESSION_SECRET',
            'RESEND_API_KEY',
            'CONTACT_TO_EMAIL',
          ].map((v) => (
            <div key={v} style={{ padding: '0.5rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <code style={{ fontSize: '0.78rem', color: '#e0a878', fontFamily: 'monospace' }}>{v}</code>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', marginTop: '1rem', lineHeight: 1.6 }}>
          Set these in <code style={{ color: '#e0a878' }}>.env.local</code> (local dev) or your
          deployment platform's environment settings (production). See SUPABASE_SETUP.md.
        </p>
      </div>

      <div style={{ background: '#141b26', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '1.75rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.62rem', color: 'rgba(224,92,26,0.7)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Session</p>
        <button onClick={logout} style={{ padding: '0.65rem 1.25rem', background: 'transparent', border: '1px solid rgba(255,80,80,0.25)', color: 'rgba(255,100,100,0.7)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}>
          Sign Out
        </button>
      </div>

      <SeedSection />
    </div>
  )
}
