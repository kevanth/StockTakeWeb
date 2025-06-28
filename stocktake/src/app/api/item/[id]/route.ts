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
	{ params }: { params: { id: string } }  // `id` comes from the URL
) {
	try {
		const { name, count } = await req.json(); // get updated fields from body
		const id = Number(params.id);

		if (isNaN(id) || !name || count === undefined) {
			return NextResponse.json({ error: "Invalid input" }, { status: 400 });
		}

		const updatedItem = new Item(id, name, count);
		await updateItem("test",updatedItem);

		return NextResponse.json({ success: true });
	} catch (error: any) {
		console.error("PUT error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

