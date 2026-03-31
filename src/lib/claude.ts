import Anthropic from "@anthropic-ai/sdk";
import type { ExtractedCriteria } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function extractCriteria(
  jobDescription: string
): Promise<ExtractedCriteria> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system:
      'You are a senior technical recruiter. Extract structured hiring criteria from this job description. Return JSON only, no markdown.',
    messages: [
      {
        role: "user",
        content: jobDescription,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(text);
}

export async function extractResumeText(
  pdfBase64: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system:
      "Extract all text content from this resume PDF. Return the raw text only, preserving section structure with line breaks. Do not summarize or interpret.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: pdfBase64,
            },
          },
        ],
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}

export async function screenResume(
  criteria: ExtractedCriteria,
  resumeText: string
): Promise<{
  candidate_name: string;
  score: number;
  match_level: "strong" | "moderate" | "weak";
  summary: string;
  skills_matched: string[];
  skills_missing: string[];
  experience_match: string;
  strengths: string[];
  concerns: string[];
  interview_questions: string[];
}> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: `You are a senior technical recruiter reviewing a resume against specific job requirements. Be precise and objective. Score based on evidence in the resume only — do not infer or assume skills not explicitly mentioned. Return JSON only.

Output format:
{
  "candidate_name": "string",
  "score": number (0-100),
  "match_level": "strong" | "moderate" | "weak",
  "summary": "2-3 sentence assessment",
  "skills_matched": ["skill1", "skill2"],
  "skills_missing": ["skill3", "skill4"],
  "experience_match": "Brief assessment of experience relevance",
  "strengths": ["strength1", "strength2"],
  "concerns": ["concern1"],
  "interview_questions": ["question1", "question2", "question3"]
}

Scoring guide:
- 80-100: Strong match. Meets all must-haves and most nice-to-haves.
- 60-79: Moderate match. Meets most must-haves, some gaps.
- 40-59: Weak match. Missing several must-haves.
- 0-39: Poor match. Does not meet basic requirements.`,
    messages: [
      {
        role: "user",
        content: `JOB CRITERIA:\n${JSON.stringify(criteria, null, 2)}\n\nRESUME TEXT:\n${resumeText}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(text);
}
