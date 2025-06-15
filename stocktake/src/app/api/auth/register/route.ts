import { NextResponse } from "next/server"
import { registerUser } from "@/lib/auth/register"

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json()

		if (!email || !password) {
			return NextResponse.json({ error: "Missing fields" }, { status: 400 })
		}

		await registerUser(email, password)

		return NextResponse.json({ success: true }, { status: 201 })
	} catch (err: any) {
		const msg = err instanceof Error ? err.message : "Server error"

		// Choose status based on known errors
		const status = msg === "Email already registered"
			? 400
			: 500

		console.error("❌ Registration error:", err)
		return NextResponse.json({ error: msg }, { status })
	}
}
