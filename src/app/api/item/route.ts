import Item from "@/class/Item";
import { addItem, getItems } from "@/lib/items";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const boxId = searchParams.get('boxId');
		
		const items: Item[] = await getItems(boxId || undefined);
		return NextResponse.json({ items }, { status: 200 });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error";
		return NextResponse.json({ error: "Failed to fetch items: " + message }, { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const { name, count, boxId } = await req.json();

		if (!name || !boxId) {
			return NextResponse.json({ error: "Name and boxId are required" }, { status: 400 });
		}

		const item = new Item("", name, count || 0, "", "");
		await addItem(item, boxId);

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error";
		return NextResponse.json({ error: "Failed to add items: " + message }, { status: 500 });
	}
}