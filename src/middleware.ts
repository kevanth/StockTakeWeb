import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
	const res = NextResponse.next()

	// Attach Supabase session to request
	const supabase = createMiddlewareClient({ req, res })

	await supabase.auth.getSession()
	return res
}

// Enable middleware for all routes you want protected
export const config = {
	matcher: [
		'/inventory/:path*',
		'/api/:path*',
		'/dashboard/:path*',
		// add more if needed
	],
}
