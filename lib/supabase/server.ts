import { createClient } from '@supabase/supabase-js'

// Service-role client for admin API routes only — never imported into
// anything client-bundled. Bypasses RLS entirely (see supabase/schema.sql
// comments on why no admin write policy exists there: this client doesn't
// need one).
//
// Uses placeholder values when env vars aren't set yet, rather than
// throwing at import time — that would crash the whole build/dev server
// (including every public page) just because Supabase hasn't been
// configured. Admin routes will get a real connection error at request
// time instead, which is the correct place for that failure to surface.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})
