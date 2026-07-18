import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllVideos, getVideoBySlug } from '@/lib/data/videos'
import YouTubeFacade from '@/components/media/YouTubeFacade'

// ISR safety net: on-demand revalidation (see lib/admin/revalidate.ts) already
// refreshes this page the moment an admin saves/deletes content, so this is
// just a ceiling on how stale the page could ever get if a revalidate call
// were ever missed — not the primary freshness mechanism.
export const revalidate = 300
export const dynamicParams = true // new slugs render on-demand, not just at build time


export async function generateStaticParams() {
  const videos = await getAllVideos()
  return videos.map((v) => ({ slug: v.slug }))
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const video = await getVideoBySlug(slug)
  if (!video) notFound()

  return (
    <main className="container-content" style={{ padding: '3rem 1.25rem 4rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>{video.title}</h1>
      <YouTubeFacade videoId={video.youtubeId} title={video.title ?? ''} />
      <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--rule)' }}>
        <Link href="/videos">← Back to Videos</Link>
      </div>
    </main>
  )
}
