import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const eventType = payload.type;

    if (eventType === "user.created") {
      const { id, email_addresses, external_accounts } = payload.data;

      const email = email_addresses?.[0]?.email_address ?? null;
      const twitterAccount = external_accounts?.find(
        (a: Record<string, string>) => a.provider === "oauth_twitter"
      );

      await prisma.user.upsert({
        where: { clerkId: id },
        create: {
          clerkId: id,
          email,
          twitterId: twitterAccount?.provider_user_id ?? null,
          twitterUsername: twitterAccount?.username ?? null,
        },
        update: {
          email,
          twitterId: twitterAccount?.provider_user_id ?? null,
          twitterUsername: twitterAccount?.username ?? null,
        },
      });
    }

    if (eventType === "user.updated") {
      const { id, email_addresses, external_accounts } = payload.data;

      const email = email_addresses?.[0]?.email_address ?? null;
      const twitterAccount = external_accounts?.find(
        (a: Record<string, string>) => a.provider === "oauth_twitter"
      );

      await prisma.user.upsert({
        where: { clerkId: id },
        create: {
          clerkId: id,
          email,
          twitterId: twitterAccount?.provider_user_id ?? null,
          twitterUsername: twitterAccount?.username ?? null,
        },
        update: {
          email,
          twitterId: twitterAccount?.provider_user_id ?? null,
          twitterUsername: twitterAccount?.username ?? null,
        },
      });
    }

    if (eventType === "user.deleted") {
      const { id } = payload.data;
      await prisma.user
        .delete({ where: { clerkId: id } })
        .catch(() => {});
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
