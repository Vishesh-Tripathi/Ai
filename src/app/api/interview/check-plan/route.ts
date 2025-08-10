import { prisma } from "@/lib/prisma";
import supabase from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
     const {userId} = await auth();
      console.log("Checking plan for user:", userId);
      console.log("DB URL:", process.env.DATABASE_URL);
      

       const { data: user, error } = await supabase 
       .from("User")
       .select("*")
       .eq("id", userId)
       .single();

      if (error || !user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if(user.plan === "trial" && user.interviewUsed >= 1){
          return NextResponse.json({ error: "Trial interview already used" }, { status: 403 });
      }

      return NextResponse.json({ plan: user.plan, interviewUsed: user.interviewUsed });
}