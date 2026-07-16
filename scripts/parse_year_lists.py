import re, json, os
from html import unescape

def parse_year_list(path):
    with open(path, encoding='utf-8', errors='replace') as f:
        c = f.read()
    # Each year block: <h2>...YEAR...</h2> <ol> <li>...</li>...</ol>
    blocks = re.split(r'(?=<h2><span class="date-display-single")', c)
    years_out = []
    for block in blocks:
        ym = re.search(r'<span class="date-display-single"[^>]*>(\d{4})</span>', block)
        if not ym:
            continue
        year = ym.group(1)
        items = []
        for li in re.findall(r'<li class="">(.*?)</li>', block, re.S):
            p_m = re.search(r'<p>(.*?)</p>', li, re.S)
            text = unescape(re.sub(r'<[^>]+>', '', p_m.group(1))).strip() if p_m else ''
            links = []
            for href, label in re.findall(r'<a href="([^"]+)"[^>]*>([^<]+)</a>', li):
                links.append({'label': unescape(label).strip(), 'href': unescape(href).strip()})
            if text or links:
                items.append({'text': text, 'links': links})
        if items:
            years_out.append({'year': year, 'items': items})
    return years_out

articles = parse_year_list('/home/claude/work/html-src/html/pages/articles.html')
commentaries = parse_year_list('/home/claude/work/html-src/html/pages/commentaries.html')

with open('/home/claude/work/parsed-articles.json', 'w', encoding='utf-8') as f:
    json.dump(articles, f, indent=2, ensure_ascii=False)
with open('/home/claude/work/parsed-commentaries.json', 'w', encoding='utf-8') as f:
    json.dump(commentaries, f, indent=2, ensure_ascii=False)

print('Articles: ', sum(len(y['items']) for y in articles), 'items across', len(articles), 'years')
print('Commentaries: ', sum(len(y['items']) for y in commentaries), 'items across', len(commentaries), 'years')
print(json.dumps(articles[0], indent=2, ensure_ascii=False)[:600])
