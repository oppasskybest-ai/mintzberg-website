'use client'
import ResourceManager from '@/components/admin/ResourceManager'

export default function AdminBlogPosts() {
  return (
    <ResourceManager
      apiPath="blog-posts"
      resourceLabel="Post"
      titleField="title"
      emptyRow={{ slug: '', title: '', date: '', category_label: '', category_id: '', body_html: '', order_index: null }}
      listSubtitle={(row) => [String(row.date || ''), String(row.category_label || '')].filter(Boolean).join(' · ') || String(row.slug)}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'date', label: 'Date (e.g. "16 July 2026")', type: 'text' },
        { key: 'category_label', label: 'Category', type: 'text' },
        {
          key: 'order_index',
          label: 'Order (lower number shows first)',
          type: 'number',
          helpText: 'Leave blank and this post goes straight to the top of the blog. Type a number to place it anywhere manually — e.g. set two posts to 1 and 2 to pin their order.',
        },
        { key: 'body_html', label: 'Body', type: 'richtext' },
      ]}
    />
  )
}
