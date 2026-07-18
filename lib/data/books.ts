import type { Book } from '@/types/content'
import { supabase } from '@/lib/supabase/client'
import { BOOKS_SEED } from '@/lib/config/books'

export async function getAllBooks(): Promise<Book[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('books')
      .select('slug, title, cover_image, links, body_html, order_index')
      .order('order_index', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        slug: row.slug,
        title: row.title,
        coverImage: row.cover_image,
        links: row.links ?? [],
        bodyHtml: row.body_html,
      }))
    }
  }
  return BOOKS_SEED
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const books = await getAllBooks()
  return books.find((b) => b.slug === slug) ?? null
}
