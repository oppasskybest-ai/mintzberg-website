# ADDENDUM — SESSION 1: ASSET INFRASTRUCTURE (FINAL)
# Append this to mintzberg-master-prompt.md before starting Step 1.
# This is the clean, final record of the completed asset-hosting setup.
# (Supersedes any earlier draft of this addendum — Cloudinary was
# evaluated and fully abandoned in favor of GitHub Releases; this
# version reflects only what was actually built.)

---

## STATUS AS OF THIS ADDENDUM

Completed before Step 1 (Project Setup):
- All local files organized into `sorted-assets/` (images/jpg,
  images/png, images/gif, documents/pdf, html/blog, html/pages,
  code/css, code/js, image-map.txt)
- GitHub repo created: `oppasskybest-ai/mintzberg-website` (public)
- All 391 assets (239 jpg + 69 png + 5 gif + 78 pdf) uploaded and
  verified 100% present as GitHub Release assets — confirmed via a
  final verification pass showing 0 uploaded / all skipped (already
  present) / 0 failed across all four asset types

Not yet started: Step 1 (Next.js project setup) onward.

---

## FINAL ASSET HOSTING ARCHITECTURE

**Single source of truth: GitHub Releases**, on the same repo that
holds the code. No external service (Cloudinary or otherwise) is
used. This was a deliberate decision after weighing options — see
"Decision history" at the bottom of this addendum for context if
ever needed, but the working rule going forward is simply:

> All images and PDFs live in GitHub Releases on this repo.
> The project's `public/` folder does NOT contain these files
> directly — components reference them via their Release URLs.

**Repo:** `oppasskybest-ai/mintzberg-website`

**Four releases (acting as "folders"):**
| Release tag     | Contents          | File count |
|-----------------|-------------------|------------|
| `images-jpg`    | all .jpg images   | 239        |
| `images-png`    | all .png images   | 69         |
| `images-gif`    | all .gif images   | 5          |
| `documents-pdf` | all .pdf files    | 78 (77 real papers + 1 duplicate to clean up, see below) |

**URL pattern for any asset:**
```
https://github.com/oppasskybest-ai/mintzberg-website/releases/download/{tag}/{filename}
```
Example:
```
https://github.com/oppasskybest-ai/mintzberg-website/releases/download/images-jpg/beaver.jpg
https://github.com/oppasskybest-ai/mintzberg-website/releases/download/documents-pdf/hm_the_myths_of_mis.pdf
```

**Reference sheet:** `release_upload_log.csv` (produced during the
upload session) lists every local filename, which release tag it
belongs to, and its upload status. Use this — combined with the URL
pattern above — to construct the correct URL for any given file when
wiring components. No local file paths and no CDN account are
involved.

**Known cleanup item (non-blocking):** `documents-pdf` currently
contains both `Power_in_and_around_organizations.pdf` (the real file,
113MB, full quality) and a leftover
`Power_in_and_around_organizations_compressed.pdf` (an earlier,
now-unwanted compression attempt from before the GitHub Releases
decision was finalized). Delete the `_compressed` version via the
GitHub web UI (Release → Edit → remove asset) before or during Step
13/14 wiring, so it's not mistaken for the real file.

---

## FORCING PDF DOWNLOADS INSTEAD OF INLINE BROWSER OPENING

GitHub Release asset URLs already send a
`Content-Disposition: attachment` header by default for most file
types when accessed directly — clicking a Release asset link
typically downloads rather than opens inline. Verify this behavior
during Step 6 (Articles/Commentaries, which use PDFDownload
components) and Step 15 (Full Review). If any PDF opens inline
instead of downloading in a real browser test, a simple client-side
`download` attribute on the `<a>` tag is the fallback:
```jsx
<a href={releaseUrl} download>{title}</a>
```

---

## YOUTUBE VIDEO HANDLING — DECIDED APPROACH

For the Videos section (Step 7), use a "facade" pattern, not live
iframes for every video:

