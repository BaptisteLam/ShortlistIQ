import { NextResponse } from "next/server";
import { createBillingPortalSession } from "@/lib/stripe";

export async function POST() {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // In production, get customer ID from user profile
    const customerId = ""; // Would be fetched from profile.stripe_customer_id

    if (!customerId) {
      return NextResponse.json(
        { error: "No billing account found." },
        { status: 400 }
      );
    }

    const session = await createBillingPortalSession(
      customerId,
      `${appUrl}/app/settings`
    );

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
