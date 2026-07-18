'use client'
import ResourceManager from '@/components/admin/ResourceManager'

export default function AdminCommentaries() {
  return (
    <ResourceManager
      apiPath="commentaries"
      resourceLabel="Commentary"
      idField="slug"
      titleField="title"
      autoSlug={true}
      emptyRow={{ slug: '', title: '', year: '', body_html: '', links: [], order_index: null }}
      renderTitle={(row) => {
        if (row.title) return String(row.title)
        const text = String(row.body_html || '').replace(/<[^>]+>/g, '')
        return text.length > 90 ? text.slice(0, 90) + '…' : text || 'Untitled'
      }}
      listSubtitle={(row) => String(row.year || 'Undated')}
      fields={[
        { key: 'title', label: 'Title (used to generate the URL — required for new commentaries)', type: 'text' },
        { key: 'year', label: 'Year', type: 'text' },
        {
          key: 'order_index',
          label: 'Order (lower number shows first within its year)',
          type: 'number',
          helpText: 'Leave blank and this commentary goes to the top of its year group. Type a number to place it manually.',
        },
        { key: 'body_html', label: 'Description', type: 'richtext' },
        { key: 'links', label: 'Links', type: 'linklist' },
      ]}
    />
  )
}
