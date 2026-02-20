"use client";

import { useState, useEffect } from "react";
import { UserProfile, useUser } from "@clerk/nextjs";
import {
  CreditCard,
  User,
  BookmarkCheck,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"account" | "subscription">(
    "account"
  );
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState<string | null>(null);

  async function handleManageSubscription() {
    setIsLoadingPortal(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to open portal:", error);
    } finally {
      setIsLoadingPortal(false);
    }
  }

  async function handleSubscribe(priceType: "monthly" | "annual") {
    setIsLoadingCheckout(priceType);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceType }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to start checkout:", error);
    } finally {
      setIsLoadingCheckout(null);
    }
  }

  const tabs = [
    { id: "account" as const, label: "Account", icon: User },
    { id: "subscription" as const, label: "Subscription", icon: CreditCard },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold text-surface-900">Settings</h1>

      <div className="mt-6 flex gap-1 border-b border-surface-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-surface-500 hover:text-surface-700"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "account" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-surface-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-surface-900">
                Profile
              </h2>
              <p className="mt-1 text-sm text-surface-500">
                Manage your account details through Clerk.
              </p>
              <div className="mt-4">
                <UserProfile
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none border-0 p-0",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "subscription" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-surface-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-surface-900">
                Current Plan
              </h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-surface-100 bg-surface-50 p-4">
                  <div className="flex items-center gap-2">
                    <BookmarkCheck className="h-5 w-5 text-primary-600" />
                    <span className="font-medium text-surface-900">
                      BookmarkIQ Pro
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-surface-500">
                    Full access to all features including AI categorization and
                    semantic search.
                  </p>
                </div>

                <Button
                  onClick={handleManageSubscription}
                  isLoading={isLoadingPortal}
                  variant="outline"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Manage Subscription
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-surface-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-surface-900">
                Change Plan
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-surface-200 p-4">
                  <h3 className="font-semibold text-surface-900">
                    Pro Monthly
                  </h3>
                  <p className="mt-1 text-2xl font-bold text-surface-900">
                    $7<span className="text-sm font-normal text-surface-500">/mo</span>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => handleSubscribe("monthly")}
                    isLoading={isLoadingCheckout === "monthly"}
                  >
                    Subscribe Monthly
                  </Button>
                </div>

                <div className="rounded-lg border-2 border-primary-600 p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-surface-900">
                      Pro Annual
                    </h3>
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                      Save $45
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-surface-900">
                    $39<span className="text-sm font-normal text-surface-500">/yr</span>
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => handleSubscribe("annual")}
                    isLoading={isLoadingCheckout === "annual"}
                  >
                    Subscribe Annual
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
