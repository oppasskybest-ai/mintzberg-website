'use client'
import ResourceManager from '@/components/admin/ResourceManager'

// Résumé is a singleton (one row, slug='resume') but uses the same
// ResourceManager as everything else — technically supports adding more
// site_pages entries too (e.g. a future About page), which is why it's
// list-based rather than a single bespoke form.
export default function AdminResume() {
  return (
    <ResourceManager
      apiPath="site-pages"
      resourceLabel="Page"
      titleField="title"
      emptyRow={{ slug: 'resume', title: 'Résumé', body_html: '' }}
      listSubtitle={(row) => `/${String(row.slug)}`}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'body_html', label: 'Body', type: 'richtext' },
      ]}
    />
  )
}
