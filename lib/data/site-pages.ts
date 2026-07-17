import type { SitePage } from '@/types/content'
import { supabase } from '@/lib/supabase/client'
import { RESUME_BODY_HTML } from '@/lib/config/resume'

const RESUME_FALLBACK: SitePage = { slug: 'resume', title: 'Résumé', bodyHtml: RESUME_BODY_HTML }

export async function getSitePage(slug: string): Promise<SitePage | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from('site_pages')
      .select('slug, title, body_html')
      .eq('slug', slug)
      .maybeSingle()
    if (!error && data) {
      return { slug: data.slug, title: data.title, bodyHtml: data.body_html }
    }
  }
  if (slug === 'resume') return RESUME_FALLBACK
  return null
}
