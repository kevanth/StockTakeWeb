import Box from "@/class/box";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("boxes")
      .select("name, id, owner_id");
    if (error) {
      console.error("Failed to fetch boxes", error);
      throw new Error("Could not load boxes");
    }

    const boxes = data.map((b: Box) => new Box(b.id, b.name, b.owner_id));
    return NextResponse.json({ boxes }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const box_name = searchParams.get("box_name");
    
    if (!box_name) {
      return NextResponse.json({ error: "Box name is required" }, { status: 400 });
    }
    
    const supabase = await createClient();
    const { data, error } = await supabase.from("boxes").insert({
      name: box_name,
    }).select();
    if (error) {
      console.error("Failed to create box", error);
      throw new Error("Could not create box");
    }

    if (!data || data.length === 0) {
      throw new Error("No data returned from box creation");
    }

    const boxes = data.map((b : any) => new Box(b.id, b.name, b.owner_id));
    return NextResponse.json({ boxes }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
