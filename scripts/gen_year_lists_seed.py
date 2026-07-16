import json

def ts_escape(s):
    if s is None:
        return 'null'
    s = s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
    return '`' + s + '`'

def gen(json_path, out_path, const_name, comment):
    with open(json_path, encoding='utf-8') as f:
        years = json.load(f)
    lines = []
    lines.append("import type { PublicationYear } from '@/types/content'")
    lines.append("")
    lines.append(comment)
    lines.append(f"export const {const_name}: PublicationYear[] = [")
    for y in years:
        lines.append("  {")
        lines.append(f"    year: {ts_escape(y['year'])},")
        lines.append("    items: [")
        for item in y['items']:
            links_ts = ', '.join(
                f"{{ label: {ts_escape(l['label'])}, href: {ts_escape(l['href'])} }}"
                for l in item['links']
            )
            lines.append("      {")
            lines.append(f"        text: {ts_escape(item['text'])},")
            lines.append(f"        links: [{links_ts}],")
            lines.append("      },")
        lines.append("    ],")
        lines.append("  },")
    lines.append("]")
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    total = sum(len(y['items']) for y in years)
    print(f"Wrote {const_name}: {total} items across {len(years)} years -> {out_path}")

gen(
    '/home/claude/work/parsed-articles.json',
    '/home/claude/work/mintzberg-site/mintzberg-site/lib/config/articles.ts',
    'ARTICLES_SEED',
    "// 171 articles across 52 years (1967-2026), parsed from sorted-assets/html/pages/articles.html.\n// Verbatim (Rule 1) - text and links as scraped, year-grouped exactly as the original."
)
gen(
    '/home/claude/work/parsed-commentaries.json',
    '/home/claude/work/mintzberg-site/mintzberg-site/lib/config/commentaries.ts',
    'COMMENTARIES_SEED',
    "// 89 commentaries across 25 years, parsed from sorted-assets/html/pages/commentaries.html.\n// Verbatim (Rule 1) - text and links as scraped, year-grouped exactly as the original."
)
