import Image from 'next/image'
import PageHero from '@/components/layout/PageHero'
import PostBody from '@/components/blog/PostBody'
import { getSitePage } from '@/lib/data/site-pages'
import { RESUME_CV_FILE, RESUME_PORTRAIT_IMAGE } from '@/lib/config/resume'
import { assetUrl } from '@/lib/assets'

export default async function ResumePage() {
  const page = await getSitePage('resume')
  const cvUrl = assetUrl(RESUME_CV_FILE)
  const canoeImg = assetUrl(RESUME_PORTRAIT_IMAGE)

  return (
    <main>
      <PageHero eyebrow="Professor · Author · Outdoorsman" title={page?.title || 'Résumé'} compact />
      <article className="container-content" style={{ padding: '3rem 1.25rem 4rem' }}>
        {cvUrl && (
          <a
            href={cvUrl}
            download
            className="pager-link"
            style={{ display: 'inline-flex', padding: '0 1.25rem', marginBottom: '2rem', textDecoration: 'none' }}
          >
            Download Full CV (PDF)
          </a>
        )}
        {page && <PostBody html={page.bodyHtml} />}
        {canoeImg && (
          <Image
            src={canoeImg}
            alt="Henry Mintzberg canoeing"
            width={640}
            height={420}
            style={{ width: '100%', height: 'auto', borderRadius: '3px', marginTop: '1.5rem' }}
          />
        )}
      </article>
    </main>
  )
}
