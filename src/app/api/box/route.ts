import Box from "@/class/box";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
	try {  
		const supabase = await createClient()
		const { data, error } = await supabase
		.from("boxes")
		.select("name, id, owner_id")
	if (error) {
		console.error("Failed to fetch boxes", error)
		throw new Error("Could not load boxes")
	}

	const boxes =  data.map((b) => new Box(b.id, b.name, b.owner_id))
	return NextResponse.json({ boxes }, { status: 200 })
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error"
		return NextResponse.json({ error: message }, { status: 401 })
	}
}
