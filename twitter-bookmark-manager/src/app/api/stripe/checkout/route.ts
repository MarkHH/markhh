import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { StripeService } from "@/services/stripe.service";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { priceType } = await req.json();

    if (!["monthly", "annual"].includes(priceType)) {
      return NextResponse.json(
        { error: "Invalid price type" },
        { status: 400 }
      );
    }

    const url = await StripeService.createCheckoutSession(
      user.id,
      priceType as "monthly" | "annual"
    );

    return NextResponse.json({ url });
  } catch (error) {
    console.error("POST /api/stripe/checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
