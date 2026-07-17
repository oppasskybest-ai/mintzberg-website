import PageHero from '@/components/layout/PageHero'
import YearList from '@/components/publications/YearList'
import { getArticleYears } from '@/lib/data/publications'

export default async function ArticlesPage() {
  const years = await getArticleYears()
  return (
    <main>
      <PageHero eyebrow="184 articles" title="Articles" compact />
      <section className="section-parallax" style={{ padding: '3rem 0 4.5rem' }}>
        <div className="container-content">
          <YearList years={years} />
        </div>
      </section>
    </main>
  )
}
