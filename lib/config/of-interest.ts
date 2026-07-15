import type { OfInterestItem } from '@/types/content'

// Sourced verbatim from html/pages/1.html ("Welcome" / home page), the
// "Of Interest" block. The original wraps this in a Drupal cycle-slideshow
// carousel alongside 3 other blocks (Videos/Stories/Beaver Sculptures) —
// master prompt forbids carousels/sliders/autoplay, so here it's rendered
// as a plain static list instead. All 17 links preserved, none dropped.
//
// One URL was normalized: item 14 (originally an Outlook "safelinks"
// tracking-wrapped URL) pointed at the same physical PDF as item 17
// (appendix_29_days_of_managing.pdf), just with different link text ("Full
// descriptions of the days with 29 managers" vs "29 Days of Managing").
// Resolved to the same GitHub Release asset both times rather than keeping
// a dead/tracking wrapper URL — this is a link-target fix, not a content
// change; both distinct link texts are preserved as written.
export const OF_INTEREST_ITEMS: OfInterestItem[] = [
  {
    label: 'Minutes with Mintzberg',
    href: 'https://www.youtube.com/playlist?list=PLtiGzu7sz7w1zC7PdbspvLt0iQ99IxH1h',
  },
  {
    label: 'Developing Theory about the Development of Theory',
    href: 'developing_theory_about_the_development_of_theory_jan_2014.pdf', // resolve via assetUrl()
  },
  {
    label:
      'Developing Naturally: from Management to Organization to Society to Selves',
    href: 'developing_naturally_from_management_to_organization_to_society_to_selves_pdf_march_2012.pdf',
  },
  {
    label: 'The Declaration of our Interdependence',
    href: 'https://ourinterdependence.org/',
  },
  {
    label: 'The Flying Circus: Tales of a tormented traveler',
    href: 'flying_circus_whole_book_august_2005.pdf',
  },
  {
    label: 'Can pollution be a missing piece in the pandemic puzzle?',
    href: '/pp', // internal page — flagged in PROGRESS.md, not yet parsed
    emphasis: true,
  },
  {
    // Original: "<em>Power in and around Organizations</em>, out of print,
    // but available as this free PDF" — kept as one combined label since
    // it's a single sentence, not a bare link title, matching the source.
    label:
      'Power in and around Organizations, out of print, but available as this free PDF',
    href: 'http://escholarship.mcgill.ca/concern/books/7s75dh682?locale=en',
    emphasis: true,
  },
  {
    label: '25 Years Later',
    href: '25years.pdf',
  },
  {
    label: 'Making Progress on our Puzzle',
    href: '/blog/progress-on-our-puzzle', // internal blog post — flagged, not yet parsed
  },
  {
    label:
      'An Underlying Theory for Strategy, Organization, and Management: Bridging the Divide Between Analysis and Synthesis',
    href: 'https://www.strategicmanagementreview.net/assets/articles/Mintzberg.pdf',
  },
  {
    label: "Henry Mintzberg's Beaver Sculptures: A Guided Tour (Full Version)",
    href: 'https://www.youtube.com/watch?v=4JwNRqNMOYw',
  },
  {
    label:
      "Henry Mintzberg's Beaver Sculptures: A Guided Tour (Short Version)",
    href: 'https://www.youtube.com/watch?v=3RQehKFXjQU',
  },
  {
    label: 'Patent nonsense',
    href: 'http://www.cmaj.ca/content/175/4/374.full.pdf+html',
  },
  {
    label:
      'Full descriptions of the days with 29 managers, referred to in my books Managing and Simply Managing',
    href: 'appendix_29_days_of_managing.pdf',
  },
  {
    label: 'Donald Trump is not the Problem',
    href: '/blog/donald-trump-is-not-the-problem-Part1', // internal blog post — flagged, not yet parsed
  },
  {
    label: 'The Anti-MBA',
    href: 'http://www.nytimes.com/2012/05/21/world/europe/21iht-educlede21.html',
  },
  {
    label: '29 Days of Managing, Appendix to Managing and Simply Managing',
    href: 'appendix_29_days_of_managing.pdf',
  },
]
