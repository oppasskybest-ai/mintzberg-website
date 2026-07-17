'use client'
import ResourceManager from '@/components/admin/ResourceManager'

export default function AdminBooks() {
  return (
    <ResourceManager
      apiPath="books"
      resourceLabel="Book"
      titleField="title"
      emptyRow={{ slug: '', title: '', cover_image: '', links: [], body_html: '' }}
      listSubtitle={() => 'Book'}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'cover_image', label: 'Cover Image', type: 'image' },
        { key: 'links', label: 'Purchase / Download Links', type: 'linklist' },
        { key: 'body_html', label: 'Description', type: 'richtext' },
      ]}
    />
  )
}
