import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();

    // Try as candidate ID first
    const { data: candidate } = await supabase
      .from("candidates")
      .select("*")
      .eq("id", id)
      .single();

    if (candidate) {
      // Generate a simple text report (for a real PDF, use a library like pdfkit)
      const report = generateCandidateReport(candidate);
      return new Response(report, {
        headers: {
          "Content-Type": "text/plain",
          "Content-Disposition": `attachment; filename="${candidate.candidate_name || "candidate"}-report.txt"`,
        },
      });
    }

    // Try as screening ID
    const { data: candidates } = await supabase
      .from("candidates")
      .select("*")
      .eq("screening_id", id)
      .order("score", { ascending: false });

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const report = generateScreeningReport(candidates);
    return new Response(report, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="screening-report-${id}.txt"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}

function generateCandidateReport(candidate: Record<string, unknown>): string {
  const analysis = candidate.analysis as Record<string, unknown> | undefined;
  const lines = [
    `CANDIDATE REPORT`,
    `================`,
    ``,
    `Name: ${candidate.candidate_name || "Unknown"}`,
    `Score: ${candidate.score}/100`,
    `Match Level: ${candidate.match_level}`,
    ``,
    `SUMMARY`,
    `-------`,
    analysis?.summary || "No summary available.",
    ``,
    `SKILLS MATCHED`,
    `--------------`,
    ...((analysis?.skills_matched as string[]) || []).map((s: string) => `  + ${s}`),
    ``,
    `SKILLS MISSING`,
    `--------------`,
    ...((analysis?.skills_missing as string[]) || []).map((s: string) => `  - ${s}`),
    ``,
    `EXPERIENCE`,
    `----------`,
    (analysis?.experience_match as string) || "N/A",
    ``,
    `STRENGTHS`,
    `---------`,
    ...((analysis?.strengths as string[]) || []).map((s: string) => `  + ${s}`),
    ``,
    `CONCERNS`,
    `--------`,
    ...((analysis?.concerns as string[]) || []).map((s: string) => `  - ${s}`),
    ``,
    `SUGGESTED INTERVIEW QUESTIONS`,
    `-----------------------------`,
    ...((analysis?.interview_questions as string[]) || []).map(
      (q: string, i: number) => `  ${i + 1}. ${q}`
    ),
  ];

  return lines.join("\n");
}

function generateScreeningReport(
  candidates: Record<string, unknown>[]
): string {
  const lines = [
    `SCREENING REPORT`,
    `================`,
    `Candidates screened: ${candidates.length}`,
    ``,
  ];

  candidates.forEach((c, i) => {
    const analysis = c.analysis as Record<string, unknown> | undefined;
    lines.push(`${i + 1}. ${c.candidate_name || "Unknown"} — Score: ${c.score}/100 (${c.match_level})`);
    lines.push(`   ${analysis?.summary || ""}`);
    lines.push(``);
  });

  return lines.join("\n");
}
