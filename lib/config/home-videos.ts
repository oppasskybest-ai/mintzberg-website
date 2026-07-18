import type { HomeVideo } from '@/types/content'

// DEPRECATED 2026-07-18: components/home/VideosPreview.tsx now pulls the
// first 2 videos live from Supabase (ordered) instead of this hardcoded
// list. Kept here for reference only — nothing imports this anymore.

export const HOME_VIDEOS: HomeVideo[] = [
  {
    title: "Henry Mintzberg's Beaver Sculptures: A Guided Tour (Full Version)",
    youtubeId: '4JwNRqNMOYw',
    href: '/videos/henry-mintzbergs-beaver-sculptures-a-guided-tour-full-version',
  },
  {
    title: 'Biographical video (OVER 1,000,000 TOTAL WEB VIEWS)',
    youtubeId: 'K7My9mZUUVs',
    href: '/videos/biographical-video',
  },
]
