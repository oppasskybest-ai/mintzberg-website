# PROGRESS.md — Henry Mintzberg Website
## Read this file at the start of every session, alongside mintzberg-master-prompt.md
## and mintzberg-addendum-final.md, before writing any code.

Rules this file follows:
- Master prompt (design/content rules) is unchanging and always wins over any
  base-code style borrowed from other projects.
- Every session ends with a new block appended below — what was built, what
  files were touched, what's still open, and the exact resume point.
- The "HTML FILES PROCESSED LOG" section is the source of truth for which
  sorted-assets/html/ files have been parsed already. Check it before parsing
  anything. Partial entries must say exactly what's missing.

---

# ⭐ CURRENT STATUS — AT A GLANCE

**Architecture decided:** Supabase + full admin CRUD dashboard (like the
duff-site base code), NOT the static JSON/MDX approach originally sketched in
the master prompt's Technical Stack section. This supersedes that one section
only — everything else in the master prompt (content rules, design direction,
build order) is unchanged. Henry will be able to edit blog posts, books,
articles, commentaries, etc. live from a private dashboard without a
redeploy, same pattern as duff-site: Supabase table with a static seed-array
fallback in `lib/config/*.ts` if the DB is empty/unreachable.

**Asset hosting:** GitHub Releases only, on `oppasskybest-ai/mintzberg-website`
(same repo as the code). See mintzberg-addendum-final.md for the full URL
pattern and the release_upload_log.csv reference. No Cloudinary.

**Where we are:** Steps 1–4 substantially complete. All 231 real blog posts
parsed, cleaned (inline Word-paste styles stripped), and live in
`lib/config/blog-posts.ts` — no longer just a 10-post test batch. Blog index
is paginated at 10 posts/page (`/blog?page=N`), not the old site's
load-everything pattern. Premium design system (fixed-parallax hero/section
backgrounds, navy/orange palette) is now the standard for every page going
forward. Rebalancing Society removed from scope entirely per explicit
2026-07-15 decision. `mintzberg-master-prompt.md` and
`mintzberg-addendum-final.md` now live in the repo root, version-controlled.

**Important correction to the master prompt's blog count:** the master
prompt says 254 blog HTML files / 254 posts. The actual `sorted-assets/html/blog/`
folder sent (252 files) breaks down as:
- **231 real individual posts** (have the `ds single post` marker)
- **20 category-listing pages** (Drupal views, e.g. `10.html` = "Blog:
  Learning Strategy" — not content, just an index; their id→label mapping
  is captured in `lib/config/blog-categories.ts` for category filtering)
- **1 infra page** (`subscribe.html` — MailChimp signup block, not a post)

So the real individual-post count is 231, not 254. The remaining ~23 may be
missing from this HTML export, or the master prompt's original count
included the listing pages. Flagging this rather than silently reconciling
it — worth a quick confirmation whenever convenient, doesn't block
anything.

Also found in `html/blog/`: 3 dead-scrape artifacts (`enterprise.html`,
`what-else-might-be-going-on.html`, `=.html`) — these are 404/Access-Denied
pages the scraper picked up, not real content. Marked SKIPPED below.

`html/pages/` (354 files: books, articles, commentaries, resume, contact,
rebalancing society, videos, stories, sculptures, and more) has **not been
classified or parsed yet** — only `pages/1.html` (home page) has been read,
for Step 3.

---

## WHAT HAS BEEN BUILT

---

