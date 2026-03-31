import { NextRequest, NextResponse } from "next/server";
import { extractCriteria } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const { jobDescription } = await request.json();

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required." },
        { status: 400 }
      );
    }

    const criteria = await extractCriteria(jobDescription);
    return NextResponse.json(criteria);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
