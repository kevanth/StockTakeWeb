import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/db";

export async function middleware(req: NextRequest) {
	// Only protect API routes
	if (!req.nextUrl.pathname.startsWith("/api")) {
		return NextResponse.next();
	}
	
	// Get the authorization header for API calls
	const authHeader = req.headers.get("authorization");
	
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const token = authHeader.substring(7); // Remove "Bearer " prefix

	try {
		// Check if supabaseAdmin is available (server-side only)
		if (!supabaseAdmin) {
			throw new Error("Server configuration error");
		}

		// Verify the JWT token with Supabase
		const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
		
		if (error || !user) {
			throw new Error("Invalid token");
		}

		const res = NextResponse.next();
		res.headers.set("x-user-id", user.id);
		return res;
	} catch (error) {
		console.log("Token validation failed:", error);
		return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
	}
}

export const config = {
	matcher: ["/api/item/:path*", "/api/category/:path*"],
};