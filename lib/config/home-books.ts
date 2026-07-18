import type { FeaturedBook } from '@/types/content'

// DEPRECATED 2026-07-18: components/home/FeaturedBooks.tsx now pulls the
// first 3 books live from Supabase (ordered) instead of this hardcoded
// list, so a newly-added book actually shows up on the home page. Kept
// here for reference only — nothing imports this anymore.
//
// The three "Bedtime Stories for Managers" sidebar block books on the home
// page, sourced verbatim from html/pages/1.html.
export const HOME_FEATURED_BOOKS: FeaturedBook[] = [
  {
    title: 'Rebalancing Society',
    slug: 'rebalancing-society',
    coverImage: 'rebalancing.png',
    links: [
      {
        label: 'Berrett-Koehler',
        href: 'http://www.bkconnection.com/ProdDetails.asp?ID=9781626563179',
      },
      {
        label: 'Amazon.com',
        href: 'http://www.amazon.com/Rebalancing-Society-Radical-Renewal-Beyond/dp/1626563179',
      },
      { label: 'SEE UPDATE: RebalancingSociety.org', href: 'https://rebalancingsociety.org/' },
      {
        label: 'EXPLAINED in Skating for Balance',
        href: 'https://www.youtube.com/watch?v=xe8oxmcdq6w',
      },
      { label: 'DOWNLOAD as a FREE PDF', href: 'rebalancing_full.pdf' },
    ],
  },
  {
    title: 'Understanding Organizations…Finally! Structure in Sevens',
    slug: 'understanding-organizationsfinally-structure-in-sevens',
    coverImage: '61livwsk9hl._sl1500_.jpg',
    links: [
      {
        label: 'Berrett-Koehler',
        href: 'https://www.bkconnection.com/books/title/Understanding-OrganizationsFinally',
      },
      {
        label: 'Amazon.com',
        href: 'https://www.amazon.com/Understanding-Organizations-Finally-Structure-Sevens/dp/1523000058/ref=sr_1_1?dib=eyJ2IjoiMSJ9.PK4UnuUx8zmG7VbNmER5LYJ03DGYJA4gUEMdZXR6HpZi8wg7S3JmyH_tMbi-dwRjpZVvGHQBUThNl7_08Fcg4JUdYeYxY31hs-0UgKvwn-r9N6W6BcwM1M6ajKnfcW-LI-s0tbRay',
      },
      {
        label: 'READ the back cover',
        href: '/books/understanding-organizationsfinally-structure-in-sevens',
      },
    ],
  },
  {
    title: 'Bedtime Stories for Managers',
    slug: 'bedtime-stories-for-managers',
    coverImage: 'bedtime-stories.jpg',
    links: [
      {
        label: 'Amazon.com',
        href: 'https://www.amazon.com/Bedtime-Stories-Managers-Leadership-Management/dp/1523098783',
      },
      {
        label: 'Berrett-Koehler',
        href: 'https://www.bkconnection.com/books/title/Bedtime-Stories-for-Managers',
      },
    ],
  },
]
