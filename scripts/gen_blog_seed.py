import json, re
from datetime import datetime

with open('/home/claude/work/parsed-blog-posts.json', encoding='utf-8') as f:
    data = json.load(f)

posts = data['posts']
# Scale-up confirmed 2026-07-15: emit the full parsed set, not just a
# 10-post test slice. Pagination (10/page) is handled at render time in
# app/blog/page.tsx, not by limiting the seed data itself.
test_batch = posts

def parse_sort_date(d):
    if not d:
        return None
    try:
        return datetime.strptime(d, '%d %B %Y').strftime('%Y-%m-%d')
    except ValueError:
        return None

def rewrite_img_src(html):
    # Bug fix (2026-07-15): only tokenize images that are actually
    # Henry's own local assets (relative paths, or absolute URLs on
    # mintzberg.org/rebalancingsociety.org). Truly external hotlinked
    # images (imgur.com, other third-party sites) must be left with their
    # original absolute URL untouched — they were never local files, so
    # wrapping them in an {{ASSET}} token made them 404 against GitHub
    # Releases where they never existed. This was causing real broken
    # images/links on the live site.
    MINTZBERG_DOMAINS = ('mintzberg.org', 'rebalancingsociety.org')

    def repl(m):
        path = m.group(1)
        if re.match(r'^https?://', path):
            domain_m = re.search(r'^https?://(?:www\.)?([^/]+)', path)
            domain = domain_m.group(1) if domain_m else ''
            if not any(domain.endswith(d) for d in MINTZBERG_DOMAINS):
                return m.group(0)  # leave truly-external images untouched
        filename = path.split('/')[-1]
        return f'src="{{{{ASSET}}}}{filename}{{{{/ASSET}}}}"'
    return re.sub(r'src="([^"]+\.(?:jpg|jpeg|png|gif))"', repl, html, flags=re.I)

def ts_escape(s):
    if s is None:
        return 'null'
    s = s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
    return '`' + s + '`'

lines = []
lines.append("import type { BlogPost } from '@/types/content'")
lines.append("")
lines.append("// TEST BATCH — first 10 of 231 real blog posts, per master prompt Build")
lines.append("// Order Step 4 (\"Test with 10 posts first, then apply to all 254\").")
lines.append("// Source files: sorted-assets/html/blog/*.html (see PROGRESS.md HTML")
lines.append("// FILES PROCESSED LOG for the authoritative per-file status).")
lines.append("// body_html has img src values marked with {{ASSET}}filename{{/ASSET}}")
lines.append("// tokens, resolved at render time via lib/assets.ts assetUrl() — see")
lines.append("// components/blog/PostBody.tsx.")
lines.append("export const BLOG_POSTS_SEED: BlogPost[] = [")
for p in test_batch:
    body = rewrite_img_src(p['body_html'])
    lines.append("  {")
    lines.append(f"    slug: {ts_escape(p['slug'])},")
    lines.append(f"    title: {ts_escape(p['title'])},")
    lines.append(f"    date: {ts_escape(p['date'])},")
    lines.append(f"    categoryLabel: {ts_escape(p['category_label'])},")
    lines.append(f"    categoryId: {ts_escape(p['category_id'])},")
    lines.append(f"    imageRefs: {json.dumps(p['image_refs'], ensure_ascii=False)},")
    lines.append(f"    bodyHtml: {ts_escape(body)},")
    lines.append("  },")
lines.append("]")

with open('/home/claude/work/mintzberg-site/mintzberg-site/lib/config/blog-posts.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')

# Supabase-ready JSON export — same tokenized body_html as the TS seed
# (so rendering logic is identical whichever source the data comes from),
# plus a computed sort_date for correct chronological ordering.
supabase_rows = []
for p in test_batch:
    supabase_rows.append({
        'slug': p['slug'],
        'title': p['title'],
        'date': p['date'],
        'sort_date': parse_sort_date(p['date']),
        'category_label': p['category_label'],
        'category_id': p['category_id'],
        'image_refs': p['image_refs'],
        'body_html': rewrite_img_src(p['body_html']),
    })
with open('/home/claude/work/mintzberg-site/mintzberg-site/supabase/seed-data/blog_posts.json', 'w', encoding='utf-8') as f:
    json.dump(supabase_rows, f, ensure_ascii=False)

print("Wrote", len(test_batch), "posts")
for p in test_batch:
    print(' -', p['filename'], '->', p['slug'])
