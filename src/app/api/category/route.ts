import { NextResponse } from "next/server";
import { getCategories } from "@/lib/items";

export async function GET(req: Request) {
    const username = req.headers.get("x-username")
    
    if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    try {
        const categories:string[] = await getCategories(username);
        return NextResponse.json({ categories }, { status: 200 });
    } catch (error) {
        console.error("Error fetching items:", error);
        
        return NextResponse.json({ error: "Failed to fetch items: " + error.message }, { status: 500 });
    }
}