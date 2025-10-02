import { createClient } from "@/lib/supabase/server";
import { NewItem } from "@/types/models";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("items").delete().eq("id", params.id);

    if (error) {
      throw new Error("Could not delete item");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await req.json();
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("items")
      .update({
        name: payload.name,
        quantity_mode: payload.quantity_mode,
        quantity_value: payload.quantity_value,
        reorder_level: payload.reorder_level,
        category: payload.category,
        description: payload.description,
        image_url: payload.image_url,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.log("error", error);
      throw new Error("Could not update item");
    }

    return NextResponse.json({ item: data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}