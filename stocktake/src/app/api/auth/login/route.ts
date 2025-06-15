import { loginUser } from "@/lib/auth";
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json()

		const result = await loginUser(email, password)

		const res = NextResponse.json({ success: true })
		res.cookies.set('auth_token', result.userId, {
			httpOnly: true,
			path: '/',
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
		})

		return res
	} catch (err) {
        const msg = err instanceof Error ? err.message : "Server error"

		// 401 status for known vs 500 unknown errors
		const status = msg === "Invalid email or password"
			? 401
			: 500

		console.error("❌ Login error:", err)
		return NextResponse.json({ error: msg }, { status })
	}
}