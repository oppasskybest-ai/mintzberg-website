'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import { useRef, useState } from 'react'

interface Props {
  content: string
  onChange: (html: string) => void
  token: string
  bucket?: string
}

const TOOLBAR_BTN: React.CSSProperties = {
  padding: '0.35rem 0.65rem',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.7)',
  fontSize: '0.78rem',
  cursor: 'pointer',
  borderRadius: '2px',
  lineHeight: 1,
}

const TOOLBAR_BTN_ACTIVE: React.CSSProperties = {
  ...TOOLBAR_BTN,
  background: 'rgba(224,92,26,0.22)',
  border: '1px solid rgba(224,92,26,0.4)',
  color: '#e8a878',
}

export default function RichTextEditor({ content, onChange, token, bucket = 'media' }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({ inline: false, allowBase64: false }),
      TiptapLink.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        style: [
          'min-height: 320px',
          'padding: 1.25rem 1.5rem',
          'outline: none',
          'color: rgba(255,255,255,0.85)',
          'font-size: 0.95rem',
          'line-height: 1.8',
        ].join(';'),
      },
    },
    immediatelyRender: false,
  })

  const uploadImage = async (file: File) => {
    setUploadError('')
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
      if (!res.ok) {
        setUploadError(data.error || 'Upload failed.')
      } else {
        editor?.chain().focus().setImage({ src: data.url }).run()
      }
    } catch {
      setUploadError('Upload failed.')
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (!editor) return null

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px', background: '#1a222e' }}>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', padding: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={editor.isActive('bold') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={editor.isActive('italic') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}><em>I</em></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={editor.isActive('heading', { level: 2 }) ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={editor.isActive('bulletList') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>• List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} style={editor.isActive('blockquote') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>&ldquo; Quote</button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Link URL:')
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }}
          style={TOOLBAR_BTN}
        >
          Link
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} style={TOOLBAR_BTN}>
          {uploading ? 'Uploading…' : 'Image'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f) }}
        />
      </div>
      {uploadError && <p style={{ color: '#e74c3c', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}>{uploadError}</p>}
      <EditorContent editor={editor} />
    </div>
  )
}
