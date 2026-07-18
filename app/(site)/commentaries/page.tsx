import PageHero from '@/components/layout/PageHero'
import YearList from '@/components/publications/YearList'
import { getCommentaryYears } from '@/lib/data/publications'

// ISR safety net: on-demand revalidation (see lib/admin/revalidate.ts) already
// refreshes this page the moment an admin saves/deletes content, so this is
// just a ceiling on how stale the page could ever get if a revalidate call
// were ever missed — not the primary freshness mechanism.
export const revalidate = 300


export default async function CommentariesPage() {
  const years = await getCommentaryYears()
  return (
    <main>
      <PageHero eyebrow="Shorter pieces" title="Commentaries" compact />
      <section className="section-parallax" style={{ padding: '3rem 0 4.5rem' }}>
        <div className="container-content">
          <YearList years={years} />
        </div>
      </section>
    </main>
  )
}
