import { NextResponse } from "next/server";
import { getBox, updateBox, deleteBox } from "@/lib/boxes";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const box = await getBox(params.id);
		
		if (!box) {
			return NextResponse.json({ error: "Box not found" }, { status: 404 });
		}
		return NextResponse.json({ box }, { status: 200 });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error";
		return NextResponse.json({ error: "Failed to fetch box: " + message }, { status: 500 });
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { name } = await req.json();

		if (!name) {
			return NextResponse.json({ error: "Box name is required" }, { status: 400 });
		}

		const box = await updateBox(params.id, name);
		return NextResponse.json({ box }, { status: 200 });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error";
		return NextResponse.json({ error: "Failed to update box: " + message }, { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await deleteBox(params.id);
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error";
		return NextResponse.json({ error: "Failed to delete box: " + message }, { status: 500 });
	}
}
