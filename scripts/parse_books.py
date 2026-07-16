import os, re, json
from html import unescape

SRC = '/home/claude/work/html-src/html/pages'
OUT = '/home/claude/work/parsed-books.json'

# Book node IDs, from the node-type-book classification pass.
with open('/home/claude/work/pages_classification.json', encoding='utf-8') as f:
    classification = json.load(f)
book_files = [fn for fn, nt, sec, title in classification if nt == 'book']

def slugify(title):
    s = title.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s

def main():
    results = []
    for fn in sorted(book_files):
        path = os.path.join(SRC, fn)
        with open(path, encoding='utf-8', errors='replace') as f:
            c = f.read()

        title_m = re.search(r'<h1 class="page__title title" id="page-title">(.*?)</h1>', c, re.S)
        title = unescape(re.sub(r'<[^>]+>', '', title_m.group(1))).strip() if title_m else None

        # Extract book-cover and book-info directly against full content
        # (not a pre-sliced substring) — neither contains nested <div>s in
        # this dataset, so matching up to the first </div> after each
        # opening tag is reliable; slicing by a fixed count of trailing
        # </div>s (the previous approach) broke on inconsistent whitespace
        # between files.
        cover_div_m = re.search(r'<div class="book-cover">(.*?)</div>', c, re.S)
        cover_html = cover_div_m.group(1) if cover_div_m else ''

        cover_m = re.search(r'<img[^>]+src="([^"]+)"', cover_html)
        cover = os.path.basename(cover_m.group(1)) if cover_m else None

        links = []
        for href, label in re.findall(r'<a href="([^"]+)"[^>]*>([^<]+)</a>', cover_html):
            links.append({'label': unescape(label).strip(), 'href': href})

        info_m = re.search(r'<div class="book-info">(.*?)</div>\s*</div>', c, re.S)
        body_html = info_m.group(1).strip() if info_m else ''
        body_html = re.sub(r'\s+style="[^"]*"', '', body_html)

        results.append({
            'filename': fn,
            'slug': slugify(title) if title else fn,
            'title': title,
            'coverImage': cover,
            'links': links,
            'bodyHtml': body_html,
        })

    # Dedupe: every book has both a /node/{id} page and a /{slug} alias
    # page with identical content — keep one per slug, preferring the
    # slug-named source file since it's more legible in this log.
    deduped = {}
    for b in results:
        existing = deduped.get(b['slug'])
        if existing is None or not existing['filename'][0].isdigit():
            deduped[b['slug']] = b
        elif not b['filename'][0].isdigit():
            deduped[b['slug']] = b
    # index.html is an HTTrack artifact (duplicate of Simply Managing under
    # a different path), not a real distinct book — drop it explicitly.
    final = [b for b in deduped.values() if b['filename'] != 'index.html']

    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(final, f, indent=2, ensure_ascii=False)
    print(f"Parsed {len(results)} raw pages -> {len(final)} unique books")
    for b in final:
        print(' -', b['filename'], '->', b['slug'], '| cover:', b['coverImage'], '| links:', len(b['links']))

if __name__ == '__main__':
    main()
