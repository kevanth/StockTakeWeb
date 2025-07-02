import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { error } from "console";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
		console.log("No tokens")
		return NextResponse.redirect(new URL("/login", req.url));
	}

	try {
		const payload = await verifyToken(token); 
		const username = payload.sub
		if(!username){throw(error("Token payload did not contain username"))}
		const res =  NextResponse.next();
		res.headers.set("x-username",username)
		return res;
	} catch {
		console.log("Token failed")
		return NextResponse.redirect(new URL("/login", req.url));
	}
}

export const config = {
	matcher: ["/dashboard/:path*", "/inventory/:path*", "/api/item/:path*"],
};