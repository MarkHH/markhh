import Link from "next/link";
import {
  Search,
  Sparkles,
  Tag,
  Zap,
  ArrowRight,
  BookmarkCheck,
  Filter,
  RefreshCw,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-bold text-surface-900">
              BookmarkIQ
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#features"
              className="text-sm text-surface-600 hover:text-surface-900"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-surface-600 hover:text-surface-900"
            >
              Pricing
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-surface-600 hover:text-surface-900"
            >
              How It Works
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-surface-600 hover:text-surface-900"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 transition-colors"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden pb-20 pt-24 sm:pt-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/50 to-white" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
            <Sparkles className="h-4 w-4" />
            AI-Powered Bookmark Organization
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-surface-900 sm:text-6xl">
            Never lose a great tweet
            <span className="text-primary-600"> again</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-surface-600 leading-relaxed">
            Your Twitter bookmarks are a gold mine buried under chaos.
            BookmarkIQ auto-categorizes them with AI and lets you find any
            bookmark instantly with natural language search.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-500/25 hover:bg-primary-700 transition-all hover:shadow-primary-500/40"
            >
              Start 7-Day Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <span className="text-sm text-surface-500">
              No credit card required to start
            </span>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-xl border border-surface-200 bg-white shadow-2xl shadow-surface-900/5">
            <div className="flex items-center gap-2 border-b border-surface-100 bg-surface-50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-surface-400">
                BookmarkIQ — Dashboard
              </span>
            </div>
            <div className="p-6">
              <div className="flex gap-4">
                <div className="hidden w-48 shrink-0 space-y-3 sm:block">
                  <div className="rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700">
                    All Bookmarks
                  </div>
                  {[
                    "AI Tools",
                    "Product Management",
                    "Web Development",
                    "Design",
                    "Startup Advice",
                  ].map((cat) => (
                    <div
                      key={cat}
                      className="rounded-lg px-3 py-2 text-sm text-surface-600 hover:bg-surface-50"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 rounded-lg border border-surface-200 bg-surface-50 px-3 py-2">
                    <Search className="h-4 w-4 text-surface-400" />
                    <span className="text-sm text-surface-400">
                      Search bookmarks with AI...
                    </span>
                  </div>
                  {[
                    {
                      author: "Sarah Chen",
                      handle: "@sarahchen",
                      text: "The best AI tools for product managers in 2026: a comprehensive thread on what actually works vs. hype...",
                      category: "AI Tools",
                      color: "#6366f1",
                    },
                    {
                      author: "Alex Rivera",
                      handle: "@alexrivera",
                      text: "After 5 years as a PM at FAANG, here are the frameworks I actually use daily. Skip the MBA, learn these instead...",
                      category: "Product Management",
                      color: "#8b5cf6",
                    },
                    {
                      author: "Jamie Park",
                      handle: "@jamiepark_dev",
                      text: "Next.js 15 just changed everything about how we build web apps. Here's what you need to know about server components...",
                      category: "Web Development",
                      color: "#06b6d4",
                    },
                  ].map((tweet) => (
                    <div
                      key={tweet.handle}
                      className="rounded-lg border border-surface-100 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-surface-200" />
                          <div>
                            <span className="text-sm font-semibold">
                              {tweet.author}
                            </span>
                            <span className="ml-1 text-sm text-surface-400">
                              {tweet.handle}
                            </span>
                          </div>
                        </div>
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: `${tweet.color}15`,
                            color: tweet.color,
                          }}
                        >
                          {tweet.category}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-surface-700 leading-relaxed">
                        {tweet.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-surface-900 sm:text-4xl">
              Everything you need to tame your bookmarks
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-surface-600">
              No more black hole. BookmarkIQ gives you superpowers for your
              Twitter bookmarks.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "AI Auto-Categorization",
                desc: "Bookmarks are automatically sorted into smart categories like 'AI Tools', 'Product Management', and 'Design' — no manual work needed.",
              },
              {
                icon: Search,
                title: "Semantic Search",
                desc: "Find bookmarks with natural language. Search 'that tweet about vibecoding with Claude' and get exactly what you need.",
              },
              {
                icon: Zap,
                title: "One-Click Import",
                desc: "Connect your Twitter account and import all your bookmarks in seconds. Fast onboarding, instant value.",
              },
              {
                icon: RefreshCw,
                title: "On-Demand Sync",
                desc: "New bookmarks are automatically fetched when you log in. Always up to date, never a background job eating your API quota.",
              },
              {
                icon: Filter,
                title: "Smart Filters",
                desc: "Filter by date range, author, or AI-generated category. Drill down to find exactly what you're looking for.",
              },
              {
                icon: Tag,
                title: "Manual Recategorization",
                desc: "AI got it wrong? Edit any category assignment with a click. You're always in control.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-surface-200 bg-white p-6 transition-all hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary-50 p-3 text-primary-600 group-hover:bg-primary-100 transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-surface-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-surface-100 bg-surface-50 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-surface-900 sm:text-4xl">
              From chaos to clarity in 3 steps
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-surface-600">
              Get started in under 2 minutes.
            </p>
          </div>

          <div className="mt-16 space-y-12">
            {[
              {
                step: "01",
                title: "Connect your Twitter account",
                desc: "Sign up with Twitter OAuth. One click, zero friction.",
              },
              {
                step: "02",
                title: "Import & auto-categorize",
                desc: "All your existing bookmarks are imported and AI-categorized automatically.",
              },
              {
                step: "03",
                title: "Search, filter, and find anything",
                desc: "Use semantic search or browse by category. Your bookmarks are finally organized.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-surface-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-surface-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-surface-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-surface-600">
              One plan, everything included. Start with a free trial.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <div className="rounded-xl border border-surface-200 bg-white p-8">
              <h3 className="text-lg font-semibold text-surface-900">
                Pro Monthly
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-surface-900">$7</span>
                <span className="text-surface-500">/month</span>
              </div>
              <p className="mt-2 text-sm text-surface-500">
                Cancel anytime. No lock-in.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Unlimited bookmark imports",
                  "AI auto-categorization",
                  "Semantic & keyword search",
                  "Smart filters",
                  "On-demand sync",
                  "7-day free trial",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-surface-700"
                  >
                    <svg
                      className="h-4 w-4 shrink-0 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 block w-full rounded-lg border border-surface-300 px-4 py-2.5 text-center text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            <div className="relative rounded-xl border-2 border-primary-600 bg-white p-8 shadow-lg shadow-primary-500/10">
              <div className="absolute -top-3 right-6 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                Best Value
              </div>
              <h3 className="text-lg font-semibold text-surface-900">
                Pro Annual
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-surface-900">$39</span>
                <span className="text-surface-500">/year</span>
              </div>
              <p className="mt-2 text-sm text-primary-600 font-medium">
                Save $45 vs. monthly
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Everything in Monthly",
                  "Unlimited bookmark imports",
                  "AI auto-categorization",
                  "Semantic & keyword search",
                  "Smart filters",
                  "On-demand sync",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-surface-700"
                  >
                    <svg
                      className="h-4 w-4 shrink-0 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 block w-full rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-surface-100 bg-surface-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-surface-900 sm:text-4xl">
            Bookmarked for real
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-surface-600">
            Stop losing valuable tweets in the abyss. Start finding them
            instantly.
          </p>
          <Link
            href="/sign-up"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-500/25 hover:bg-primary-700 transition-all"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-surface-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5 text-primary-600" />
            <span className="font-semibold text-surface-900">BookmarkIQ</span>
          </div>
          <p className="text-sm text-surface-500">
            &copy; {new Date().getFullYear()} BookmarkIQ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
