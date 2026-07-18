'use client'
import ResourceManager from '@/components/admin/ResourceManager'

export default function AdminVideos() {
  return (
    <ResourceManager
      apiPath="videos"
      resourceLabel="Video"
      titleField="title"
      emptyRow={{ slug: '', title: '', youtube_id: '', order_index: null }}
      listSubtitle={(row) => `YouTube: ${String(row.youtube_id)}`}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'youtube_id', label: 'YouTube Video ID (e.g. "4JwNRqNMOYw")', type: 'text' },
        {
          key: 'order_index',
          label: 'Order (lower number shows first)',
          type: 'number',
          helpText: 'Leave blank and this video goes to the top of the Videos page and, if in the top 2, the home page. Type a number to place it manually.',
        },
      ]}
    />
  )
}
