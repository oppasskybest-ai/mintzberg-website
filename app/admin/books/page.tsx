'use client'
import ResourceManager from '@/components/admin/ResourceManager'

export default function AdminBooks() {
  return (
    <ResourceManager
      apiPath="books"
      resourceLabel="Book"
      titleField="title"
      emptyRow={{ slug: '', title: '', cover_image: '', links: [], body_html: '', order_index: null }}
      listSubtitle={() => 'Book'}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        {
          key: 'order_index',
          label: 'Order (lower number shows first)',
          type: 'number',
          helpText: 'Leave blank and this book goes to the top of the Books page and, if in the top 3, the home page. Type a number to place it manually.',
        },
        { key: 'cover_image', label: 'Cover Image', type: 'image' },
        { key: 'links', label: 'Purchase / Download Links', type: 'linklist' },
        { key: 'body_html', label: 'Description', type: 'richtext' },
      ]}
    />
  )
}
