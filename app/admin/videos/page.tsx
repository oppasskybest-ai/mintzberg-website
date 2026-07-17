'use client'
import ResourceManager from '@/components/admin/ResourceManager'

export default function AdminVideos() {
  return (
    <ResourceManager
      apiPath="videos"
      resourceLabel="Video"
      titleField="title"
      emptyRow={{ slug: '', title: '', youtube_id: '' }}
      listSubtitle={(row) => `YouTube: ${row.youtube_id}`}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'youtube_id', label: 'YouTube Video ID (e.g. "4JwNRqNMOYw")', type: 'text' },
      ]}
    />
  )
}
