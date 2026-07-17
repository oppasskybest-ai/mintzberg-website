import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { isAuthenticated } from "@/lib/auth/session"

const TABLE = "blog_posts"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { slug } = await params
  try {
    const body = await req.json()
    const { data, error } = await supabaseAdmin.from(TABLE).update(body).eq("slug", slug).select().single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("[API /admin/blog-posts/[slug] PUT]", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { slug } = await params
  try {
    const { error } = await supabaseAdmin.from(TABLE).delete().eq("slug", slug)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API /admin/blog-posts/[slug] DELETE]", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
