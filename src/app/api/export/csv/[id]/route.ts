import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();

    const { data: candidates } = await supabase
      .from("candidates")
      .select("*")
      .eq("screening_id", id)
      .order("score", { ascending: false });

    if (!candidates || candidates.length === 0) {
      return NextResponse.json(
        { error: "No candidates found." },
        { status: 404 }
      );
    }

    const headers = [
      "Rank",
      "Candidate Name",
      "Score",
      "Match Level",
      "Skills Matched",
      "Skills Missing",
      "Summary",
    ];

    const rows = candidates.map((c, i) => [
      i + 1,
      c.candidate_name || "Unknown",
      c.score ?? "",
      c.match_level || "",
      (c.analysis?.skills_matched || []).join("; "),
      (c.analysis?.skills_missing || []).join("; "),
      `"${(c.analysis?.summary || "").replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    );

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="screening-${id}.csv"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
