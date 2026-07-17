import type { StoryItem } from '@/types/content'
import { supabase } from '@/lib/supabase/client'
import { STORIES_SEED } from '@/lib/config/stories'

export async function getAllStories(): Promise<StoryItem[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('stories')
      .select('slug, title, description, pdf_file, body_html')
      .order('created_at', { ascending: true })
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        slug: row.slug,
        title: row.title,
        description: row.description,
        pdfFile: row.pdf_file,
        bodyHtml: row.body_html || '',
      }))
    }
  }
  return STORIES_SEED
}
