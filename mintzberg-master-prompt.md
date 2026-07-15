# MASTER BUILD PROMPT — HENRY MINTZBERG WEBSITE
# For use with AI coding assistant (Cursor, Claude, Copilot etc)
# Read every word of this before touching a single file.

---

## WHO THIS IS FOR

You are helping rebuild the personal website of Henry Mintzberg. He is one of the most influential management thinkers alive. He is a professor at McGill University, author of 23+ books including Strategy Safari, Managing, and Rebalancing Society, and has been writing publicly for decades. His audience includes academics, business professionals, policy makers, students and serious readers from around the world.

This is not a portfolio site. This is not a startup landing page. This is a living digital home for a lifetime of serious intellectual work. Every design and technical decision must reflect that.

---

## WHAT YOU ARE BUILDING

A complete, modern, fast, fully custom website built in Next.js that replaces two outdated sites:
- mintzberg.org (currently Drupal 7, end of life since January 2025)
- rebalancingsociety.org (currently WordPress, outdated)

The new site must:
- Preserve every single word of content from the original sites without exception
- Feel familiar to Henry's existing readers while being dramatically better to use
- Load fast on mobile and desktop
- Be easy for a non-technical person to understand and navigate
- Connect both sites into one unified platform

---

## CRITICAL RULES — READ THESE FIRST AND NEVER BREAK THEM

**RULE 1: NEVER SHORTEN, SUMMARISE, OR REWRITE ANY CONTENT**
Every HTML file contains Henry's actual words. His blog posts, his articles, his commentaries, his book descriptions, his welcome message, everything. You are not an editor. You are a builder. Your job is to take his exact words and present them better, not change them. Do not remove a sentence. Do not paraphrase a paragraph. Do not decide something is too long. If Henry wrote it, it stays, word for word.

**RULE 2: DO NOT RUSH**
This project has 616 HTML files, 310 images, 77 PDF documents and over 800 image references. It cannot be done in one session. Work section by section. Finish one component completely before moving to the next. Never half-build something and move on. If a component is not working perfectly, fix it before proceeding.

**RULE 3: ASK BEFORE DECIDING**
If you are unsure how a piece of content should be displayed, ask. Do not make assumptions about layout, structure or design and implement them silently. Every significant decision gets discussed first.

**RULE 4: NEVER INVENT CONTENT**
Do not write placeholder text, dummy descriptions, or invented metadata. If information is not in the HTML files, leave the field empty and flag it. Never fill gaps with made up content.

**RULE 5: MOBILE FIRST**
Every single component must look and work correctly on a phone screen before we care about desktop. Henry's readers find him through LinkedIn and social media, which means they arrive on mobile. A broken mobile experience is not acceptable.

**RULE 6: NO DECISIONS ABOUT IMAGES WITHOUT ASKING**
Images are stored separately. Do not assume any image path. When building components that need images, use a clearly named placeholder and flag it so the correct image can be wired in manually.

---

## THE HTML FILES — HOW TO USE THEM

You have access to a folder called sorted-assets which contains:

```
sorted-assets/
  html/
    blog/        — 254 individual blog post HTML files
    pages/       — 362 other pages (books, articles, videos, resume, contact etc)
  images/
    jpg/         — 240 jpg images
    png/         — 70 png images
    gif/         — 5 gif images
  documents/
    pdf/         — 77 downloadable PDF papers
  code/
    css/         — 14 CSS files (for reference only, do not reuse)
    js/          — 12 JS files (for reference only, do not reuse)
  image-map.txt  — every image path referenced across all 616 HTML pages
```

**How to read the HTML files correctly:**

Each HTML file is a scraped copy of the original Drupal page. When you open one you will see Drupal-generated markup with classes like field-item, view-content, node-body and so on. Ignore all of that markup. What you want is the actual text content sitting inside those tags. Strip the Drupal wrapper and extract only the real content: the title, the body text, the date if present, the links if present.

Do not copy any Drupal class names into the new build. Do not copy any inline styles from the old HTML. Do not copy any of the old navigation structure. Extract content only.

