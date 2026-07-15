import type { BlogPost } from '@/types/content'
import { supabase } from '@/lib/supabase/client'
import { BLOG_POSTS_SEED } from '@/lib/config/blog-posts'

// Mirrors duff-site's lib/data/*.ts pattern: try Supabase first, fall back
// to the static seed array if the table is empty or unreachable (e.g. no
// Supabase project configured yet locally). Once the `blog_posts` table is
// populated (via the admin dashboard, seeded from the full 231-post parse),
// this becomes the live source; until then the 10-post test batch works
// standalone with zero Supabase setup required.
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title, date, category_label, category_id, image_refs, body_html')
      .order('date', { ascending: false })

    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        slug: row.slug,
        title: row.title,
        date: row.date,
        categoryLabel: row.category_label,
        categoryId: row.category_id,
        imageRefs: row.image_refs ?? [],
        bodyHtml: row.body_html,
      }))
    }
  }
  return BLOG_POSTS_SEED
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts()
  return posts.find((p) => p.slug === slug) ?? null
}
