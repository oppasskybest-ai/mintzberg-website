import os, re, json
from html import unescape

SRC = '/home/claude/work/html-src/html/pages'
OUT = '/home/claude/work/parsed-extra-blog-posts.json'

FILES = ['217.html', '356.html', '504.html', '522.html', '532.html',
         '568.html', '660.html', '664.html', '666.html', '672.html']

# Distinct slugs for the two that repost content also reachable via a
# slug-alias elsewhere (volkswagen.html / judgement-gone.html are the SAME
# content as 356/568 respectively — using the node id as the canonical
# slug here to avoid a collision with any future parse of those aliases).
SLUG_OVERRIDES = {
    '664.html': 'about-this-business-of-government-mr-president-2025-repost',
}

def extract_title(c):
    m = re.search(r'<title>(.*?)\s*\|\s*Henry Mintzberg</title>', c, re.S)
    return unescape(m.group(1).strip()) if m else None

def extract_category(c):
    m = re.search(r'<div class="blog-category"><a href="([^"]+)">([^<]+)</a></div>', c)
    if not m:
        return None, None
    href, label = m.groups()
    cat_id = re.search(r'(\d+)\.html', href)
    return unescape(label), (cat_id.group(1) if cat_id else None)

def extract_post_body(c):
    m = re.search(r'<div class="ds single post">(.*?)</div>\s*\n\s*</div>\s*<section', c, re.S)
    if not m:
        m = re.search(r'<div class="ds single post">(.*)', c, re.S)
        if not m:
            return None
        body = m.group(1)
        end = body.find('<section class="region region-sidebar-first')
        if end != -1:
            body = body[:end]
    else:
        body = m.group(1)
    return body

def extract_date(body):
    m = re.search(r'</h1>\s*(\d{1,2}\s+[A-Za-z]+\s+\d{4})', body)
    return m.group(1) if m else None

def extract_h1(body):
    m = re.search(r'<h1>(.*?)</h1>', body, re.S)
    return unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip() if m else None

def extract_images(body):
    return sorted(set(re.findall(r'<img[^>]+src="([^"]+)"', body)))

def slugify(title):
    s = title.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s

def main():
    results = []
    for fn in FILES:
        path = os.path.join(SRC, fn)
        with open(path, encoding='utf-8', errors='replace') as f:
            c = f.read()
        if 'ds single post' not in c:
            print('SKIP (not a post):', fn)
            continue
        title = extract_title(c)
        category_label, category_id = extract_category(c)
        body = extract_post_body(c)
        date = extract_date(body) if body else None
        h1 = extract_h1(body) if body else None
        images = extract_images(body) if body else []

        body_html = body
        if body_html:
            body_html = re.sub(r'^\s*<div class="blog-category">.*?</div>', '', body_html, count=1, flags=re.S)
            body_html = re.sub(r'^\s*<h1>.*?</h1>', '', body_html, count=1, flags=re.S)
            body_html = re.sub(r'^\s*\d{1,2}\s+[A-Za-z]+\s+\d{4}', '', body_html, count=1)
            body_html = re.sub(r'<script\b[^>]*>.*?</script>', '', body_html, flags=re.S)
            body_html = re.sub(r'\s+style="[^"]*"', '', body_html)
            body_html = re.sub(r"\s+style='[^']*'", '', body_html)
            body_html = re.sub(r'\s+class=""', '', body_html)
            body_html = re.sub(r'\s+xml:lang="[^"]*"', '', body_html)
            for _ in range(5):
                new_body = re.sub(r'<span>(.*?)</span>', r'\1', body_html, flags=re.S)
                if new_body == body_html:
                    break
                body_html = new_body
            body_html = re.sub(r'(<p>\s*(&nbsp;|\s)*</p>\s*)+$', '', body_html.strip())
            body_html = body_html.strip()

        final_title = title or h1
        slug = SLUG_OVERRIDES.get(fn) or (slugify(final_title) if final_title else fn.replace('.html', ''))

        results.append({
            'filename': fn,
            'slug': slug,
            'title': final_title,
            'date': date,
            'category_label': category_label,
            'category_id': category_id,
            'image_refs': [os.path.basename(i) for i in images],
            'body_html': body_html,
        })

    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump({'posts': results}, f, indent=2, ensure_ascii=False)
    print(f"Parsed {len(results)} extra posts")
    for p in results:
        print(' -', p['filename'], '->', p['slug'], '|', p['date'])

if __name__ == '__main__':
    main()
