'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
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

const DIVIDER: React.CSSProperties = {
  width: '1px',
  alignSelf: 'stretch',
  background: 'rgba(255,255,255,0.1)',
  margin: '0 0.15rem',
}

const TEXT_COLORS = [
  '#ffffff', '#1a1a1a', '#e05c1a', '#1a2e4a', '#2b7a5c', '#b8873a', '#c0553f', '#8a4fbf',
]
const HIGHLIGHT_COLORS = [
  '#fff59d', '#ffcc80', '#a5d6a7', '#90caf9', '#f48fb1', '#ce93d8',
]

export default function RichTextEditor({ content, onChange, token, bucket = 'media' }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [showTextColor, setShowTextColor] = useState(false)
  const [showHighlight, setShowHighlight] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({ inline: false, allowBase64: false }),
      TiptapLink.configure({ openOnClick: false }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Subscript,
      Superscript,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
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
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', padding: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.08)', alignItems: 'center' }}>
        <button type="button" title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} style={TOOLBAR_BTN}>↶</button>
        <button type="button" title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} style={TOOLBAR_BTN}>↷</button>
        <div style={DIVIDER} />

        <select
          title="Paragraph style"
          value={
            editor.isActive('heading', { level: 1 }) ? 'h1' :
            editor.isActive('heading', { level: 2 }) ? 'h2' :
            editor.isActive('heading', { level: 3 }) ? 'h3' :
            'p'
          }
          onChange={(e) => {
            const v = e.target.value
            if (v === 'p') editor.chain().focus().setParagraph().run()
            else editor.chain().focus().toggleHeading({ level: Number(v.replace('h', '')) as 1 | 2 | 3 }).run()
          }}
          style={{ ...TOOLBAR_BTN, cursor: 'pointer', paddingRight: '0.4rem' }}
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <div style={DIVIDER} />

        <button type="button" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} style={editor.isActive('bold') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}><b>B</b></button>
        <button type="button" title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} style={editor.isActive('italic') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}><em>I</em></button>
        <button type="button" title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} style={editor.isActive('underline') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}><u>U</u></button>
        <button type="button" title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} style={editor.isActive('strike') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}><s>S</s></button>
        <button type="button" title="Subscript" onClick={() => editor.chain().focus().toggleSubscript().run()} style={editor.isActive('subscript') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>X₂</button>
        <button type="button" title="Superscript" onClick={() => editor.chain().focus().toggleSuperscript().run()} style={editor.isActive('superscript') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>X²</button>
        <div style={DIVIDER} />

        <div style={{ position: 'relative' }}>
          <button type="button" title="Text color" onClick={() => { setShowTextColor((s) => !s); setShowHighlight(false) }} style={TOOLBAR_BTN}>
            <span style={{ borderBottom: `2px solid ${editor.getAttributes('textStyle').color || '#e05c1a'}` }}>A</span>
          </button>
          {showTextColor && (
            <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 20, display: 'flex', gap: '0.3rem', padding: '0.5rem', background: '#0f1520', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px' }}>
              {TEXT_COLORS.map((c) => (
                <button key={c} type="button" title={c} onClick={() => { editor.chain().focus().setColor(c).run(); setShowTextColor(false) }} style={{ width: '20px', height: '20px', borderRadius: '50%', background: c, border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }} />
              ))}
              <button type="button" title="Remove color" onClick={() => { editor.chain().focus().unsetColor().run(); setShowTextColor(false) }} style={{ ...TOOLBAR_BTN, padding: '0 0.4rem' }}>✕</button>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button type="button" title="Highlight" onClick={() => { setShowHighlight((s) => !s); setShowTextColor(false) }} style={editor.isActive('highlight') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>
            ✎
          </button>
          {showHighlight && (
            <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 20, display: 'flex', gap: '0.3rem', padding: '0.5rem', background: '#0f1520', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px' }}>
              {HIGHLIGHT_COLORS.map((c) => (
                <button key={c} type="button" title={c} onClick={() => { editor.chain().focus().setHighlight({ color: c }).run(); setShowHighlight(false) }} style={{ width: '20px', height: '20px', borderRadius: '50%', background: c, border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }} />
              ))}
              <button type="button" title="Remove highlight" onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowHighlight(false) }} style={{ ...TOOLBAR_BTN, padding: '0 0.4rem' }}>✕</button>
            </div>
          )}
        </div>
        <div style={DIVIDER} />

        <button type="button" title="Align left" onClick={() => editor.chain().focus().setTextAlign('left').run()} style={editor.isActive({ textAlign: 'left' }) ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>⯇</button>
        <button type="button" title="Align center" onClick={() => editor.chain().focus().setTextAlign('center').run()} style={editor.isActive({ textAlign: 'center' }) ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>≡</button>
        <button type="button" title="Align right" onClick={() => editor.chain().focus().setTextAlign('right').run()} style={editor.isActive({ textAlign: 'right' }) ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>⯈</button>
        <button type="button" title="Justify" onClick={() => editor.chain().focus().setTextAlign('justify').run()} style={editor.isActive({ textAlign: 'justify' }) ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>☰</button>
        <div style={DIVIDER} />

        <button type="button" title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} style={editor.isActive('bulletList') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>• List</button>
        <button type="button" title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={editor.isActive('orderedList') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>1. List</button>
        <button type="button" title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} style={editor.isActive('blockquote') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>&ldquo; Quote</button>
        <button type="button" title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} style={editor.isActive('codeBlock') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>{'</>'}</button>
        <button type="button" title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} style={TOOLBAR_BTN}>―</button>
        <div style={DIVIDER} />

        <button
          type="button"
          title="Insert table"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          style={TOOLBAR_BTN}
        >
          ⊞ Table
        </button>
        {editor.isActive('table') && (
          <>
            <button type="button" title="Add column" onClick={() => editor.chain().focus().addColumnAfter().run()} style={TOOLBAR_BTN}>+Col</button>
            <button type="button" title="Add row" onClick={() => editor.chain().focus().addRowAfter().run()} style={TOOLBAR_BTN}>+Row</button>
            <button type="button" title="Delete column" onClick={() => editor.chain().focus().deleteColumn().run()} style={TOOLBAR_BTN}>-Col</button>
            <button type="button" title="Delete row" onClick={() => editor.chain().focus().deleteRow().run()} style={TOOLBAR_BTN}>-Row</button>
            <button type="button" title="Delete table" onClick={() => editor.chain().focus().deleteTable().run()} style={TOOLBAR_BTN}>-Table</button>
          </>
        )}
        <div style={DIVIDER} />

        <button
          type="button"
          title="Link"
          onClick={() => {
            const url = window.prompt('Link URL:')
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }}
          style={editor.isActive('link') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}
        >
          Link
        </button>
        <button type="button" title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()} style={TOOLBAR_BTN}>Unlink</button>
        <button type="button" title="Insert image" onClick={() => fileInputRef.current?.click()} disabled={uploading} style={TOOLBAR_BTN}>
          {uploading ? 'Uploading…' : 'Image'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f) }}
        />
        <div style={DIVIDER} />

        <button
          type="button"
          title="Clear formatting"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          style={TOOLBAR_BTN}
        >
          Clear
        </button>
      </div>
      {uploadError && <p style={{ color: '#e74c3c', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}>{uploadError}</p>}
      <EditorContent editor={editor} />
    </div>
  )
}
