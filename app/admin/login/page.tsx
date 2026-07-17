'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('Username and password are required.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Invalid credentials.')
        return
      }
      sessionStorage.setItem('admin_token', data.token)
      const from = searchParams.get('from') || '/admin'
      router.replace(from)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#1a222e',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: '0.85rem',
    borderRadius: '2px',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1219', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ width: '340px', background: '#141b26', border: '1px solid rgba(224,92,26,0.2)', borderRadius: '4px', padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.3rem', color: 'white', marginBottom: '0.25rem' }}>
            Henry Mintzberg
          </p>
          <p style={{ fontSize: '0.62rem', color: 'rgba(224,92,26,0.7)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Admin
          </p>
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem' }}>
            Username
          </label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} autoComplete="username" style={inputStyle} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem' }}>
            Password
          </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} autoComplete="current-password" style={inputStyle} />
        </div>

        {error && <p style={{ color: '#e74c3c', fontSize: '0.78rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '0.8rem',
            background: loading ? 'rgba(224,92,26,0.6)' : '#e05c1a',
            color: 'white', border: 'none', fontSize: '0.7rem',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            fontFamily: '"Inter", sans-serif',
            cursor: loading ? 'not-allowed' : 'pointer',
            borderRadius: '2px', transition: 'background 0.2s ease',
          }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0d1219' }} />}>
      <LoginForm />
    </Suspense>
  )
}
