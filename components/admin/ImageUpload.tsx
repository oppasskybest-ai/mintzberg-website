'use client'
import { useRef, useState } from 'react'

export default function ImageUpload({
  value, onChange, bucket = 'media', label = 'Image', token,
}: { value: string; onChange: (url: string) => void; bucket?: string; label?: string; token: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    setError('')
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('bucket', bucket)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Upload failed.')
      else onChange(data.url)
    } catch {
      setError('Upload failed. Please try again.')
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.62rem', color: 'rgba(224,92,26,0.7)',
    letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem',
  }

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '2px', marginBottom: '0.6rem', border: '1px solid rgba(255,255,255,0.1)' }} />
      )}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL, or upload a file"
          style={{ flex: 1, padding: '0.6rem 0.85rem', background: '#1a222e', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.83rem', borderRadius: '2px', outline: 'none' }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{ padding: '0.6rem 1rem', background: 'rgba(224,92,26,0.12)', border: '1px solid rgba(224,92,26,0.3)', color: 'rgba(224,92,26,0.9)', fontSize: '0.78rem', borderRadius: '2px', cursor: uploading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
        >
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
      {error && <p style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '0.4rem' }}>{error}</p>}
    </div>
  )
}
