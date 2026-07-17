import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllVideos, getVideoBySlug } from '@/lib/data/videos'
import YouTubeFacade from '@/components/media/YouTubeFacade'

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
