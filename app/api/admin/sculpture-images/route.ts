import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { isAuthenticated } from '@/lib/auth/session'
import { revalidatePublic } from '@/lib/admin/revalidate'

function coerce(body: Record<string, unknown>) {
  if (body.sort_order !== undefined) body.sort_order = Number(body.sort_order) || 0
  return body
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await supabaseAdmin.from('sculpture_images').select('*').order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = coerce(await req.json())
  delete body.id // let the DB generate it
  const { data, error } = await supabaseAdmin.from('sculpture_images').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePublic('sculpture_images')
  return NextResponse.json(data, { status: 201 })
}
