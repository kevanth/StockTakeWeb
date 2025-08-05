import { loginUser } from "@/lib/auth";
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json()

		const result = await loginUser(email, password)

		return NextResponse.json({ 
			success: true, 
			user: {
				id: result.user?.id,
				email: result.user?.email,
				username: result.user?.user_metadata?.username
			}
		})
	} catch (err) {
		const msg = err instanceof Error ? err.message : "Server error"

		// 401 status for auth errors vs 500 unknown errors
		const status = msg.includes("Invalid") || msg.includes("Invalid login credentials") 
			? 401 
			: 500

		console.error("❌ Login error:", err)
		return NextResponse.json({ error: msg }, { status })
	}
}