**Blog posts specifically:**
Each file in html/blog/ is one blog post. Extract from each file:
- The post title
- The publication date
- The full body text, every paragraph, every sentence, nothing removed
- Any links within the body, preserve them
- Any images referenced, note the image filename and flag it for wiring

**Pages specifically:**
Files in html/pages/ cover everything else. Before building any page, open the HTML file, read it fully, understand what it is, then build the component to display that content. Never skim a file.

---

## CONTENT STRUCTURE — WHAT THE SITE CONTAINS

Based on the 616 HTML files here is what exists and needs a home on the new site:

**1. Home page**
Henry's welcome message, his signature, links to his main sections, his three featured books, his blog preview, his co-founded programs (IMHL, IMPM, CoachingOurselves), his Of Interest section, and the website updated note.

**2. Books section**
All of Henry's published books. Each book needs its own page with full description, cover image, purchase links (Amazon and Berrett-Koehler at minimum), and any related articles or excerpts.

**3. Blog (254 posts)**
Every single blog post preserved in full. Needs pagination, category filtering, search, and a clean reading experience. Each post gets its own URL. No content is cut. No post is hidden.

**4. Articles section**
Academic and professional articles. Each links to either an internal page or a downloadable PDF. The PDF files are stored in documents/pdf/.

**5. Commentaries section**
Similar to articles but shorter form opinion pieces. All preserved in full.

**6. Videos section**
The Minutes with Mintzberg series and other video content. These are YouTube embeds. Extract the YouTube links from the HTML files and display them in a clean grid.

**7. Stories section**
Henry's short stories and personal writing. Preserve every word.

**8. Beaver Sculptures**
Henry's personal interest section with photos of his beaver sculptures. Treat this with the same care as any other section.

**9. Resume and CV**
His full academic and professional biography. Every line preserved.

**10. Contact page**
A clean contact form. Simple. Name, email, subject, message.

**11. Rebalancing Society section — REMOVED FROM SCOPE (2026-07-15)**
> **Amendment, not a deletion of history:** this section originally called
> for integrating the full content of rebalancingsociety.org as a section
> of this site. On 2026-07-15 this was explicitly ruled out of scope —
> Rebalancing Society is its own separate project, not part of the Henry
> Mintzberg website rebuild. Do not build a `/rebalancing-society` route,
> do not add it to navigation, and do not parse `rebalancingsociety.org`
> content into this repo. If this decision is ever reversed, treat it as
> a new instruction, not a reversion to the original text below.
>
> Original section text, kept for reference only:
> The full content of rebalancingsociety.org integrated as its own section:
> - The Challenge page
> - The Pathway page
> - I. Declaring our Interdependence
> - II. Acting to Reverse and Renew (including the interactive table)
> - III. Consolidating our Actions
> - Sites and Sights resource page
> - The Declaration (read, sign, share)

**12. HM Co-Founded Programs**
IMHL at McGill, IMPM, CoachingOurselves. Each with description and external link.

**13. Search**
A working site-wide search that covers blog posts, articles, commentaries and all other pages.

---

## DESIGN DIRECTION

**Tone:** Editorial, authoritative, clean. Not corporate, not startup, not flashy.

**Typography:**
- Headings: Playfair Display or Lora (serif, signals intellectual weight)
- Body: Inter or Source Sans Pro (clean, highly readable)
- Minimum body font size 17px, line height 1.7, generous paragraph spacing

