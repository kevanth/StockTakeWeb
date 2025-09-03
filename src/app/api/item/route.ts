import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)
		const boxId = searchParams.get("boxId")
		console.log("boxId: "+ boxId)
		const supabase = await createClient()
		const { data, error } = await supabase
		.from("items")
		.select("*")
		.eq("box_id", boxId)
		
		const items =  data || []

		return NextResponse.json({ items }, { status: 200 })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unexpected error";
		return NextResponse.json({ error: "Failed to fetch items: " + message }, { status: 500 });
	}
}

// export async function POST(req: Request) {
// 	const username = req.headers.get("x-username")
// 	if (!username) {
// 		return NextResponse.json({ error: "Username is required" }, { status: 400 });
// 	}
// 	try {
// 		const {  name, count } = await req.json();

// 		const item = new Item(0, name, count, "", "");
// 		await addItem(username, item);

// 		return NextResponse.json({ success: true }, { status: 200 });
// 	} catch (error: unknown) {
// 		const message = error instanceof Error ? error.message : "Unexpected error";
// 		return NextResponse.json({ error: "Failed to add items: " + message }, { status: 500 });
// 	}
// }