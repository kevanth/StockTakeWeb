// app/api/inventory/[id]/route.ts
import Item from "@/class/Item";
import { deleteItem, updateItem } from "@/lib/items";
import { NextResponse } from "next/server";

export async function DELETE(
	req: Request,
	{ params }: { params: { id: number } }
) {
	try {
		const id = Number(params.id);
		if (isNaN(id)) {
			return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
		}
		await deleteItem(id);
		return NextResponse.json({ success: true });
	} catch (error: any) {
		console.error("DELETE error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function PUT(
	req: Request,
	context: { params: { id: string } }  // `id` comes from the URL
) {
	try {
		const username = req.headers.get("x-username")
		if (!username) {
			return NextResponse.json({ error: "Username is required" }, { status: 400 });
		}
		const { name, count, category, description } = await req.json(); // get updated fields from body
		const params = await context.params;
		const id = Number(params.id)

		if (isNaN(id) || !name || count === undefined) {
			return NextResponse.json({ error: "Invalid input" }, { status: 400 });
		}

		const updatedItem = new Item(id, name, count, category, description);
		await updateItem(username,updatedItem);

		return NextResponse.json({ success: true });
	} catch (error: any) {
		console.error("PUT error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

