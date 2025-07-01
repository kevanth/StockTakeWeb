import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
		console.log("No tokens")
		return NextResponse.redirect(new URL("/login", req.url));
	}

	try {
		await verifyToken(token); 
		return NextResponse.next();
	} catch {
		console.log("Token failed")
		return NextResponse.redirect(new URL("/login", req.url));
	}
}

export const config = {
	matcher: ["/dashboard/:path*", "/inventory/:path*", "/api/item/:path*"],
};