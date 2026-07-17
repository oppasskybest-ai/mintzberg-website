import { NextResponse } from 'next/server'
import { buildSearchIndex } from '@/lib/search/build-index'

// Revalidates every hour — content doesn't change often enough to need
// per-request rebuilding, and rebuilding on every search page load would
// mean hitting every data source (6 of them) on every visit.
export const revalidate = 3600

export async function GET() {
  const index = await buildSearchIndex()
  return NextResponse.json(index)
}
