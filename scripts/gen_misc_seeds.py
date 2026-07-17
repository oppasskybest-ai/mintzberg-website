import json

def ts_escape(s):
    if s is None:
        return 'null'
    if isinstance(s, list):
        return s
    s = s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
    return '`' + s + '`'

OUT_DIR = '/home/claude/work/mintzberg-site/mintzberg-site/lib/config'
SUPA_DIR = '/home/claude/work/mintzberg-site/mintzberg-site/supabase/seed-data'

# ── STORIES ──
STORIES = [
    {'slug': 'reflecting-on-doors', 'title': 'Reflecting On Doors', 'description': 'Is it fair for a mirror person to criticize a window person, at least for missing the reflection?', 'pdf_file': 'reflecting_on_doors_dec_2015.pdf', 'body_html': ''},
    {'slug': 'gopis-farm', 'title': "Gopi's Farm", 'description': 'On this sustainable farm, Gopi grows more than coconuts.', 'pdf_file': 'stories_gopis_farm_march_2014.pdf', 'body_html': ''},
    {'slug': 'for-the-love-of-the-lake', 'title': 'For the Love of the Lake', 'description': 'Doing more than everything imaginable on a mirror of great glee.', 'pdf_file': 'love_of_the_lake_january_2016.pdf', 'body_html': ''},
    {'slug': 'why-i-climb-mountains-anyway', 'title': 'Why I Climb Mountains Anyway', 'description': 'Let me recount the ways.', 'pdf_file': 'mountains_17_july_2015.pdf', 'body_html': ''},
    {'slug': 'getting-lenny-married', 'title': 'Getting Lenny married', 'description': 'His exuberant wedding in the Alps', 'pdf_file': 'getting_lenny_married.pdf', 'body_html': ''},
]
lines = ["import type { StoryItem } from '@/types/content'", '', 'export const STORIES_SEED: StoryItem[] = [']
for s in STORIES:
    lines.append("  {")
    lines.append(f"    slug: {ts_escape(s['slug'])},")
    lines.append(f"    title: {ts_escape(s['title'])},")
    lines.append(f"    description: {ts_escape(s['description'])},")
    lines.append(f"    pdfFile: {ts_escape(s['pdf_file'])},")
    lines.append(f"    bodyHtml: {ts_escape(s['body_html'])},")
    lines.append("  },")
lines.append(']')
with open(f'{OUT_DIR}/stories.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')
with open(f'{SUPA_DIR}/stories.json', 'w', encoding='utf-8') as f:
    json.dump([{'slug': s['slug'], 'title': s['title'], 'description': s['description'], 'pdf_file': s['pdf_file'], 'body_html': s['body_html']} for s in STORIES], f, ensure_ascii=False)
print('Wrote stories.ts +', len(STORIES), 'stories to seed-data')

# ── SCULPTURE IMAGES ──
SCULPTURE_FILES = [
    'beaverc11.jpg', 'd11_new.jpg', 'b11_new_0.jpg', 'b21_new_0.jpg',
    'beavera21.jpg', 'beavere11.jpg', 'beavere21.jpg', 'beaverg11.jpg',
    'beaver_2014_04.jpg', 'r11_new.jpg', 'beaverj11.jpg', 'beaverj21.jpg',
    'beaverj31.jpg', 'beaverk11.jpg', 'beaverl11.jpg', 'beaverm11.jpg',
    'q11_new.jpg', 'beavero1o21.jpg', 'beaverp11.jpg', 's11_new.jpg',
    'h11_new_0.jpg',
]
lines = ["import type { SculptureImageItem } from '@/types/content'", '', 'export const SCULPTURE_IMAGES_SEED: SculptureImageItem[] = [']
for i, fn in enumerate(SCULPTURE_FILES):
    lines.append("  {")
    lines.append(f"    imageFile: {ts_escape(fn)},")
    lines.append(f"    caption: {ts_escape('')},")
    lines.append(f"    sortOrder: {i},")
    lines.append("  },")
lines.append(']')
with open(f'{OUT_DIR}/sculpture-images.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')
with open(f'{SUPA_DIR}/sculpture_images.json', 'w', encoding='utf-8') as f:
    json.dump([{'image_url': fn, 'caption': '', 'sort_order': i} for i, fn in enumerate(SCULPTURE_FILES)], f, ensure_ascii=False)
print('Wrote sculpture-images.ts +', len(SCULPTURE_FILES), 'images to seed-data')

print('Done.')

# ── SITE PAGES (Résumé) ──
import sys
sys.path.insert(0, '/home/claude/work/mintzberg-site/mintzberg-site')
# Read the resume body straight from the existing lib/config/resume.ts
# (already verbatim-correct from an earlier session) rather than
# re-parsing HTML, to avoid any drift.
with open(f'{OUT_DIR}/resume.ts', encoding='utf-8') as f:
    resume_ts = f.read()
import re
body_match = re.search(r'RESUME_BODY_HTML = `(.*)`\s*$', resume_ts, re.S)
resume_body = body_match.group(1).strip() if body_match else ''

site_pages_row = {'slug': 'resume', 'title': 'Résumé', 'body_html': resume_body}
with open(f'{SUPA_DIR}/site_pages.json', 'w', encoding='utf-8') as f:
    json.dump([site_pages_row], f, ensure_ascii=False)
print('Wrote site_pages.json (resume)')
