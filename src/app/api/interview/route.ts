import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const userId = req.headers.get("user-id"); // Adjust if you use cookies/session/etc.
  console.log("Received request to update interview count for user:", userId);

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  // Fetch current interviewUsed value
  const { data, error } = await supabase
    .from("User")
    .select("interviewUsed")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "User not found or DB error", details: error }, { status: 500 });
  }

  // Increment and update
  const { error: updateError } = await supabase
    .from("User")
    .update({ interviewUsed: data.interviewUsed + 1 })
    .eq("id", userId);

  if (updateError) {
    return NextResponse.json({ error: "Failed to update interview count", details: updateError }, { status: 500 });
  }

  return NextResponse.json({ message: "Interview count updated successfully" });
}
