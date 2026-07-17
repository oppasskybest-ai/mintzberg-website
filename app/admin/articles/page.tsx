'use client'
import ResourceManager from '@/components/admin/ResourceManager'

export default function AdminArticles() {
  return (
    <ResourceManager
      apiPath="articles"
      resourceLabel="Article"
      idField="slug"
      autoSlug={true}
      emptyRow={{ slug: '', year: '', body_html: '', links: [] }}
      renderTitle={(row) => {
        const text = String(row.body_html || '').replace(/<[^>]+>/g, '')
        return text.length > 90 ? text.slice(0, 90) + '…' : text || 'Untitled'
      }}
      listSubtitle={(row) => String(row.year || 'Undated')}
      fields={[
        { key: 'year', label: 'Year', type: 'text' },
        { key: 'body_html', label: 'Description', type: 'richtext' },
        { key: 'links', label: 'Links', type: 'linklist' },
      ]}
    />
  )
}
