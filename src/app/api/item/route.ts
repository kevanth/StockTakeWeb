import Item from "@/class/Item";
import { addItem, getItems } from "@/lib/items";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const username = req.headers.get("x-username")
	
	if (!username) {
		return NextResponse.json({ error: "Username is required" }, { status: 400 });
	}

	try {
		const items:Item[] = await getItems(username);
		return NextResponse.json({ items }, { status: 200 });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unexpected error";
		return NextResponse.json({ error: "Failed to fetch items: " + message }, { status: 500 });
	}
}

export async function POST(req: Request) {
	const username = req.headers.get("x-username")
	if (!username) {
		return NextResponse.json({ error: "Username is required" }, { status: 400 });
	}
	try {
		const {  name, count } = await req.json();

		const item = new Item(0, name, count, "", "");
		await addItem(username, item);

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unexpected error";
		return NextResponse.json({ error: "Failed to add items: " + message }, { status: 500 });
	}
}