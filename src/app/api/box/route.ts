import { NextResponse } from "next/server";
import { getBoxes } from "@/lib/items";

export async function GET() {
	try {
		const boxes = await getBoxes()
		return NextResponse.json({ boxes }, { status: 200 })
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error"
		return NextResponse.json({ error: message }, { status: 401 })
	}
}
