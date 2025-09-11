import { createClient, getUserServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { user: currUser } = await getUserServer();
    const supabase = await createClient();
    const { data: user, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", currUser?.id)
      .single();

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json(
      { error: "Failed to fetch user info: " + errMessage },
      { status: 500 }
    );
  }
}
