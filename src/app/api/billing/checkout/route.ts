import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { createCheckoutSession, createCustomer } from "@/lib/stripe";

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();

    // In production, get user from session
    // This is a simplified version
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const priceId = process.env.STRIPE_PRO_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe not configured." },
        { status: 500 }
      );
    }

    // For demo purposes, create a customer
    // In production, look up existing customer from profile
    const customer = await createCustomer("user@example.com", "demo-user-id");

    const session = await createCheckoutSession(
      customer.id,
      priceId,
      `${appUrl}/app/settings?success=true`,
      `${appUrl}/app/settings?canceled=true`
    );

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
