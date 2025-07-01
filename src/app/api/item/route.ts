import Item from "@/class/Item";
import { addItem, getItems } from "@/lib/items";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const token = req.headers.get("authorization")?.split(" ")[1];
	if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const payload = await verifyToken(token);
	const username = payload.sub;
	
	if (!username) {
		return NextResponse.json({ error: "Username is required" }, { status: 400 });
	}

	try {
		const items:Item[] = await getItems(username);
		return NextResponse.json({ items }, { status: 200 });
	} catch (error) {
		console.error("Error fetching items:", error);
		return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
	}
}

export async function POST(req: Request) {
	const username = req.headers.get("username")
	if (!username) {
		return NextResponse.json({ error: "Username is required" }, { status: 400 });
	}
	try {
		const {  name, count } = await req.json();

		const item = new Item(0, name, count);
		await addItem(username, item);

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error: any) {
		console.error("API error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}