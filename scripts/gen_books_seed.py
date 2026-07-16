import json, re

with open('/home/claude/work/parsed-books.json', encoding='utf-8') as f:
    books = json.load(f)

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
lines.append("import type { Book } from '@/types/content'")
lines.append("")
lines.append("// All 21 real books, parsed from sorted-assets/html/pages/*.html")
lines.append("// (node-type-book pages). Deduped from 42 raw files — every book had")
lines.append("// both a /node/{id} page and a /{slug} alias page with identical content.")
lines.append("// See PROGRESS.md HTML FILES PROCESSED LOG for the source filenames.")
lines.append("export const BOOKS_SEED: Book[] = [")
for b in books:
    body = rewrite_img_src(b['bodyHtml'])
    links_ts = ', '.join(
        f"{{ label: {ts_escape(l['label'])}, href: {ts_escape(l['href'])} }}"
        for l in b['links']
    )
    lines.append("  {")
    lines.append(f"    slug: {ts_escape(b['slug'])},")
    lines.append(f"    title: {ts_escape(b['title'])},")
    lines.append(f"    coverImage: {ts_escape(b['coverImage'])},")
    lines.append(f"    links: [{links_ts}],")
    lines.append(f"    bodyHtml: {ts_escape(body)},")
    lines.append("  },")
lines.append("]")

with open('/home/claude/work/mintzberg-site/mintzberg-site/lib/config/books.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')

print("Wrote", len(books), "books")
