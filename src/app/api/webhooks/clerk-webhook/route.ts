import { Webhook } from "svix";
import { headers } from "next/headers";
import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if(!WEBHOOK_SECRET){
        return new Response('Webhook secret not set', {status: 500});
    }
    const headerpayload  = headers();
    const svix_id = (await headerpayload).get('svix-id');
    const svix_signature = (await headerpayload).get('svix-signature');
    const svix_timestamp = (await headerpayload).get('svix-timestamp');

     if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  const payload =await req.json();
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(JSON.stringify(payload), {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }
  if (evt.type === 'user.created') {
    try {
      await supabase.from('users').insert([
        {
          clerk_id: evt.data.id,
          email: evt.data.email_addresses[0]?.email_address,
        },
      ]);
      console.log('User created in DB:', evt.data.id);
    } catch (error) {
      console.error('Error creating user in DB:', error);
    }
  }

  return NextResponse.json({ success: true });
}