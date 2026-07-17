import Navbar from '@/components/layout/Navbar'

// Wraps every public page (everything under app/(site)/*) with the site
// Navbar. /admin/* is a sibling route tree, outside this group, and never
// sees this Navbar — see the note in app/layout.tsx.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
