# BookmarkIQ — Twitter Bookmark Manager

AI-powered organization for your Twitter bookmarks. Never lose a great tweet again.

## Overview

BookmarkIQ is a web-based tool that automatically organizes, categorizes, and enables instant search across your Twitter bookmarks. It uses AI to auto-categorize bookmarks and supports natural language semantic search.

**Target users:** Product managers, indie hackers, researchers, developers, and writers who save 100+ tweets but can't find them again.

## Features (MVP V1)

- **Twitter OAuth & Bulk Import** — Connect your Twitter account and import all existing bookmarks
- **On-Demand Sync** — Fetch new bookmarks when you log in (no background jobs)
- **AI Auto-Categorization** — Automatic category generation based on tweet content
- **Semantic Search** — Natural language queries ("find bookmarks about vibecoding with Claude")
- **Keyword Search** — Traditional text search across content and author names
- **Smart Filters** — Filter by date range, author, or AI-generated category
- **Bookmark Management** — View in list/feed, click through to original tweet, delete
- **Manual Recategorization** — Edit AI-assigned categories
- **Subscription & Payments** — Stripe integration ($7/month or $39/year)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Prisma (Supabase/Neon) |
| Auth | Clerk (Twitter OAuth) |
| Payments | Stripe |
| AI | OpenAI (GPT-4o-mini for categorization, text-embedding-3-small for semantic search) |
| Twitter API | twitter-api-v2 (abstracted into TwitterService module) |
| Hosting | Vercel |

## Project Structure

```
twitter-bookmark-manager/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── (app)/             # Authenticated app routes
│   │   │   ├── dashboard/     # Main bookmark view
│   │   │   └── settings/      # Account & subscription
│   │   ├── (auth)/            # Sign-in/sign-up pages
│   │   ├── (marketing)/       # Landing page
│   │   └── api/               # API routes
│   │       ├── bookmarks/     # CRUD, sync, search
│   │       ├── categories/    # Category management
│   │       ├── stripe/        # Checkout, portal, webhook
│   │       └── webhooks/      # Clerk webhook
│   ├── components/
│   │   ├── bookmarks/         # Bookmark cards, list, search, filters
│   │   ├── layout/            # Sidebar, top bar
│   │   ├── marketing/         # Landing page components
│   │   └── ui/                # Reusable UI (Button, Input, Badge, etc.)
│   ├── lib/
│   │   ├── auth.ts            # Auth helpers
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── utils.ts           # Utilities
│   ├── services/
│   │   ├── ai.service.ts      # OpenAI categorization & embeddings
│   │   ├── bookmark.service.ts # Business logic
│   │   ├── stripe.service.ts  # Stripe integration
│   │   └── twitter.service.ts # Twitter API (abstracted module)
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── middleware.ts           # Clerk auth middleware
├── .env.example               # Environment variable template
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase or Neon recommended)
- Clerk account with Twitter OAuth configured
- Stripe account with products/prices configured
- OpenAI API key
- Twitter API credentials

### Installation

```bash
cd twitter-bookmark-manager
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — from Clerk dashboard
- `DATABASE_URL` — PostgreSQL connection string
- `TWITTER_BEARER_TOKEN` — from Twitter Developer Portal
- `OPENAI_API_KEY` — from OpenAI
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — from Stripe
- `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_ANNUAL` — Stripe Price IDs

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm start
```

## Architecture Notes

### TwitterService Abstraction

All Twitter API calls go through `src/services/twitter.service.ts`. This module is designed for future scaling via load-balancing or round-robin between multiple API keys. V1 uses a single key; the architecture supports expansion with minimal code changes.

### On-Demand Sync

Bookmarks are only fetched when the user actively logs in — no background crons or scheduled jobs. This keeps API usage proportional to engagement and minimizes costs.

### AI Pipeline

1. New bookmarks are fetched from Twitter
2. Tweets are sent to GPT-4o-mini for category assignment (batched in groups of 20)
3. Embeddings are generated via text-embedding-3-small for semantic search
4. Categories are auto-created and bookmarks are tagged

## Pricing

- **Pro Monthly:** $7/month (cancel anytime)
- **Pro Annual:** $39/year (save $45 vs. monthly)
- 7-day free trial included

## License

Private — All rights reserved.
