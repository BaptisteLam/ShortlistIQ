import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { jobTitle, jobDescription, extractedCriteria, totalResumes } =
      await request.json();

    if (!jobTitle || !jobDescription) {
      return NextResponse.json(
        { error: "Job title and description are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("screenings")
      .insert({
        job_title: jobTitle,
        job_description: jobDescription,
        extracted_criteria: extractedCriteria || {},
        total_resumes: totalResumes || 0,
        status: "draft",
        user_id: user.id,
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
