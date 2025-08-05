import { NextResponse } from "next/server";
import { getBoxes, createBox } from "@/lib/boxes";

export async function GET(req: Request) {
	try {
		const boxes = await getBoxes(ownerId || undefined);
		return NextResponse.json({ boxes }, { status: 200 });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error";
		return NextResponse.json({ error: "Failed to fetch boxes: " + message }, { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const { name } = await req.json();

		if (!name) {
			return NextResponse.json({ error: "Box name is required" }, { status: 400 });
		}

		const box = await createBox(name);
		return NextResponse.json({ box }, { status: 201 });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error";
		return NextResponse.json({ error: "Failed to create box: " + message }, { status: 500 });
	}
} 