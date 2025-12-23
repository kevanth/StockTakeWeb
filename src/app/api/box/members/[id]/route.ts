import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { BoxMember } from "@/types/models";

export async function POST(
  req: Request,
  { params }: { params: { id: string } } //boxid
) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("username");

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const supabase = await createClient();

    // Fetch user by email
    const { data: users, error: userError } = await supabase
      .from("profiles")
      .select("userid")
      .eq("email", email)
      .single();

    if (userError || !users) {
      console.error("Failed to fetch user", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = users.userid;

    // Add member to box
    const { error: insertError } = await supabase.from("box_members").insert({
      box_id: params.id,
      user_id: userId,
    });

    if (insertError) {
      console.error("Failed to add member to box", insertError);
      throw new Error("Could not add member to box");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
