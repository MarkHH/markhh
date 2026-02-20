import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Twitter Bookmark Manager — Never Lose a Great Tweet Again",
  description:
    "Automatically organize, categorize, and search your Twitter bookmarks with AI. Find any saved tweet instantly with semantic search.",
  openGraph: {
    title: "Twitter Bookmark Manager",
    description:
      "AI-powered organization for your Twitter bookmarks. Find any saved tweet instantly.",
    type: "website",
  },
};

function ClerkWrapper({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey || publishableKey.startsWith("pk_test_placeholder")) {
    return <>{children}</>;
  }
  return <ClerkProvider>{children}</ClerkProvider>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-surface-900 antialiased">
        <ClerkWrapper>{children}</ClerkWrapper>
      </body>
    </html>
  );
}
