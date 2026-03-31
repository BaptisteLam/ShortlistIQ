import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { extractResumeText, screenResume } from "@/lib/claude";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const screeningId = formData.get("screeningId") as string;
  const resumes = formData.getAll("resumes") as File[];

  if (!screeningId || resumes.length === 0) {
    return new Response(
      JSON.stringify({ error: "Screening ID and resumes are required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabase = createServerSupabaseClient();

  // Get screening criteria
  const { data: screening } = await supabase
    .from("screenings")
    .select("extracted_criteria")
    .eq("id", screeningId)
    .single();

  if (!screening) {
    return new Response(
      JSON.stringify({ error: "Screening not found." }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  // Update status to processing
  await supabase
    .from("screenings")
    .update({ status: "processing" })
    .eq("id", screeningId);

  // Stream results back using ReadableStream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for (let i = 0; i < resumes.length; i++) {
          const file = resumes[i];

          // Send progress update
          const progress = Math.round(((i + 0.5) / resumes.length) * 100);
          controller.enqueue(
            encoder.encode(
              JSON.stringify({ type: "progress", progress }) + "\n"
            )
          );

          // Convert PDF to base64
          const buffer = await file.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");

          // Extract text from PDF
          const resumeText = await extractResumeText(base64);

          // Screen the resume
          const result = await screenResume(
            screening.extracted_criteria,
            resumeText
          );

          // Save candidate to database
          const { data: candidate } = await supabase
            .from("candidates")
            .insert({
              screening_id: screeningId,
              file_name: file.name,
              candidate_name: result.candidate_name,
              score: result.score,
              match_level: result.match_level,
              analysis: {
                summary: result.summary,
                skills_matched: result.skills_matched,
                skills_missing: result.skills_missing,
                experience_match: result.experience_match,
                interview_questions: result.interview_questions,
                strengths: result.strengths,
                concerns: result.concerns,
              },
              resume_text: resumeText,
            })
            .select("*")
            .single();

          // Send candidate result
          if (candidate) {
            controller.enqueue(
              encoder.encode(
                JSON.stringify({ type: "candidate", candidate }) + "\n"
              )
            );
          }

          // Send final progress
          const finalProgress = Math.round(((i + 1) / resumes.length) * 100);
          controller.enqueue(
            encoder.encode(
              JSON.stringify({ type: "progress", progress: finalProgress }) +
                "\n"
            )
          );
        }

        // Update screening status
        await supabase
          .from("screenings")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", screeningId);

        // Update user usage
        const { data: screeningData } = await supabase
          .from("screenings")
          .select("user_id")
          .eq("id", screeningId)
          .single();

        if (screeningData?.user_id) {
          await supabase.rpc("increment_screens_used", {
            user_id_input: screeningData.user_id,
            count: resumes.length,
          });
        }

        controller.close();
      } catch (err) {
        // Update status to failed
        await supabase
          .from("screenings")
          .update({ status: "failed" })
          .eq("id", screeningId);

        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: "error",
              error: "Something went wrong. Try again.",
            }) + "\n"
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
