'use client'
import ResourceManager from '@/components/admin/ResourceManager'

export default function AdminStories() {
  return (
    <ResourceManager
      apiPath="stories"
      resourceLabel="Story"
      titleField="title"
      emptyRow={{ slug: '', title: '', description: '', pdf_file: '', body_html: '' }}
      listSubtitle={(row) => String(row.pdf_file || (row.body_html ? 'Full text' : ''))}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Short description (one line)', type: 'text' },
        { key: 'pdf_file', label: 'PDF filename or URL (optional if writing full text below)', type: 'text' },
        { key: 'body_html', label: 'Full story text (optional — leave blank if this story is only a PDF download)', type: 'richtext' },
      ]}
    />
  )
}
