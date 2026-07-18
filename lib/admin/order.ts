import { supabaseAdmin } from "@/lib/supabase/server"

/**
 * Auto-assigns an order_index that puts a brand-new row above every
 * existing row in the table, so "add a new post/book/video/article" shows
 * up at the very top of its section without the admin having to type
 * anything. Only runs when the caller didn't already supply an
 * order_index (a blank/undefined value) — an explicit value (including 0
 * or a positive number) is always respected, since that's the admin
 * deliberately placing the item somewhere specific.
 */
export async function withTopOrderIndex<T extends Record<string, unknown>>(
  table: string,
  body: T
): Promise<T> {
  const provided = body["order_index"]
  if (provided !== undefined && provided !== null && provided !== ("" as unknown)) {
    return { ...body, order_index: Number(provided) }
  }
  const { data } = await supabaseAdmin
    .from(table)
    .select("order_index")
    .order("order_index", { ascending: true, nullsFirst: false })
    .limit(1)
  const currentMin = data && data.length > 0 && data[0].order_index !== null ? Number(data[0].order_index) : 0
  return { ...body, order_index: currentMin - 1 }
}
