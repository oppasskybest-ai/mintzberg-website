import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client. Uses the anon key — safe to use in server
// components/route handlers that only read public content. The service
// role key (for admin CRUD writes) lives in lib/supabase/admin.ts instead,
// never imported into anything client-bundled.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase =
  url && anonKey ? createClient(url, anonKey) : null
