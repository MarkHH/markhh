import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { StripeService } from "@/services/stripe.service";

export async function POST() {
  try {
    const user = await requireUser();
    const url = await StripeService.createPortalSession(user.id);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("POST /api/stripe/portal error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
