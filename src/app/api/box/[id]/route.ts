import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { Box } from "@/types/models";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const box_name = searchParams.get("box_name");

    if (!box_name) {
      return NextResponse.json(
        { error: "Box name is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("boxes")
      .update({ name: box_name })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update box", error);
      throw new Error("Could not update box");
    }

    const box: Box = {
      id: data.id,
      name: data.name,
      owner_id: data.owner_id,
      created_at: data.created_at,
    };
    return NextResponse.json({ box }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("boxes").delete().eq("id", params.id);

    if (error) {
      console.error("Failed to delete box", error);
      throw new Error("Could not delete box");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
