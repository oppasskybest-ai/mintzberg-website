'use client'
import ResourceManager from '@/components/admin/ResourceManager'

export default function AdminBlogPosts() {
  return (
    <ResourceManager
      apiPath="blog-posts"
      resourceLabel="Post"
      titleField="title"
      emptyRow={{ slug: '', title: '', date: '', category_label: '', category_id: '', body_html: '' }}
      listSubtitle={(row) => [row.date, row.category_label].filter(Boolean).join(' · ') || row.slug}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'date', label: 'Date (e.g. "16 July 2026")', type: 'text' },
        { key: 'category_label', label: 'Category', type: 'text' },
        { key: 'body_html', label: 'Body', type: 'richtext' },
      ]}
    />
  )
}
