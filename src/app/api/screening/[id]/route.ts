import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();

    const [screeningRes, candidatesRes] = await Promise.all([
      supabase.from("screenings").select("*").eq("id", id).single(),
      supabase
        .from("candidates")
        .select("*")
        .eq("screening_id", id)
        .order("score", { ascending: false }),
    ]);

    if (!screeningRes.data) {
      return NextResponse.json(
        { error: "Screening not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      screening: screeningRes.data,
      candidates: candidatesRes.data || [],
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
