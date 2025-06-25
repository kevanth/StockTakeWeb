// app/api/inventory/[id]/route.ts
import { deleteItem } from "@/lib/items";
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
