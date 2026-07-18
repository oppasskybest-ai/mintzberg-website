import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { isAuthenticated } from "@/lib/auth/session"
import { revalidatePublic } from "@/lib/admin/revalidate"
import { deriveSortDate } from "@/lib/admin/blogDate"

const TABLE = "blog_posts"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { slug } = await params
  try {
    const body = await req.json()
    if (body.sort_date === undefined || body.sort_date === null || body.sort_date === "") {
      body.sort_date = deriveSortDate(body.date)
    }
    const { data, error } = await supabaseAdmin.from(TABLE).update(body).eq("slug", slug).select().single()
    if (error) throw error
    revalidatePublic(TABLE, [slug, data?.slug])
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
    revalidatePublic(TABLE, [slug])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API /admin/blog-posts/[slug] DELETE]", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
