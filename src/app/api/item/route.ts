import { createClient } from "@/lib/supabase/server";
import { NewItem } from "@/types/models";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const boxId = searchParams.get("boxId");
    console.log("boxId: " + boxId);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("box_id", boxId);

    const items = data || [];

    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { item }: { item: NewItem } = await req.json();
    console.log(item);
    const supabase = await createClient();
    const { data, error } = await supabase.from("items").insert(item).select();

    if (error) {
      throw error;
    }
    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
