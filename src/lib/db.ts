// lib/db.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // for admin use only
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!  

// 🛠️ Supabase Admin client (service role - server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export const supabase = createClient(supabaseUrl, supabaseKey)
