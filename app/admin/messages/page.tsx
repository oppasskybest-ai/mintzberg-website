'use client'
import { useCallback, useEffect, useState } from 'react'
import { useAuthFetch } from '@/lib/hooks/useAuthFetch'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  created_at: string
}

export default function AdminMessages() {
  const authFetch = useAuthFetch()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await authFetch('/api/admin/messages')
    if (res.ok) setMessages(await res.json())
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { load() }, [load])

  const markRead = async (id: string) => {
    await authFetch(`/api/admin/messages/${id}`, { method: 'PUT', body: JSON.stringify({ read: true }) })
    load()
  }
  const del = async (id: string) => {
    if (!confirm('Delete this message?')) return
    await authFetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div style={{ padding: '2.5rem' }}>
      <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: 'white', fontWeight: 400, marginBottom: '2rem' }}>
        Messages
      </h1>
      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading…</p>
      ) : messages.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>No contact form submissions yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: 0 }}>
          {messages.map((m) => (
            <div key={m.id} style={{ padding: '1.25rem', background: '#141b26', border: `1px solid ${m.read ? 'rgba(255,255,255,0.06)' : 'rgba(224,92,26,0.3)'}`, borderRadius: '3px', minWidth: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>
                  <p style={{ color: 'white', fontSize: '0.9rem' }}>{m.name} <span style={{ color: 'rgba(255,255,255,0.4)' }}>&lt;{m.email}&gt;</span></p>
                  {m.subject && <p style={{ color: 'rgba(224,92,26,0.85)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{m.subject}</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  {!m.read && (
                    <button onClick={() => markRead(m.id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(224,92,26,0.1)', border: '1px solid rgba(224,92,26,0.25)', color: 'rgba(224,92,26,0.85)', fontSize: '0.72rem', borderRadius: '2px', cursor: 'pointer' }}>
                      Mark read
                    </button>
                  )}
                  <button onClick={() => del(m.id)} style={{ padding: '0.4rem 0.8rem', background: 'transparent', border: '1px solid rgba(255,80,80,0.25)', color: 'rgba(255,100,100,0.7)', fontSize: '0.72rem', borderRadius: '2px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', wordBreak: 'break-word', maxWidth: '100%', maxHeight: '12rem', overflowY: 'auto' }}>{m.message}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginTop: '0.6rem' }}>{new Date(m.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