**Colours:**
- Primary: Navy blue (#1a2e4a or close to Henry's existing header colour)
- Background: Warm off-white (#fafaf8), not pure white
- Accent: Warm orange (#e05c1a or close to rebalancingsociety.org orange) for links, buttons, highlights
- Text: Near black (#1a1a1a)

**Layout principles:**
- Single column reading experience for all content pages
- Maximum content width 720px centered on the page
- Sticky top navigation
- Clear visual hierarchy using font size and weight, not decorative elements
- Generous whitespace, content needs room to breathe
- No carousels, no sliders, no autoplay anything

**Navigation:**
Home, Books, Blog, Articles, Commentaries, Videos, Stories, About, Contact
(Rebalancing Society removed from nav 2026-07-15 — see Content Structure
section 11 amendment above; it's a separate project.)

**Mobile:**
Hamburger menu on mobile. All content fully readable on a 375px screen. No horizontal scrolling anywhere.

---

## TECHNICAL STACK

- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Fonts: Google Fonts (Playfair Display + Inter)
- Blog and content: MDX or JSON files generated from the HTML files
- Search: Fuse.js for client side search
- Email/Contact form: Resend or Nodemailer
- PDF handling: Direct file links, no in-browser rendering
- Deployment: Vercel
- Images: Next.js Image component with proper width, height and alt text on every single image

---

## HOW TO HANDLE IMAGES

Images are not embedded in the Next.js project folder because the full image set is over 100MB and cannot be pushed to GitHub with standard git. Instead:

**During build phase:**
Use clearly named placeholder components wherever an image should appear. Name each placeholder after the exact image filename it will eventually show. For example:

```jsx
<ImagePlaceholder filename="henry-portrait.jpg" alt="Henry Mintzberg portrait" />
```

**Image map reference:**
The file image-map.txt contains every image path referenced across all 616 HTML pages. Use this file to know which images are needed where. When building any component that references an image, check image-map.txt first to confirm the exact filename.

**After build:**
Images will be uploaded to Cloudinary or a similar CDN. Once uploaded, the placeholder components will be replaced with the actual Next.js Image component pointing to the CDN URL. Do not hardcode any local file paths.

---

## HOW TO HANDLE PDFs

The 77 PDF files total approximately 780MB and cannot be stored in the GitHub repository. They will be hosted on Cloudinary or Google Drive with direct download links.

During build, create PDF link components like this:

```jsx
<PDFDownload
  title="Developing Naturally: From Management to Organization"
  filename="developing_naturally.pdf"
  year="2012"
/>
```

After the PDFs are uploaded to the CDN, replace filename with the full CDN URL. Do not attempt to embed PDFs in the browser. Download link only.

---

## BUILD ORDER — FOLLOW THIS EXACTLY

Do not skip steps. Do not reorder steps. Complete each step fully before moving to the next.

**Step 1: Project setup**
Next.js app with Tailwind, fonts, global styles, colour variables and base layout component. Nothing else.

**Step 2: Navigation**
Top navigation with all menu items. Mobile hamburger. No content yet.

**Step 3: Home page**
Build the home page using content extracted from the home page HTML file. Every section of the original home page must appear. No content invented.

**Step 4: Blog system**
Parse all 254 blog HTML files. Generate JSON data for each post containing title, date, slug, full body content and image references. Build the blog index page with pagination. Build the individual blog post page template. Test with 10 posts first, then apply to all 254.

**Step 5: Books section**
Extract all book data from the HTML files. Build book index and individual book pages.

**Step 6: Articles and Commentaries**
Extract content from HTML files. Build listing pages and individual pages with PDF download links where applicable.

**Step 7: Videos section**
Extract YouTube embed links from HTML files. Build video gallery.

**Step 8: Stories and Sculptures**
Extract content. Build pages.

**Step 9: Resume and CV**
Extract full resume content. Build page.

**Step 10: Rebalancing Society section**
Build all six pages of the rebalancing society content including the interactive table from the Acting page.

**Step 11: Contact page**
Build contact form with working email submission.

**Step 12: Search**
Implement site-wide search using Fuse.js across all content.

**Step 13: Image wiring**
Replace all image placeholders with actual CDN URLs once images are uploaded.

**Step 14: PDF wiring**
Replace all PDF placeholders with actual CDN URLs once PDFs are uploaded.

**Step 15: Full review**
Open every single page. Check every link. Check every image. Check every PDF link. Check on mobile. Fix everything that is broken.

---

## BEFORE EVERY SESSION

At the start of each new chat session with the AI, paste this prompt in full and then state exactly which step you are on and what was last completed. The AI has no memory between sessions. Never assume it remembers anything from a previous session.

---

## A NOTE ON PATIENCE

This is a large project. 616 HTML files, 310 images, 77 PDFs, two sites merged into one. It will take multiple sessions to complete. That is expected and fine. The goal is not speed. The goal is that when Henry Mintzberg opens the link you send him, every single word he has ever written is there, presented in a way that matches the quality of the thinking behind it.

Do not rush. Do not cut corners. Do not skip content. Build it right.
