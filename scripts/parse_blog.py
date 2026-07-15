import os, re, json, sys
from html import unescape

SRC = '/home/claude/work/html-src/html/blog'
OUT = '/home/claude/work/parsed-blog-posts.json'

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
    # Locate the single-post wrapper
    m = re.search(r'<div class="ds single post">(.*?)</div>\s*\n\s*</div>\s*<section', c, re.S)
    if not m:
        # fallback: grab from ds single post to the sidebar-first region start
        m = re.search(r'<div class="ds single post">(.*)', c, re.S)
        if not m:
            return None
        body = m.group(1)
        # cut off at obvious end marker
        end = body.find('<section class="region region-sidebar-first')
        if end != -1:
            body = body[:end]
    else:
        body = m.group(1)
    return body

def extract_date(body):
    # date appears as raw text right after </h1>, e.g. "14 September 2018"
    m = re.search(r'</h1>\s*(\d{1,2}\s+[A-Za-z]+\s+\d{4})', body)
    return m.group(1) if m else None

def extract_h1(body):
    m = re.search(r'<h1>(.*?)</h1>', body, re.S)
    return unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip() if m else None

def extract_images(body):
    return sorted(set(re.findall(r'<img[^>]+src="([^"]+)"', body)))

def slug_from_filename(fn):
    return fn[:-5]  # strip .html

def main():
    results = []
    skipped = []
    for fn in sorted(os.listdir(SRC)):
        path = os.path.join(SRC, fn)
        with open(path, encoding='utf-8', errors='replace') as f:
            c = f.read()
        if 'ds single post' not in c:
            skipped.append(fn)
            continue
        title = extract_title(c)
        category_label, category_id = extract_category(c)
        body = extract_post_body(c)
        date = extract_date(body) if body else None
        h1 = extract_h1(body) if body else None
        images = extract_images(body) if body else []
        # strip the leading category div + h1 + date text node, keep the rest as body_html
        body_html = body
        if body_html:
            # remove category div
            body_html = re.sub(r'^\s*<div class="blog-category">.*?</div>', '', body_html, count=1, flags=re.S)
            # remove h1
            body_html = re.sub(r'^\s*<h1>.*?</h1>', '', body_html, count=1, flags=re.S)
            # remove leading date text
            body_html = re.sub(r'^\s*\d{1,2}\s+[A-Za-z]+\s+\d{4}', '', body_html, count=1)
            body_html = re.sub(r'<script\b[^>]*>.*?</script>', '', body_html, flags=re.S)
            # Strip inline style="" attributes site-wide (Word-paste cruft
            # like explicit font-size/line-height/font-family on spans) so
            # every post renders with the site's own typography system.
            # Decision confirmed 2026-07-15: strip, don't preserve.
            body_html = re.sub(r'\s+style="[^"]*"', '', body_html)
            body_html = re.sub(r"\s+style='[^']*'", '', body_html)
            # Also drop now-pointless empty class="" / lang="" MSO leftovers
            body_html = re.sub(r'\s+class=""', '', body_html)
            body_html = re.sub(r'\s+xml:lang="[^"]*"', '', body_html)
            # Collapse spans that now carry no attributes at all into
            # nothing (unwrap), since they were purely styling wrappers
            for _ in range(5):
                new_body = re.sub(r'<span>(.*?)</span>', r'\1', body_html, flags=re.S)
                if new_body == body_html:
                    break
                body_html = new_body
            body_html = re.sub(r'(<p>\s*(&nbsp;|\s)*</p>\s*)+$', '', body_html.strip())
            body_html = body_html.strip()
        results.append({
            'filename': fn,
            'slug': slug_from_filename(fn),
            'title': title or h1,
            'date': date,
            'category_label': category_label,
            'category_id': category_id,
            'image_refs': [os.path.basename(i) for i in images],
            'body_html_length': len(body_html) if body_html else 0,
            'body_html': body_html,
        })
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump({'posts': results, 'skipped_non_post_files': skipped}, f, indent=2, ensure_ascii=False)
    print(f"Parsed {len(results)} posts, skipped {len(skipped)} non-post files")
    print("Skipped:", skipped)

if __name__ == '__main__':
    main()
