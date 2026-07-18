/**
 * The blog's `date` column is free text (kept verbatim, e.g. "16 July
 * 2026", to match the source exactly) but ordering runs off `sort_date`,
 * a real parsed date. The admin form only asks for the free-text date —
 * this derives sort_date from it automatically so nobody has to fill in
 * two date fields for one post. If the text can't be parsed, sort_date is
 * left unset and the post falls back to the manual order_index / created_at
 * behavior instead of silently sorting to the bottom.
 */
export function deriveSortDate(dateText: unknown): string | null {
  if (typeof dateText !== 'string' || !dateText.trim()) return null
  const t = Date.parse(dateText)
  if (Number.isNaN(t)) return null
  return new Date(t).toISOString().slice(0, 10)
}