- Build a grid of clickable thumbnail cards, each showing the video
  title + a thumbnail image pulled from
  `https://img.youtube.com/vi/{VIDEO_ID}/hqdefault.jpg` (free, no API
  key needed)
- Only load the actual `<iframe>` embed (using the
  `youtube-nocookie.com` domain) when a user clicks a thumbnail,
  swapping it in place of the thumbnail
- This keeps the page fast (no dozens of iframes loading at once) and
  naturally prevents autoplay, since nothing plays until clicked —
  satisfying the "no autoplay anything" rule from the design
  direction section of the master prompt

---

## RE-RUNNING OR EXTENDING THE UPLOAD (IF NEEDED LATER)

If Henry sends new/updated images or PDFs after this point, the same
process applies: drop the new file into the matching local folder
under `sorted-assets/` (e.g. a new jpg goes in
`sorted-assets/images/jpg/`), then re-run the upload script
(`upload_to_releases.sh`, kept in the `mintzberg-backup/` working
folder, not part of the Next.js repo itself). It only uploads what's
missing — safe to re-run anytime, will not duplicate or overwrite
unrelated files. New filenames automatically get correct Release URLs
following the same pattern above.

---

## HOW TO CONTINUE ACROSS SESSIONS GOING FORWARD

This project will span many chat sessions. At the start of each new
session:

1. Paste `mintzberg-master-prompt.md` (the original master prompt)
2. Paste this addendum (or the latest cumulative version — see below)
3. State plainly which Build Order step you're on and what was last
   completed
4. If continuing mid-step (e.g. "20 of 254 blog posts parsed"), say
   so explicitly

**At the end of each session going forward**, before closing the
conversation, ask for a new addendum block summarizing:
- What was completed this session
- Any new decisions made (design, data structure, naming conventions)
- Any blockers or manual-follow-up items
- Exact state to resume from (e.g. "next: Step 4, blog post 21–50")

Append each new block under this one, in order, so the addendum
becomes a running build log alongside the unchanging master prompt.
Keep the master prompt itself untouched — all session-specific
updates belong in the addendum, not in the original rules.

---

## STEP 16: PROJECT HANDOFF (NEW — ADD TO BUILD ORDER)

When the site is ready to hand over to Henry (or whoever will own it
long-term), repo ownership needs to transfer — not just be shared.
Since all assets live in this same repo's Releases (not a separate
service), a GitHub repo transfer alone moves everything: code AND
every image/PDF, in one action. This is simpler than the earlier
plan (which involved a separate Cloudinary account transfer) — one
less thing to hand over.

**To transfer repo ownership on GitHub:**
1. Go to the repo's **Settings** tab
2. Scroll to the **Danger Zone** at the bottom
3. Click **Transfer ownership**
4. Enter the new owner's GitHub username and confirm

All Release asset URLs stay exactly the same after transfer as long
as the repo name doesn't change (URLs are based on
`owner/repo/releases/download/...` — if the new owner renames the
repo post-transfer, every URL referencing these assets across the
codebase would need updating, so recommend keeping the repo name
unchanged through transfer, or updating URLs deliberately as one
final step if renaming is desired).

**Decision needed before Step 16 is executed:** confirm the exact
GitHub username of the receiving party in advance.

---

## DECISION HISTORY (FOR CONTEXT ONLY — NOT ACTIVE INSTRUCTIONS)

Early in this session, Cloudinary was set up and ~364 of 390 files
were uploaded there before a hybrid approach (Cloudinary + local
repo + GitHub Releases for oversized files) was considered. This was
ultimately abandoned in favor of putting 100% of assets in GitHub
Releases, to avoid the complexity and reliability concerns of pulling
assets from multiple different places. The Cloudinary account
(`uhcvkmmx`) still technically holds those files but is no longer
referenced anywhere in the project and can be safely ignored or
deleted — it costs nothing to leave dormant on the free tier either
way. This section exists only so future sessions understand why a
Cloudinary account might be mentioned in old chat history, not
because it's part of the active plan.
