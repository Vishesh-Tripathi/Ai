import supabase from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch Resume Analysis
    console.log("Fetching recent activity for user:", userId);
    const { data: resumeData, error: resumeError } = await supabase
      .from("ResumeAnalysis")
      .select("*")
      .eq("clerkId", userId)
      .order("createdAt", { ascending: false })
      .limit(10);


       console.log("Fetching recent activity for user:", userId);
       console.log("Resume Data:", resumeData);
    if (resumeError) {
      console.error("Error fetching resume data:", resumeError);
      return NextResponse.json(
        { error: "Failed to fetch resume activity" },
        { status: 500 }
      );
    }

    // Fetch Interview Analysis
    const { data: interviewData, error: interviewError } = await supabase
      .from("InterviewAnalysis")
      .select("*")
      .eq("clerkId", userId)
      .order("createdAt", { ascending: false })
      .limit(10);

    if (interviewError) {
      console.error("Error fetching interview data:", interviewError);
      return NextResponse.json(
        { error: "Failed to fetch interview activity" },
        { status: 500 }
      );
    }

    // Check if both are empty
    if (!resumeData.length && !interviewData.length) {
      return NextResponse.json(
        { message: "No recent activity found" },
        { status: 404 }
      );
    }

    // Final structured response
    const responseData = {
      resume: resumeData,
      interview: interviewData
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
