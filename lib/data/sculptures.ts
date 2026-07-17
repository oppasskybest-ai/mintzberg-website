import type { SculptureImageItem } from '@/types/content'
import { supabase } from '@/lib/supabase/client'
import { SCULPTURE_IMAGES_SEED } from '@/lib/config/sculpture-images'

export async function getAllSculptureImages(): Promise<SculptureImageItem[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('sculpture_images')
      .select('id, image_url, caption, sort_order')
      .order('sort_order', { ascending: true })
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        imageFile: row.image_url,
        caption: row.caption || '',
        sortOrder: row.sort_order,
      }))
    }
  }
  return SCULPTURE_IMAGES_SEED
}
