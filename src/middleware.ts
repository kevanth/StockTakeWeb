import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
	const token = req.cookies.get("auth_token")?.value;
	const isApi = req.nextUrl.pathname.startsWith("/api");

	if (!token) {
		if (isApi) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		return NextResponse.redirect(new URL("/login", req.url));
	}

	try {
		const payload = await verifyToken(token);
		const username = payload.sub;
		if (!username) throw new Error("Token missing username");

		const res = NextResponse.next();
		res.headers.set("x-username", username);
		return res;
	} catch {
		if (isApi) {
			return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
		}
		return NextResponse.redirect(new URL("/login", req.url));
	}
}


export const config = {
	matcher: ["/dashboard/:path*", "/inventory/:path*", "/api/item/:path*"],
};