STEP COMPLETED: Step 1 — Project Setup
DATE: 2026-07-15
WHAT WAS BUILT: Next.js 16 App Router scaffold, Tailwind v4 (CSS-based
  @theme, no tailwind.config.js needed), Google Fonts (Playfair Display +
  Inter), global design tokens matching mintzberg-master-prompt.md's Design
  Direction section exactly (navy #1a2e4a, paper #fafaf8, orange #e05c1a,
  ink #1a1a1a, 720px content container, 17px/1.7 body text), root layout
  component (no nav/content — that's Step 2/3), placeholder home page so the
  project is runnable.
FILES CREATED OR MODIFIED:
  - package.json
  - tsconfig.json
  - postcss.config.js
  - next.config.js (image remotePatterns for github.com release assets +
    Supabase + img.youtube.com for the video facade thumbnails)
  - .gitignore
  - .env.local.example
  - app/globals.css
  - app/layout.tsx
  - app/page.tsx (placeholder only)
ARCHITECTURE BORROWED FROM DUFF-SITE (logic only, not visual style):
  - Tailwind v4 CSS-theme pattern instead of JS config
  - Supabase-with-seed-fallback data pattern (to be implemented in Step 4+
    as lib/config/*.ts + lib/data/*.ts, mirroring duff-site's
    lib/config/articles.ts + lib/data/articles.ts)
  - Admin CRUD dashboard pattern (app/admin/*, session auth via jose) — not
    yet built, will be introduced alongside Step 4 (Blog system) since that's
    the first content type Henry will need to edit
  - This PROGRESS.md block-logging convention itself
NOT installed/run yet: npm install, npm run dev/build. Config files are
  written but unverified by an actual build in this session — verify locally
  before proceeding to Step 2.
ERRORS FIXED THIS SESSION: N/A
KNOWN GAPS:
  - No package-lock.json yet (run npm install locally to generate one)
  - Supabase project not yet created — no NEXT_PUBLIC_SUPABASE_URL etc. set
  - types/ and lib/ folders created but empty (content-type schemas come
    with Step 4 once real HTML content defines the shapes needed)
NEXT STEP: Step 2 — Navigation (top nav, mobile hamburger, no content yet).
  Waiting on: none — can proceed anytime. Independently, Step 4 (Blog
  system) is blocked until sorted-assets/html/blog/ files are provided.

---

STEP COMPLETED: Step 2 — Navigation
DATE: 2026-07-15
WHAT WAS BUILT: Sticky top nav + mobile hamburger (breakpoint 768px), no
  page content behind it yet (per Build Order scope).
FILES CREATED: lib/config/nav.ts, components/layout/Navbar.tsx. Wired into
  app/layout.tsx.
DECISION FLAGGED (not silently made — see inline comment in nav.ts):
  real site nav uses "Résumé + CV" and includes "Search" / "Beaver
  Sculptures", which aren't in the master prompt's nav list verbatim; master
  prompt's nav list includes "About" and "Rebalancing Society" which aren't
  in the real site's original nav (Rebalancing Society was a separate site
  at the time). Merged: kept "Résumé + CV" (Henry's own wording, same
  content as "About"), added "Rebalancing Society" (master prompt Content
  Structure section 11 requires it), kept "Beaver Sculptures". "Search" not
  yet added to nav — Step 12 in the Build Order, will add the nav link then.
NEXT STEP: Step 3.

---

STEP COMPLETED: Step 3 — Home Page
DATE: 2026-07-15
WHAT WAS BUILT: Full home page from html/pages/1.html ("Welcome"), every
  original section present: welcome message + portrait + signature (exact
  text, Rule 1), Blog preview blurb, Minutes with Mintzberg blurb, 3
  featured books with real cover images + all purchase/read links, Of
  Interest (17 links, verbatim), Videos (2, using the addendum's
  click-to-load YouTube facade — nothing autoplays), Stories (5, verbatim
  intro text + all 5 PDF links), Beaver Sculptures (18 preview images).
FILES CREATED:
  - lib/assets.ts — deterministic filename→GitHub-Release-URL resolver
    (extension picks the release tag per the addendum's fixed scheme; no
    manual image wiring needed, unlike the master prompt's original
    Step-13-placeholder plan)
  - types/content.ts, lib/config/{of-interest,home-books,home-videos}.ts
  - components/home/{WelcomeSection,IntroBlocks,FeaturedBooks,OfInterest,
    VideosPreview,StoriesPreview,SculpturesPreview}.tsx
  - components/media/YouTubeFacade.tsx
  - app/page.tsx (replaced Step-1 placeholder)
DEVIATIONS FROM ORIGINAL MARKUP (all forced by master prompt rules, not
  arbitrary): the "Of Interest / Videos / Stories / Beaver Sculptures"
  block was a single auto-cycling carousel in the original — split into 4
  static stacked sections instead, since master prompt bans carousels/
  autoplay. All content preserved, just not slideshow-wrapped.
ONE LINK TARGET NORMALIZED: "Of Interest" item 14 was an Outlook
  safelinks-wrapped tracking URL pointing at the same PDF as item 17
  (appendix_29_days_of_managing.pdf). Resolved both to the same GitHub
  Release asset. Link text for both kept exactly as written (they differ).
KNOWN GAPS / MANUAL FOLLOW-UP:
  - "(Website updated in April 2024)" note kept verbatim — should be
    updated to a current date at actual launch time; not changed now since
    that would be inventing/altering Henry's text pre-launch.
  - Two Of Interest links point at pages not yet parsed: `/pp` (a page,
    unconfirmed slug) and two blog posts
    (`progress-on-our-puzzle`, `donald-trump-is-not-the-problem-Part1`) —
    these ARE in the 231-post blog set (parsed, just not yet in the 10-post
    seed batch), so they'll resolve once the full blog set is wired in.
  - No npm install/build run yet this session — verify locally.
NEXT STEP: Step 4.

---

STEP STARTED (not finished): Step 4 — Blog System, 10-post test batch
DATE: 2026-07-15
WHAT WAS BUILT: End-to-end pipeline for the test batch specifically:
  - scripts/parse_blog.py — parses any html/blog/*.html with the
    `ds single post` marker into structured JSON (title, date, category,
    image refs, verbatim body HTML with LinkedIn share-widget scripts and
    trailing empty paragraphs stripped as non-content cruft — not Henry's
    words, Drupal chrome).
  - scripts/gen_blog_seed.py — takes the parsed JSON, emits a TypeScript
    seed file for however many posts you point it at. Image src values are
    tokenized as {{ASSET}}filename{{/ASSET}}, resolved to live URLs at
    render time by components/blog/PostBody.tsx (via lib/assets.ts) — so
    re-running gen_blog_seed.py for the next batch never requires
    re-parsing.
  - scripts/data/parsed-blog-posts.json — all 231 posts already parsed and
    saved here. Extending the seed to the next N posts is just re-running
    gen_blog_seed.py with a different slice, no re-parsing needed.
  - types/content.ts: BlogPost, BlogCategory types added.
  - lib/config/blog-posts.ts — TEST BATCH: first 10 posts only (see log
    below for exact filenames).
  - lib/config/blog-categories.ts — all 17 real categories (id + label),
    extracted from the 20 listing pages.
  - lib/supabase/client.ts, lib/data/blog-posts.ts — Supabase-with-
    seed-fallback pattern (duff-site's architecture, confirmed decision).
  - app/blog/page.tsx (index, no pagination yet — deferred, see below),
    app/blog/[slug]/page.tsx (post template), components/blog/PostBody.tsx.
KNOWN GAPS:
  - Pagination not built yet — 10 items doesn't need it, and building it
    against a 10-item test set risks getting the real 231-item UX wrong.
    Build once the full set is wired in.
  - Search (Fuse.js) is Step 12, not started.
  - Inline MS-Word-paste styling in some post bodies (e.g. explicit
    `font-size: 13.008px` spans from copy-pasted footnotes) was left as-is,
    not stripped — flagging as a decision point: strip all inline styles
    for consistency with the site's typography system, or leave them?
    Needs a decision before scaling to all 231 posts, since it's much
    cheaper to decide once now than to reprocess 231 posts twice.
  - Blog post count discrepancy (231 vs master prompt's 254) — see CURRENT
    STATUS section above.
  - Not yet run npm install/build — verify locally.
NEXT STEP: your call — (a) confirm the inline-styles decision + the 10-post
  pattern looks right, then scale to all 231 in one batch, or (b) move on to
  Step 5 (Books) / start classifying html/pages/ first, keeping blog at 10
  for now. Either is fine to pick up next.

---

STEP COMPLETED: Full-force round — prompt files, nav cleanup, premium
  design system, blog scale-up to all 231, pagination
DATE: 2026-07-15

1. PROMPT FILES MOVED INTO REPO
   `mintzberg-master-prompt.md` and `mintzberg-addendum-final.md` copied to
   repo root, version-controlled from now on. `mintzberg-master-prompt.md`
   amended in two places (both dated, original text kept as reference, not
   deleted):
   - Content Structure section 11 (Rebalancing Society) marked REMOVED FROM
     SCOPE — separate project, explicit decision.
   - Navigation section's nav list: "Rebalancing Society" removed.

2. NAV: Rebalancing Society link removed from `lib/config/nav.ts` (was
   never live content anyway — no page existed for it).

3. PREMIUM DESIGN SYSTEM (new standard for every page from here forward,
   until told to drop it):
   - Adapted duff-site's `.page-hero` / `.section-bg-image` fixed-parallax
     pattern (background-attachment: fixed, full-bleed image, dark overlay,
     accent divider) into Henry's navy/off-white/orange palette instead of
     duff's black/gold.
   - `public/texture-lines.svg` — custom subtle diagonal hairline texture
     (navy, low opacity) standing in for duff's mood photography, since
     there's no equivalent stock photography for an academic's site. Fits
     the "structure/strategy" subject matter (blueprint-like) without
     being decorative for its own sake.
   - `app/globals.css`: `.hero-parallax` (full hero band), `.section-parallax`
     (in-page fixed-texture band, so the background stays "featured" while
     scrolling through long content like the blog list), `.divider-accent`
     (orange, replaces duff's gold divider), `.premium-card` (hover-lift
     listing cards), `.eyebrow-label`, `.pager-link`, prose refinements for
     `.post-body`. Mobile fallback: `background-attachment: scroll` under
     640px (iOS handles `fixed` poorly, master prompt requires mobile to
     work correctly).
   - `components/layout/PageHero.tsx` — reusable hero component.
   - Applied to: Navbar (blur/shadow), Home (full redesign — hero portrait,
     section-parallax bands, premium-card book/video grids), Blog index
     (hero + card list + pagination), Blog post template (hero band +
     styled prose).

4. BLOG SCALED TO ALL 231 POSTS + STYLE CLEANUP
   - `scripts/parse_blog.py` updated: strips all inline `style=""` attrs
     (Word-paste font-size/line-height cruft), drops empty `class=""` /
     `xml:lang=""` MSO leftovers, unwraps now-bare `<span>` wrappers
     (looped for nesting). Decision confirmed by you: strip, don't
     preserve — Rule 1 covers Henry's words, not Word's inline styling.
   - `scripts/gen_blog_seed.py` updated to emit the full parsed set (was
     a 10-post slice).
   - `lib/config/blog-posts.ts` — regenerated, now 231 posts (was 10).
   - `lib/data/blog-posts.ts` — added `getBlogPostsPage(page)`: real
     pagination, 10 posts/page, sorted by parsed date descending (seed
     fallback path only — Supabase path already ordered by date).
   - `app/blog/page.tsx` — rebuilt with `searchParams.page`, prev/next +
     numbered pager (`.pager-link`), no more "list everything" — this is
     the "not the crazy way the former site did it" fix (that page loaded
     all 234 posts and took 10+ minutes).

VERIFIED: ran `npm install` + `npm run build` after all changes — clean
  compile, 0 TypeScript errors, all 231 blog post pages + home + paginated
  blog index generated successfully (235 static routes total).

KNOWN GAPS / OPEN ITEMS:
  - Pager currently renders all page-number links (24 pages at 10/page) —
    works, but a windowed pager (1 … 5 6 [7] 8 9 … 24) would look better at
    this scale. Flagged as a polish item, not urgent.
  - `html/pages/` (354 files — books, articles, commentaries, resume,
    contact, videos, stories, sculptures) still not classified/parsed.
    Design system is ready for them; content extraction is the remaining
    work.
  - Search (Fuse.js, Step 12) not started.
  - Admin dashboard (CRUD for Henry) not started — architecture decided,
    not built.
  - Supabase project not yet created — site runs entirely on the seed
    fallback right now, which is fully functional for local dev/preview.
NEXT STEP: continue building out `html/pages/` content (books, articles,
  commentaries, resume, videos, stories, sculptures) using the now-
  established design system, per Build Order Steps 5 onward. Proceeding
  with that next unless redirected.

---

## HTML FILES PROCESSED LOG

Format per entry: `filename — status — date — notes`
Status is one of: DONE (fully parsed, all content/images/links accounted
for) / PARTIAL (say exactly what's missing) / SKIPPED (say why).

Nothing processed yet. sorted-assets/ has not been sent to this session.

### Home page (sorted-assets/html/pages/1.html)
`pages/1.html` — DONE — 2026-07-15 — full home page built (Step 3). Class
`front`, title "Welcome".

### Blog (sorted-assets/html/blog/ — 252 files received, not 254)

**DONE — parsed AND wired into the live seed, all 231 real posts** (was a
10-post test batch as of the previous log entry; scaled up to the full set
2026-07-15, inline styles stripped in this pass too). Full filename list
below — every file with the `ds single post` marker is in this set:
`4ships.html`, `Brazil-corruption.html`, `Brazil-why-not.html`,
`Can-a-loose-cannon-have-a-strategy.html`, `Coalescing-around-Climate.html`,
`Confronting-Socially-Transmitted-Epidemics.html`, `Democracy-Demise.html`,
`GNH.html`, `Globalization-or-Democracy-Trade-Pacts-Tribunals.html`,
`Imagine-getting-it-beyond-Donald-Trump.html`,
`Jefferson-Lincoln-anticipated-Trump.html`, `Marginalizing the Superpowers-1.html`,
`Next-step-What-can-we-do-now.html`, `Superpower-Corrupts.html`,
`a-ceo-letter-to-the-boardlong-overdue.html`, `about-listening.html`,
`about-this-business-of-government-mr-president.html`, `abusive-bosses.html`,
`aller-de-lavant-plutot-que-de-reculer.html`, `analyst-analyze-thyself.html`,
`best.html`, `board-bee.html`, `bottom-management.html`, `brazil-quotes.html`,
`brexit.html`, `british-election-the-surprise-will-be-on-whom.html`,
`can-loose-cannon-have-strategy.html`, `canada-is-back.html`,
`cbc-interview-on-some-outrages-in-health-care.html`,
`celebrating-flawed-manager.html`, `ceo-letter-board…long-overdue.html`,
`click-here-to-save-the-world.html`, `climate-change-cool-facts-cool-ideas.html`,
`climate-change-joke.html`, `climate-change-not-problem.html`, `comma.html`,
`communityship-beyond-leadership.html`, `communityship.html`,
`concerned-but-confused.html`, `conductor.html`, `confronting-epidemics.html`,
`continuity.html`, `contrarion.html`, `conundrums-of-management.html`,
`coping-in.html`, `coronavirus-via-dr-snow.html`,
`corruption-in-mba-and-emba-rankings.html`, `cow.html`, `cow2.html`,
`creativity.html`, `customer-service.html`, `davos.html`,
`decision-making-it’s-not-what-we-think-it’s-also-what-we-see-and-what-we-do-too.html`,
`decision-making.html`, `design-doing.html`,
`deuxieme-partie-expliquer-les-anomalies.html`,
`discovering-progressive-populism.html`, `divisional-structure-warnings.html`,
`donald-trump-is-not-the-problem-Part1.html`,
`donald-trump-is-not-the-problem-part-ii.html`,
`donald-trump-is-not-the-problem-part-iii.html`,
`donald-trump-is-not-the-problem-part-iv.html`,
`donald-trump-is-not-the-problem-part-v.html`, `donalds-sins.html`,
`dont-just-sit-there.html`, `downsizing.html`, `draining-the-reservoir.html`,
`dumbing-down.html`, `effective-organizations-like-healthy-families.html`,
`emba.html`, `ending-epidemic-of-entitlement.html`,
`enough-of-more-better-is-better.html`,
`enquete-sur-la-cause-du-coronavirus-premiere-partie.html`,
`everything-right.html`, `evidence-experience.html`, `expert-quotes.html`,
`extremistsVSmoderates.html`, `fake-facts-from-and-for-all.html`,
`family-business.html`, `farce.html`,
`five-easy-steps-destroying-your-organization.html`, `five-easy-steps.html`,
`fixing-capitalism.html`, `flawed-manager.html`,
`forgive-me-for-raining-on-that-parade.html`, `from-ebola-to-imbalance.html`,
`futebol.html`, `gambling-ceo-style-always-all-in.html`,
`going-forward-not-backward.html`, `going-public-with-my-puzzle.html`,
`govt-mgmt.html`, `growing-strategies.html`, `guardian-angel.html`,
`guns-dont-kill-people-kill-sure-but-people-with-guns-kill.html`, `guns.html`,
`half-truths-management.html`, `happy-anniversary-fellow-prostitutes.html`,
`happy-birthday-canada.html`, `happy-birthday.html`, `hard-data.html`,
`harvard-19.html`, `has-berlin-wall-fallen-us.html`, `health-care-fix.html`,
`higher-education-ivory-tower.html`, `hope.html`,
`hoping-for-the-best-is-not-an-acceptable-strategy.html`,
`hospital-management.html`, `how-about-an-emba.html`,
`how-eggs-end-upend-correct-science.html`,
`how-national-happiness-became-gross.html`, `humor-quotes.html`,
`i-am-for-and-against-globalization.html`,
`imagine-an-emba-that-engages-managers-beyond-administration.html`,
`in-a-dangerous-world-mine-can-no-longer-be-bigger-than-yours.html`,
`inside-up.html`, `investigating-the-cause-of-the-coronavirus-part-ii.html`,
`jack.html`, `john-breitner.html`, `judgment.html`,
`le-nous-informe-nimporte-comment.html`, `level.html`, `listening.html`,
`lobbying.html`, `lose-lose.html`, `manageable-and-unmanageable-managing.html`,
`management-education.html`, `managing-myths-of-health-care-announcement.html`,
`managing-scrambled-eggs.html`, `managing-without-soul.html`, `manifesto.html`,
`marching-to-clever-campaigns.html`, `marginalizing-the-superpowers-2.html`,
`marketing-myopia-myopia.html`, `mbas-as-ceos.html`, `measure-it-manage-it.html`,
`measuring-managers.html`, `metaphors-in-box.html`, `mike.html`,
`moving-ahead-of-the-pandemic.html`,
`nailing-corporate-reformation-to-the-door.html`,
`need-a-strategy-let-them-grow-like-weeds-in-the-garden.html`,
`networks-communities.html`, `new-social-economy-coop-sapporo.html`,
`new-year.html`, `nothing-is-rotten-in-the-state-of-denmark.html`,
`off-button.html`, `opportunity-for-the-g6.html`, `orchestra.html`,
`organization-species.html`, `organizing-like-a-cow.html`,
`organizing-sports.html`, `our-world-of-organizations.html`,
`over-the-edge.html`, `ownership-matters.html`, `paris-quotes.html`,
`pipsqueak-canada.html`, `playful-solutions-for-puzzling-problems.html`,
`please-welcome-csr-20.html`, `porterian-and-peterian-performance.html`,
`prendre-les-devants-sur-la-pandemie.html`, `productive-productivity.html`,
`progress-on-our-puzzle.html`, `prophet.html`,
`prosecuting-criminals-instead-of-corporations.html`, `punny-sports.html`,
`quantities-quotes.html`, `rebalancing.html`, `rebalancingsociety.html`,
`reflecting-doors.html`, `reflecting-on-and-in-america.html`,
`reframing-hc.html`, `reorganising-our-heads-for-the-care-of-our-health.html`,
`rescuing-capitalism.html`, `restoring-trust-1.html`,
`round-and-round-goes-the-business-roundtable.html`, `run-for-cause.html`,
`saving-community-from-technology.html`, `saving-the-planet.html`,
`scrambled-eggs.html`, `seating.html`, `slabs.html`, `smokemirror.html`,
`soul.html`, `stock-market.html`, `strategic-thinking-as-seeing.html`,
`surviving-leadership.html`, `sweet-dreams-can-be-made-of-this.html`,
`the-declaration-of-our-interdependence.html`, `the-devil-is-in-a-detail.html`,
`the-great-strength-and-debilitating-weakness-of-modern-medicine-and-management.html`,
`the-greetings-of-the-gods.html`, `the-haphazardly-informed-we.html`,
`the-maestro-myth-of-managing.html`, `the-next-step-greta.html`,
`the-sins-of-a-president.html`, `the-tower-of-bapple.html`,
`there-is-no-nobel-prize-economics-and-why-it-matters.html`,
`this-liberal-canadian-believes-nikki-haley-should-be-president.html`,
`three-sectors.html`, `time-2-twog.html`, `time-for-the-next-reformation.html`,
`to-lead.html`,
`transformation-from-the-top-how-about-engagement-on-the-ground.html`,
`trump-legacy.html`, `trumped-both-ways.html`, `truth.html`, `truth2.html`,
`two-myths.html`, `typo.html`, `uber-uber-uber-alles.html`,
`understanding-organizations-back-cover.html`, `unnatural-manager.html`,
`ventre-mou-des-donnees-dures.html`, `we-could-not-vote-but-we-can-act.html`,
`we-live-in-times-of-great-continuity.html`,
`what-can-be-next-for-franceand-the-world.html`,
`what-could-possibly-be-wrong-with-efficiency-plenty.html`,
`what-could-possibly-be-wrong-“efficiency”-plenty.html`, `why-i-climb.html`,
`why-not.html`, `win-win.html`, `win-winning.html`, `winding-friedman-down.html`,
`workshop.html`, `world-social-forum-wrapup.html`, `world-social-forum.html`,
`worldly.html`, `wrong-efficiency.html`, `ye-gods-an-efficient-orchestra.html`,
`zoom-a-tout-prix.html`, `zooming-ahead.html`

**NOT CONTENT — category listing pages (Drupal views, id→label captured in
lib/config/blog-categories.ts, no post text to extract):**
`3.html`, `4.html`, `6.html`, `9.html`, `10.html`, `11.html`, `12.html`,
`13.html`, `14.html`, `15.html`, `16.html`, `17.html`, `18.html`, `21.html`,
`22.html`, `24.html`, `26.html`

**NOT CONTENT — infra page:** `subscribe.html` (MailChimp signup block —
relevant to the blog index page's subscribe UI, not a post)

**SKIPPED — dead scrape artifacts, not real pages:** `enterprise.html`
(404), `what-else-might-be-going-on.html` (Access Denied), `=.html` (404)

### Pages (sorted-assets/html/pages/ — 354 files total)
Not yet classified or parsed, except `1.html` (home page, see above).
Next session: run the same "classify first, then parse" approach used for
blog — the pages/ folder mixes books, articles, commentaries, resume,
contact, rebalancing society, videos, stories, sculptures pages, so
classification by content type comes before parsing.

---
