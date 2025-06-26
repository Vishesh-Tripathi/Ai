
import { analyzeResume } from "@/lib/groq";
import { prisma } from "@/lib/prisma";
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
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found in DB" }, { status: 404 });
    }

    // ✅ 2. Check if trial is already used
    if (user.plan === "trial" && user.resumeUsed) {
      return NextResponse.json({ error: "Trial resume analysis already used" }, { status: 403 });
    }

    // ✅ 3. Analyze resume
    const result = await analyzeResume(resumeText, role);

    // ✅ 4. Mark trial as used (if applicable)
    if (user.plan === "trial") {
      await prisma.user.update({
        where: { clerkId: userId },
        data: { resumeUsed: 1 },
      });
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
