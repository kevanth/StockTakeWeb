import Item from "@/class/Item";
import { getItems } from "@/lib/items";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const username = searchParams.get("username");

	if (!username) {
		return NextResponse.json({ error: "Username is required" }, { status: 400 });
	}

	try {
        console.log("username: " + username)
		const items:Item[] = await getItems(username);
		return NextResponse.json({ items }, { status: 200 });
	} catch (error) {
		console.error("Error fetching items:", error);
		return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
	}
}
