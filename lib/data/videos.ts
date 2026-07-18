import type { VideoItem } from '@/types/content'
import { supabase } from '@/lib/supabase/client'
import { VIDEOS_SEED } from '@/lib/config/videos'

export async function getAllVideos(): Promise<VideoItem[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('videos')
      .select('slug, title, youtube_id, order_index')
      .order('order_index', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
    if (!error && data && data.length > 0) {
      return data.map((row) => ({ slug: row.slug, title: row.title, youtubeId: row.youtube_id }))
    }
  }
  return VIDEOS_SEED
}

export async function getVideoBySlug(slug: string): Promise<VideoItem | null> {
  const videos = await getAllVideos()
  return videos.find((v) => v.slug === slug) ?? null
}
