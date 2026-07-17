'use client'
import ResourceManager from '@/components/admin/ResourceManager'

export default function AdminSculptures() {
  return (
    <ResourceManager
      apiPath="sculpture-images"
      resourceLabel="Sculpture Image"
      idField="id"
      autoSlug={false}
      titleField="caption"
      emptyRow={{ image_url: '', caption: '', sort_order: 0 }}
      renderTitle={(row) => String(row.caption || row.image_url || 'Untitled')}
      listSubtitle={(row) => `Order: ${String(row.sort_order ?? 0)}`}
      fields={[
        { key: 'image_url', label: 'Image', type: 'image' },
        { key: 'caption', label: 'Caption (optional)', type: 'text' },
        { key: 'sort_order', label: 'Sort order (lower = first)', type: 'text' },
      ]}
    />
  )
}
