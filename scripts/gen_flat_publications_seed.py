import json, re

def slugify(text, year, index):
    s = re.sub(r'[^a-zA-Z0-9\s]', '', text[:60]).strip().lower()
    s = re.sub(r'\s+', '-', s)
    return f"{year}-{s}" if s else f"{year}-item-{index}"

def ts_escape(s):
    if s is None:
        return 'null'
    s = s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
    return '`' + s + '`'

def flatten_and_generate(json_path, ts_out, supabase_out, const_name):
    with open(json_path, encoding='utf-8') as f:
        years = json.load(f)

    flat = []
    seen_slugs = {}
    for y in years:
        for i, item in enumerate(y['items']):
            slug = slugify(item['text'], y['year'], i)
            if slug in seen_slugs:
                seen_slugs[slug] += 1
                slug = f"{slug}-{seen_slugs[slug]}"
            else:
                seen_slugs[slug] = 0
            flat.append({'slug': slug, 'year': y['year'], 'body_html': item['text'], 'links': item['links']})

    # TS seed (flat list — matches how it'll be fetched from Supabase too)
    lines = [f"import type {{ PublicationItemRow }} from '@/types/content'", '']
    lines.append(f"export const {const_name}: PublicationItemRow[] = [")
    for row in flat:
        links_ts = ', '.join(
            f"{{ label: {ts_escape(l['label'])}, href: {ts_escape(l['href'])} }}"
            for l in row['links']
        )
        lines.append("  {")
        lines.append(f"    slug: {ts_escape(row['slug'])},")
        lines.append(f"    year: {ts_escape(row['year'])},")
        lines.append(f"    bodyHtml: {ts_escape(row['body_html'])},")
        lines.append(f"    links: [{links_ts}],")
        lines.append("  },")
    lines.append("]")
    with open(ts_out, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')

    # Supabase JSON export
    supabase_rows = [
        {'slug': r['slug'], 'year': r['year'], 'body_html': r['body_html'], 'links': r['links']}
        for r in flat
    ]
    with open(supabase_out, 'w', encoding='utf-8') as f:
        json.dump(supabase_rows, f, ensure_ascii=False)

    print(f"{const_name}: {len(flat)} flat rows -> {ts_out}")
    return flat

flatten_and_generate(
    '/home/claude/work/parsed-articles.json',
    '/home/claude/work/mintzberg-site/mintzberg-site/lib/config/articles.ts',
    '/home/claude/work/mintzberg-site/mintzberg-site/supabase/seed-data/articles.json',
    'ARTICLES_SEED',
)
flatten_and_generate(
    '/home/claude/work/parsed-commentaries.json',
    '/home/claude/work/mintzberg-site/mintzberg-site/lib/config/commentaries.ts',
    '/home/claude/work/mintzberg-site/mintzberg-site/supabase/seed-data/commentaries.json',
    'COMMENTARIES_SEED',
)
