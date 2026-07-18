import WelcomeSection from '@/components/home/WelcomeSection'
import IntroBlocks from '@/components/home/IntroBlocks'
import FeaturedBooks from '@/components/home/FeaturedBooks'
import OfInterest from '@/components/home/OfInterest'
import VideosPreview from '@/components/home/VideosPreview'
import StoriesPreview from '@/components/home/StoriesPreview'
import SculpturesPreview from '@/components/home/SculpturesPreview'

// ISR safety net: on-demand revalidation (see lib/admin/revalidate.ts) already
// refreshes this page the moment an admin saves/deletes content, so this is
// just a ceiling on how stale the page could ever get if a revalidate call
// were ever missed — not the primary freshness mechanism.
export const revalidate = 300


// Step 3: Home page, built from html/pages/1.html ("Welcome"). Every
// section of the original present, per Build Order Step 3. No content
// invented (Rule 4).
export default function HomePage() {
  return (
    <main>
      <WelcomeSection />
      <IntroBlocks />
      <FeaturedBooks />
      <OfInterest />
      <VideosPreview />
      <StoriesPreview />
      <SculpturesPreview />
    </main>
  )
}
