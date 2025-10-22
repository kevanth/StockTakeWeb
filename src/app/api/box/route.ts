import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // 1) Fetch boxes
    const { data: boxes, error: boxesError } = await supabase
      .from("boxes")
      .select("*");

    if (boxesError) {
      console.error("Failed to fetch boxes", boxesError);
      throw new Error("Could not load boxes");
    }

    const boxList = boxes ?? [];
    if (boxList.length === 0) {
      return NextResponse.json({ boxes: [] }, { status: 200 });
    }

    // 2) Fetch member profiles from the view for all box ids
    const boxIds = boxList.map((b) => b.id);
    const { data: memberRows, error: membersError } = await supabase
      .from("box_member_profiles")
      .select("*")
      .in("box_id", boxIds);

    if (membersError) {
      console.error("Failed to fetch box member profiles", membersError);
      throw new Error("Could not load box member profiles");
    }

    // 3) Group members by box_id and merge
    const membersByBoxId = new Map<string, any[]>();
    (memberRows ?? []).forEach((row: any) => {
      const key = row.box_id as string;
      if (!membersByBoxId.has(key)) membersByBoxId.set(key, []);
      membersByBoxId.get(key)!.push(row);
    });

    const boxesWithMembers = boxList.map((box) => ({
      ...box,
      members: membersByBoxId.get(box.id) ?? [],
    }));

    return NextResponse.json({ boxes: boxesWithMembers }, { status: 200 });
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
      return NextResponse.json(
        { error: "Box name is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("boxes")
      .insert({
        name: box_name,
      })
      .select();
    if (error) {
      console.error("Failed to create box", error);
      throw new Error("Could not create box");
    }

    if (!data || data.length === 0) {
      throw new Error("No data returned from box creation");
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

