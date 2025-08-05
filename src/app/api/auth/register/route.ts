import { registerUser } from "@/lib/auth";
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const { username, email, password } = await req.json()

		const result = await registerUser(username, email, password)

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

		// 400 status for validation errors vs 500 unknown errors
		const status = msg.includes("already registered") || msg.includes("Invalid") 
			? 400 
			: 500

		console.error("❌ Register error:", err)
		return NextResponse.json({ error: msg }, { status })
	}
}
