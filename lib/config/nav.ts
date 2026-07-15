// Nav items, sourced from the actual scraped menu (every html/*.html file's
// <div id="block-system-main-menu">), merged with mintzberg-master-prompt.md's
// Navigation section which additionally requires an "About" entry.
//
// DECISION FLAGGED (Rule 3 — significant decision, stated here rather than
// silently picked): the real site nav uses "Résumé + CV" where the master
// prompt's nav list says "About." Both point at the same content (Henry's
// bio/CV per Content Structure section 9), so "Résumé + CV" is kept as the
// label since it's more specific and is Henry's own wording — flag this in
// PROGRESS.md for confirmation, easy to relabel later.
//
// "Search" and "Beaver sculptures" exist on the real site but not in the
// master prompt's nav list — kept, since Content Structure section 8
// (Beaver Sculptures) and section 13 (Search) both require these to exist
// somewhere, and top nav is the obvious place.
//
// "Rebalancing Society" REMOVED 2026-07-15 — explicitly ruled out of scope,
// separate project. See master prompt Content Structure section 11.
export interface NavItem {
  label: string
  href: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Books', href: '/books' },
  { label: 'Blog', href: '/blog' },
  { label: 'Articles', href: '/articles' },
  { label: 'Commentaries', href: '/commentaries' },
  { label: 'Videos', href: '/videos' },
  { label: 'Stories', href: '/stories' },
  { label: 'Beaver Sculptures', href: '/sculptures' },
  { label: 'Résumé + CV', href: '/resume' },
  { label: 'Contact', href: '/contact' },
]
