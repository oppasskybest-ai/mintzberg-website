'use client'
import { useEffect, useCallback } from 'react'

export default function Modal({
  open, onClose, title, maxWidth = '640px', children,
}: { open: boolean; onClose: () => void; title?: string; maxWidth?: string; children: React.ReactNode }) {
  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }, [onClose])

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, handleKey])

  if (!open) return null

  return (
    <div
      role="dialog" aria-modal="true" aria-label={title}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{ background: '#141b26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', width: '100%', maxWidth, maxHeight: '90vh', overflow: 'auto', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: title ? '1.5rem' : 0 }}>
          {title && <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', color: 'white', fontWeight: 400 }}>{title}</h2>}
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', cursor: 'pointer', marginLeft: 'auto', lineHeight: 1, padding: '0.2rem' }}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
