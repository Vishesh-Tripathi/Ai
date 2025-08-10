
import { analyzeResume } from "@/lib/groq";
import { prisma } from "@/lib/prisma";
import supabase from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";


import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeText, role } = await req.json();

    // ✅ 1. Get user from Prisma
    const {data:user,error} = await supabase
    .from("User")
    .select("*")
    .eq("id", userId)
    .single();

    console.log("Analyzing resume for user:", userId, "Role:", role);

    if (!user) {
      return NextResponse.json({ error: "User not found in DB" }, { status: 404 });
    }

    // ✅ 2. Check if trial is already used
    if (user.plan === "trial" && user.resumeUsed===1) {
      return NextResponse.json({ error: "Trial resume analysis already used" }, { status: 403 });
    }

    // ✅ 3. Analyze resume
    const result = await analyzeResume(resumeText, role);

    
   
      await supabase
        .from("User")
        .update({ resumeUsed: user.resumeUsed + 1 })
        .eq("id", userId);

      const { error: insertError } = await supabase
        .from("ResumeAnalysis")
        .insert([
          {
            id:user.id,
            clerkId: user.id,
            resultSummary: typeof result === "string" ? result : JSON.stringify(result),
          },
        ]);

      if (insertError) {
        console.error("Error inserting into ResumeAnalysis:", insertError);
        return NextResponse.json(
          { success: false, error: "Failed to save analysis result" },
          { status: 500 }
        );
      }
 


   

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Resume analysis failed:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
