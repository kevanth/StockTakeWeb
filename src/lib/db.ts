// lib/db.ts
import { createClient } from '@supabase/supabase-js'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!  // This is server-side only

export const supabase = createClient(supabaseUrl, supabaseKey)
export async function createSupabaseServerClient() {
	const cookieStore = await cookies()
	return createServerComponentClient({
		cookies: () => Promise.resolve(cookieStore),
	})
}