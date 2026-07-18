import { NextResponse } from 'next/server'
import { buildSearchIndex } from '@/lib/search/build-index'

// On-demand revalidated the moment any admin save/delete happens (see
// lib/admin/revalidate.ts), so this number is just a safety-net ceiling,
// not the primary freshness mechanism — kept short so even a missed
// revalidate call self-heals quickly, without rebuilding on every visit.
export const revalidate = 300

export async function GET() {
  const index = await buildSearchIndex()
  return NextResponse.json(index)
}
