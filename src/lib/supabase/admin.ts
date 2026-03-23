import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

function getAdminConfig() {
  const supabaseUrl    = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase admin environment variables')
  }
  return { supabaseUrl, serviceRoleKey }
}

// Service role client (typed) — for tables defined in Database type
export function createAdminClient() {
  const { supabaseUrl, serviceRoleKey } = getAdminConfig()
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// Service role client (untyped) — for new tables not yet in generated types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createAdminClientAny(): any {
  const { supabaseUrl, serviceRoleKey } = getAdminConfig()
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
