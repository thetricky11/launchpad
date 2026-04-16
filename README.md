# LaunchPad 🚀

AI-powered influencer marketing campaign builder.

## Quick Start

```bash
npm run dev
# Open http://localhost:3000
```

## First-time Setup: Database

Before using the app, you need to create the database tables in Supabase.

### Option A: Via Setup Page (easiest)
1. Start the app with `npm run dev`
2. Visit `http://localhost:3000/setup`
3. Copy the SQL and paste it into your [Supabase SQL Editor](https://supabase.com/dashboard/project/ehgfmkqxyqwlsoytfzgv/sql/new)
4. OR enter your Supabase DB password for auto-migration

### Option B: Via Supabase Dashboard
1. Go to https://supabase.com/dashboard/project/ehgfmkqxyqwlsoytfzgv/sql/new
2. Copy the SQL from `supabase/migrations/001_initial.sql`
3. Paste and run it

### Option C: Via psql
```bash
# Get your DB password from Supabase Dashboard → Settings → Database
psql "postgresql://postgres:[DB_PASSWORD]@db.ehgfmkqxyqwlsoytfzgv.supabase.co:5432/postgres" \
  -f supabase/migrations/001_initial.sql
```

## Features

- **Authentication** — Email/password + magic link via Supabase Auth
- **Brand Onboarding** — 4-step wizard to set up your brand profile
- **Campaign Builder** — Single-page form with real-time budget preview
- **AI Campaign Generation** — Claude-powered scoring, brief generation, and outreach emails
- **Creator Discovery** — 80 mock creators + CreatorDB API integration
- **Campaign Management** — Overview, Creators, Outreach, and Tracking tabs
- **Contract Generation** — AI-generated contracts with PDF download
- **Email Outreach** — Personalized emails via Resend
- **Billing** — Demo billing with Stripe-styled checkout modal

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: Anthropic Claude (claude-3-5-sonnet)
- **Email**: Resend
- **Charts**: Recharts
- **Animations**: Framer Motion
- **PDF**: jsPDF

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Login
│   ├── signup/page.tsx             # Signup
│   ├── onboarding/page.tsx         # Brand setup wizard
│   ├── dashboard/page.tsx          # Dashboard
│   ├── campaigns/
│   │   ├── new/page.tsx            # Campaign builder
│   │   └── [id]/
│   │       ├── page.tsx            # Campaign detail
│   │       └── generating/page.tsx # Generation loading screen
│   ├── billing/page.tsx            # Billing
│   ├── setup/page.tsx              # DB setup helper
│   └── api/
│       ├── campaigns/generate/     # Main AI generation endpoint
│       ├── creators/search/        # Creator search
│       ├── creators/score/         # Creator scoring
│       ├── outreach/generate/      # Outreach email generation
│       ├── outreach/send/          # Send via Resend
│       ├── contracts/generate/     # Contract generation
│       └── setup/                  # DB migration helper
├── components/
│   ├── nav.tsx                     # Navigation
│   ├── campaign-detail.tsx         # Campaign detail tabs
│   └── ui/                         # shadcn components
├── lib/
│   ├── supabase.ts                 # Supabase clients
│   ├── anthropic.ts                # Claude prompts
│   ├── creatordb.ts                # CreatorDB API + fallback
│   ├── mock-creators.ts            # 80 mock creators
│   └── scoring.ts                  # TypeScript scoring fallback
└── types/index.ts                  # TypeScript interfaces
```
