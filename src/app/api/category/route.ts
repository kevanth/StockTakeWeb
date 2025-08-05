import { NextResponse } from "next/server";
import { getCategories } from "@/lib/items";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const boxId = searchParams.get('boxId');
        
        const categories: string[] = await getCategories(boxId || undefined);
        return NextResponse.json({ categories }, { status: 200 });
    } catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error";
        return NextResponse.json({ error: "Failed to fetch categories: " + message }, { status: 500 });
    }
}