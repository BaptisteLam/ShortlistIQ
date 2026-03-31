import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const authHeader = request.headers.get("authorization");

    // Get user from cookie/session
    const { jobTitle, jobDescription, extractedCriteria, totalResumes } =
      await request.json();

    if (!jobTitle || !jobDescription) {
      return NextResponse.json(
        { error: "Job title and description are required." },
        { status: 400 }
      );
    }

    // For now, extract user_id from the auth header or use a placeholder
    // In production, this would use proper session management
    const { data, error } = await supabase
      .from("screenings")
      .insert({
        job_title: jobTitle,
        job_description: jobDescription,
        extracted_criteria: extractedCriteria || {},
        total_resumes: totalResumes || 0,
        status: "draft",
        user_id: authHeader, // This will be properly set via RLS
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Something went wrong. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
