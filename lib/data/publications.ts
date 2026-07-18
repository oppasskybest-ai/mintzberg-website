import type { PublicationItemRow, PublicationYear } from '@/types/content'
import { supabase } from '@/lib/supabase/client'
import { ARTICLES_SEED } from '@/lib/config/articles'
import { COMMENTARIES_SEED } from '@/lib/config/commentaries'

async function getAllRows(table: 'articles' | 'commentaries', seed: PublicationItemRow[]): Promise<PublicationItemRow[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from(table)
      .select('slug, title, year, body_html, links, order_index')
      .order('order_index', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        slug: row.slug,
        title: row.title ?? null,
        year: row.year,
        bodyHtml: row.body_html,
        links: row.links ?? [],
      }))
    }
  }
  return seed
}

/** Groups flat rows back into the year-grouped shape YearList renders,
 *  sorted newest year first. */
export function groupByYear(rows: PublicationItemRow[]): PublicationYear[] {
  const map = new Map<string, PublicationItemRow[]>()
  for (const row of rows) {
    const year = row.year || 'Undated'
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(row)
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, items]) => ({
      year,
      items: items.map((r) => ({ title: r.title ?? null, text: r.bodyHtml, links: r.links })),
    }))
}

export async function getAllArticles(): Promise<PublicationItemRow[]> {
  return getAllRows('articles', ARTICLES_SEED)
}
export async function getAllCommentaries(): Promise<PublicationItemRow[]> {
  return getAllRows('commentaries', COMMENTARIES_SEED)
}

export async function getArticleYears(): Promise<PublicationYear[]> {
  return groupByYear(await getAllArticles())
}
export async function getCommentaryYears(): Promise<PublicationYear[]> {
  return groupByYear(await getAllCommentaries())
}
