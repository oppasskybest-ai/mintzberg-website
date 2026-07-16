// From sorted-assets/html/pages/stories.html (the dedicated Stories page).
//
// FLAGGED, NOT SILENTLY RECONCILED: the home page's own "Stories" block
// (a different Drupal block, block-nodeblock-177) lists a different 5th
// story — "Depressing is Hardly the Word" — where this dedicated page
// lists "Getting Lenny married" instead. Both are genuine scraped content;
// this is an inconsistency in the original site itself (the two blocks
// were evidently updated at different times), not a parsing error. This
// file (the dedicated page) is used as the authoritative full /stories
// listing; the home page preview keeps its own original content
// unchanged, per Rule 1 — neither was invented or altered to match the
// other. Worth asking which one Henry considers current.
export const STORIES_INTRO =
  "I like to write short stories—not fiction, but based on personal experiences. I have done about thirty in all. I would like to publish them one day, under the title Reflections from the Window. Five are included here; the first explains the title:"

export const STORIES: { title: string; file: string; description: string }[] = [
  {
    title: 'Reflecting On Doors',
    file: 'reflecting_on_doors_dec_2015.pdf',
    description: 'Is it fair for a mirror person to criticize a window person, at least for missing the reflection?',
  },
  {
    title: "Gopi's Farm",
    file: 'stories_gopis_farm_march_2014.pdf',
    description: 'On this sustainable farm, Gopi grows more than coconuts.',
  },
  {
    title: 'For the Love of the Lake',
    file: 'love_of_the_lake_january_2016.pdf',
    description: 'Doing more than everything imaginable on a mirror of great glee.',
  },
  {
    title: 'Why I Climb Mountains Anyway',
    file: 'mountains_17_july_2015.pdf',
    description: 'Let me recount the ways.',
  },
  {
    title: 'Getting Lenny married',
    file: 'getting_lenny_married.pdf',
    description: 'His exuberant wedding in the Alps',
  },
]
