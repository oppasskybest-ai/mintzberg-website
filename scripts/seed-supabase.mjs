// Seeds Supabase with the parsed content (blog posts, books, videos).
// Run AFTER creating your Supabase project and running supabase/schema.sql
// — see SUPABASE_SETUP.md for the full walkthrough.
//
// Usage:
//   node scripts/seed-supabase.mjs
//
// Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL to be
// set — either export them in your shell, or this script will read them
// from .env.local automatically.

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Minimal .env.local loader (avoids adding a dotenv dependency just for
// this one-off script).
function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local')
  if (!existsSync(envPath)) return
  const content = readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}
loadEnvLocal()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n' +
    'Set them in .env.local first — see SUPABASE_SETUP.md step 3.'
  )
  process.exit(1)
}

// Service role key bypasses RLS entirely — this is a trusted, local-only
// script, never run this key in a browser context.
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function seedTable(table, jsonFile, batchSize = 50, conflictColumn = 'slug') {
  const filePath = path.join(ROOT, 'supabase', 'seed-data', jsonFile)
  const rows = JSON.parse(readFileSync(filePath, 'utf-8'))
  console.log(`\nSeeding ${table} (${rows.length} rows)...`)

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    const { error } = await supabase.from(table).upsert(batch, { onConflict: conflictColumn })
    if (error) {
      console.error(`  Batch ${i / batchSize + 1} failed:`, error.message)
      process.exitCode = 1
    } else {
      process.stdout.write(`  ${Math.min(i + batchSize, rows.length)}/${rows.length}\r`)
    }
  }
  console.log(`  Done: ${rows.length}/${rows.length}`)
}

async function main() {
  await seedTable('blog_posts', 'blog_posts.json')
  await seedTable('books', 'books.json')
  await seedTable('videos', 'videos.json')
  await seedTable('articles', 'articles.json')
  await seedTable('commentaries', 'commentaries.json')
  await seedTable('stories', 'stories.json')
  await seedTable('sculpture_images', 'sculpture_images.json', 50, 'image_url')
  await seedTable('site_pages', 'site_pages.json')
  console.log('\nAll done. The site will now read from Supabase instead of the local seed files.')
}

main()
