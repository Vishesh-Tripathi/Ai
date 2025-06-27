import { Webhook } from "svix";
import { headers } from "next/headers";
import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("🚀 Webhook route hit");

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("❌ WEBHOOK_SECRET not set in env.");
    return new Response("Webhook secret not set", { status: 500 });
  }

  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_signature = (await headerPayload).get("svix-signature");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");

  console.log("📥 Headers:", { svix_id, svix_signature, svix_timestamp });

  if (!svix_id || !svix_signature || !svix_timestamp) {
    console.error("❌ Missing svix headers");
    return new Response("Missing svix headers", { status: 400 });
  }

  let payloadText;
  try {
    payloadText = await req.text(); // Raw body text for verification
    console.log("📦 Raw Payload Text:", payloadText);
  } catch (err) {
    console.error("❌ Error reading request body:", err);
    return new Response("Bad request body", { status: 400 });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    evt = wh.verify(payloadText, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
    console.log("✅ Webhook verified:", evt.type);
  } catch (err) {
    console.error("❌ Error verifying webhook:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (evt.type === "user.created") {
    const userData = {
      id: evt.data.id,
      clerkId: evt.data.id,
      email: evt.data.email_addresses?.[0]?.email_address || null,
    };

    console.log("📄 Inserting into Supabase:", userData);

    const { error, data } = await supabase.from("User").insert([userData]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
    } else {
      console.log("✅ Supabase insert successful:", data);
    }
  } else {
    console.log("ℹ️ Ignored event type:", evt.type);
  }

  console.log("✅ Webhook finished.");
  return NextResponse.json({ success: true });
}
