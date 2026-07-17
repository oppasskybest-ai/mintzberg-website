import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { isAuthenticated } from '@/lib/auth/session'

function coerce(body: Record<string, unknown>) {
  if (body.sort_order !== undefined) body.sort_order = Number(body.sort_order) || 0
  return body
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    const body = coerce(await req.json())
    delete body.id
    const { data, error } = await supabaseAdmin.from('sculpture_images').update(body).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('[API /admin/sculpture-images/[id] PUT]', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    const { error } = await supabaseAdmin.from('sculpture_images').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API /admin/sculpture-images/[id] DELETE]', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
