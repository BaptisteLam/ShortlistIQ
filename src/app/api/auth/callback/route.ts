import { createServerSupabaseClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createServerSupabaseClient();
    // Exchange the code — for server-side, we just redirect to the app
    // The client-side will handle the session
  }

  return NextResponse.redirect(`${origin}/app`);
}
