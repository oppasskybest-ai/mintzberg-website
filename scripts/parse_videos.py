import os, re, json
from html import unescape

SRC = '/home/claude/work/html-src/html/pages'
OUT = '/home/claude/work/parsed-videos.json'

with open('/home/claude/work/pages_classification.json', encoding='utf-8') as f:
    classification = json.load(f)
video_files = [fn for fn, nt, sec, title in classification if nt == 'video']

def slugify(title):
    s = title.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s

def main():
    results = []
    for fn in sorted(video_files):
        path = os.path.join(SRC, fn)
        with open(path, encoding='utf-8', errors='replace') as f:
            c = f.read()

        title_m = re.search(r'<h1 class="page__title title" id="page-title">(.*?)</h1>', c, re.S)
        title = unescape(re.sub(r'<[^>]+>', '', title_m.group(1))).strip() if title_m else None

        iframe_m = re.search(r'<iframe[^>]+src="([^"]+)"', c)
        src = iframe_m.group(1) if iframe_m else None
        vid_m = re.search(r'(?:embed/|watch\?v=|youtu\.be/)([A-Za-z0-9_-]{6,})', src) if src else None
        video_id = vid_m.group(1) if vid_m else None

        results.append({
            'filename': fn,
            'slug': slugify(title) if title else fn,
            'title': title,
            'youtubeId': video_id,
        })

    # Dedupe by youtubeId (node-id and slug-alias pages are duplicates)
    deduped = {}
    no_id = []
    for v in results:
        if not v['youtubeId']:
            no_id.append(v)
            continue
        existing = deduped.get(v['youtubeId'])
        if existing is None or not existing['filename'][0].isdigit():
            deduped[v['youtubeId']] = v
        elif not v['filename'][0].isdigit():
            deduped[v['youtubeId']] = v

    final = list(deduped.values())
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump({'videos': final, 'no_youtube_id': no_id}, f, indent=2, ensure_ascii=False)
    print(f"Parsed {len(results)} raw pages -> {len(final)} unique videos, {len(no_id)} with no extractable video ID")
    for v in final:
        print(' -', v['filename'], '->', v['slug'], '| id:', v['youtubeId'])
    if no_id:
        print("NO ID:", [v['filename'] for v in no_id])

if __name__ == '__main__':
    main()
