import json

with open('/home/claude/work/parsed-videos.json', encoding='utf-8') as f:
    data = json.load(f)

def ts_escape(s):
    if s is None:
        return 'null'
    s = s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
    return '`' + s + '`'

lines = []
lines.append("import type { VideoItem } from '@/types/content'")
lines.append("")
lines.append("// All 18 real videos, parsed from sorted-assets/html/pages/*.html")
lines.append("// (node-type-video pages). Deduped from 37 raw files.")
lines.append("export const VIDEOS_SEED: VideoItem[] = [")
for v in data['videos']:
    lines.append("  {")
    lines.append(f"    slug: {ts_escape(v['slug'])},")
    lines.append(f"    title: {ts_escape(v['title'])},")
    lines.append(f"    youtubeId: {ts_escape(v['youtubeId'])},")
    lines.append("  },")
lines.append("]")

with open('/home/claude/work/mintzberg-site/mintzberg-site/lib/config/videos.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')

print("Wrote", len(data['videos']), "videos")
