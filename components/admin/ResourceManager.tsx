'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAdmin } from '@/app/admin/layout'
import { useAuthFetch } from '@/lib/hooks/useAuthFetch'
import Modal from '@/components/ui/Modal'
import ImageUpload from '@/components/admin/ImageUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'

export type FieldConfig =
  | { key: string; label: string; type: 'text' }
  | { key: string; label: string; type: 'richtext' }
  | { key: string; label: string; type: 'image' }
  | { key: string; label: string; type: 'linklist' } // array of { label, href }

export interface ResourceRow {
  [key: string]: unknown
}

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.85rem', background: '#1a222e',
  border: '1px solid rgba(255,255,255,0.1)', color: 'white',
  fontSize: '0.83rem', borderRadius: '2px', outline: 'none', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.62rem', color: 'rgba(224,92,26,0.7)',
  letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem',
}

// Generic CRUD manager: list + create/edit modal + delete, wired to
// /api/admin/{apiPath}. Same underlying behavior as duff-site's per-
// resource admin pages (load/save/delete via useAuthFetch, toast
// notifications, Modal-based edit form) but parameterized by a field
// config instead of one bespoke file per resource — same logic, less
// duplication across our 3 content types.
export default function ResourceManager({
  apiPath,
  titleField = 'title',
  idField = 'slug',
  emptyRow,
  fields,
  resourceLabel,
  listSubtitle,
  autoSlug = true,
  renderTitle,
}: {
  apiPath: string
  titleField?: string
  idField?: string
  emptyRow: Record<string, unknown>
  fields: FieldConfig[]
  resourceLabel: string
  listSubtitle: (row: ResourceRow) => string
  autoSlug?: boolean
  renderTitle?: (row: ResourceRow) => string
}) {
  const { token } = useAdmin()
  const authFetch = useAuthFetch()

  const [rows, setRows] = useState<ResourceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authFetch(`/api/admin/${apiPath}`)
      if (!res.ok) { setLoading(false); return }
      const data = await res.json()
      setRows(Array.isArray(data) ? data : [])
    } catch {
      showToast(`Could not load ${resourceLabel.toLowerCase()}.`)
    }
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authFetch, apiPath])

  useEffect(() => { load() }, [load])

  const openNew = () => { setEditing({ ...emptyRow }); setIsNew(true) }
  const openEdit = (row: ResourceRow) => { setEditing({ ...row }); setIsNew(false) }

  const save = async () => {
    if (!editing) return
    setSaving(true)
    let idValue = String(editing[idField] || '').trim()
    if (!idValue && autoSlug) {
      idValue = String(editing[titleField] || '').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim()
    }
    const payload = autoSlug ? { ...editing, [idField]: idValue } : { ...editing }
    const url = isNew ? `/api/admin/${apiPath}` : `/api/admin/${apiPath}/${encodeURIComponent(idValue)}`
    const method = isNew ? 'POST' : 'PUT'
    try {
      const res = await authFetch(url, { method, body: JSON.stringify(payload) })
      const d = await res.json()
      if (res.ok) {
        setEditing(null)
        load()
        showToast(isNew ? `${resourceLabel} created.` : `${resourceLabel} saved.`)
      } else {
        showToast(d.error || 'Save failed.')
      }
    } catch {
      showToast('Save failed.')
    }
    setSaving(false)
  }

  const del = async (id: string, label: string) => {
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return
    try {
      await authFetch(`/api/admin/${apiPath}/${encodeURIComponent(id)}`, { method: 'DELETE' })
      showToast(`${resourceLabel} deleted.`)
      load()
    } catch {
      showToast('Delete failed.')
    }
  }

  const setField = (key: string, value: unknown) => {
    setEditing((v) => ({ ...v, [key]: value }))
  }

  const addLink = (key: string) => {
    setEditing((v) => ({ ...v, [key]: [...((v?.[key] as { label: string; href: string }[]) || []), { label: '', href: '' }] }))
  }
  const updateLink = (key: string, i: number, field: 'label' | 'href', value: string) => {
    setEditing((v) => {
      const links = [...((v?.[key] as { label: string; href: string }[]) || [])]
      links[i] = { ...links[i], [field]: value }
      return { ...v, [key]: links }
    })
  }
  const removeLink = (key: string, i: number) => {
    setEditing((v) => ({ ...v, [key]: ((v?.[key] as { label: string; href: string }[]) || []).filter((_, idx) => idx !== i) }))
  }

  return (
    <div style={{ padding: '2.5rem' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', background: '#e05c1a', color: 'white', padding: '0.85rem 1.5rem', zIndex: 600, fontSize: '0.85rem', borderRadius: '2px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: 'white', fontWeight: 400, marginBottom: '0.4rem' }}>
            {resourceLabel}s
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>{rows.length} total</p>
        </div>
        <button
          onClick={openNew}
          style={{ padding: '0.7rem 1.4rem', background: '#e05c1a', color: 'white', border: 'none', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer' }}
        >
          + New {resourceLabel}
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading…</p>
      ) : rows.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>
          No {resourceLabel.toLowerCase()}s in the database yet — use Settings → Run Seed to import the parsed content.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {rows.map((row) => (
            <div
              key={String(row[idField])}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: '#141b26', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px' }}
            >
              <div>
                <p style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{renderTitle ? renderTitle(row) : String(row[titleField] ?? row[idField])}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{listSubtitle(row)}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openEdit(row)} style={{ padding: '0.45rem 0.9rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', borderRadius: '2px', cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => del(String(row[idField]), renderTitle ? renderTitle(row) : String(row[titleField] ?? row[idField]))} style={{ padding: '0.45rem 0.9rem', background: 'transparent', border: '1px solid rgba(255,80,80,0.25)', color: 'rgba(255,100,100,0.7)', fontSize: '0.72rem', borderRadius: '2px', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? `New ${resourceLabel}` : `Edit ${resourceLabel}`} maxWidth="720px">
        {editing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {autoSlug && (
              <div>
                <label style={labelStyle}>Slug (URL path — leave blank to auto-generate from title)</label>
                <input style={fieldStyle} value={String(editing[idField] ?? '')} onChange={(e) => setField(idField, e.target.value)} />
              </div>
            )}

            {fields.map((f) => {
              if (f.type === 'text') {
                return (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input style={fieldStyle} value={String(editing[f.key] ?? '')} onChange={(e) => setField(f.key, e.target.value)} />
                  </div>
                )
              }
              if (f.type === 'image') {
                return (
                  <ImageUpload key={f.key} label={f.label} value={String(editing[f.key] ?? '')} onChange={(url) => setField(f.key, url)} token={token} />
                )
              }
              if (f.type === 'richtext') {
                return (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <RichTextEditor content={String(editing[f.key] ?? '')} onChange={(html) => setField(f.key, html)} token={token} />
                  </div>
                )
              }
              if (f.type === 'linklist') {
                const links = (editing[f.key] as { label: string; href: string }[]) || []
                return (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    {links.map((link, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input style={fieldStyle} placeholder="Label" value={link.label} onChange={(e) => updateLink(f.key, i, 'label', e.target.value)} />
                        <input style={fieldStyle} placeholder="URL" value={link.href} onChange={(e) => updateLink(f.key, i, 'href', e.target.value)} />
                        <button type="button" onClick={() => removeLink(f.key, i)} style={{ padding: '0 0.75rem', background: 'transparent', border: '1px solid rgba(255,80,80,0.25)', color: 'rgba(255,100,100,0.7)', borderRadius: '2px', cursor: 'pointer' }}>✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addLink(f.key)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(224,92,26,0.1)', border: '1px solid rgba(224,92,26,0.25)', color: 'rgba(224,92,26,0.85)', fontSize: '0.75rem', borderRadius: '2px', cursor: 'pointer' }}>
                      + Add link
                    </button>
                  </div>
                )
              }
              return null
            })}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                onClick={save}
                disabled={saving}
                style={{ padding: '0.7rem 1.5rem', background: '#e05c1a', color: 'white', border: 'none', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', borderRadius: '2px', cursor: saving ? 'not-allowed' : 'pointer' }}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => setEditing(null)} style={{ padding: '0.7rem 1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', borderRadius: '2px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
