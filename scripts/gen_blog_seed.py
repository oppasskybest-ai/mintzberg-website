import json, re

with open('/home/claude/work/parsed-blog-posts.json', encoding='utf-8') as f:
    data = json.load(f)

posts = data['posts']
test_batch = posts[:10]

def rewrite_img_src(html):
    def repl(m):
        path = m.group(1)
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

print("Wrote", len(test_batch), "posts")
for p in test_batch:
    print(' -', p['filename'], '->', p['slug'])
