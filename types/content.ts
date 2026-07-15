export interface FeaturedBook {
  title: string
  slug: string
  coverImage: string // bare filename, resolved via lib/assets.ts assetUrl()
  links: { label: string; href: string }[]
}

export interface OfInterestItem {
  label: string
  href: string
  emphasis?: boolean // rendered in <strong>/<em> in the original
}

export interface HomeVideo {
  title: string
  youtubeId: string
  href: string
}

export interface BlogPost {
  slug: string
  title: string | null
  date: string | null
  categoryLabel: string | null
  categoryId: string | null
  imageRefs: string[]
  /** Full body HTML, verbatim from the source (Rule 1). Image src values
   *  are tokenized as {{ASSET}}filename{{/ASSET}} — resolved at render
   *  time, not baked in, so re-hosting assets never requires re-parsing. */
  bodyHtml: string
}

export interface BlogCategory {
  id: string
  label: string
}
