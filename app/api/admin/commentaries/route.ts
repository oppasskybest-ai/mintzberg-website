import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { isAuthenticated } from "@/lib/auth/session"
import { withTopOrderIndex } from "@/lib/admin/order"
import { revalidatePublic } from "@/lib/admin/revalidate"

const TABLE = "commentaries"

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { data, error } = await supabaseAdmin.from(TABLE).select("*").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const rawBody = await req.json()
  const body = await withTopOrderIndex(TABLE, rawBody)
  const { data, error } = await supabaseAdmin.from(TABLE).insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePublic(TABLE, [data?.slug])
  return NextResponse.json(data, { status: 201 })
}
