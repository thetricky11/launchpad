import { NextRequest, NextResponse } from 'next/server'

const SQL = `
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  name text not null,
  industry text,
  website text,
  logo_url text,
  target_audience jsonb,
  tone_of_voice text,
  competitor_brands text[],
  brand_values text[],
  plan text default 'free',
  created_at timestamptz default now()
);
alter table public.brands enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'brands' and policyname = 'Users can view own brands') then
    create policy "Users can view own brands" on public.brands for select using (auth.uid() = user_id);
    create policy "Users can insert own brands" on public.brands for insert with check (auth.uid() = user_id);
    create policy "Users can update own brands" on public.brands for update using (auth.uid() = user_id);
  end if;
end $$;

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references public.brands,
  name text not null,
  objective text,
  budget_total numeric,
  budget_remaining numeric,
  platforms text[],
  content_types text[],
  timeline_start date,
  timeline_end date,
  brief_summary text,
  key_messages text[],
  hashtags text[],
  cta text,
  dos text[],
  donts text[],
  status text default 'draft',
  ai_generated_brief jsonb,
  created_at timestamptz default now()
);
alter table public.campaigns enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'campaigns' and policyname = 'Users can view own campaigns') then
    create policy "Users can view own campaigns" on public.campaigns for select using (brand_id in (select id from public.brands where user_id = auth.uid()));
    create policy "Users can insert own campaigns" on public.campaigns for insert with check (brand_id in (select id from public.brands where user_id = auth.uid()));
    create policy "Users can update own campaigns" on public.campaigns for update using (brand_id in (select id from public.brands where user_id = auth.uid()));
  end if;
end $$;

create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  handle text,
  full_name text,
  platform text,
  profile_url text,
  avatar_url text,
  bio text,
  follower_count integer,
  engagement_rate numeric,
  avg_likes integer,
  avg_comments integer,
  avg_views integer,
  audience_demographics jsonb,
  categories text[],
  past_brand_deals text[],
  estimated_cpm numeric,
  estimated_rate_per_post numeric,
  contact_email text,
  location text,
  brand_safety_score numeric,
  fake_follower_percentage numeric,
  last_updated timestamptz default now()
);
alter table public.creators enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'creators' and policyname = 'Anyone can view creators') then
    create policy "Anyone can view creators" on public.creators for select using (true);
    create policy "Service role can insert creators" on public.creators for insert with check (true);
    create policy "Service role can update creators" on public.creators for update using (true);
  end if;
end $$;

create table if not exists public.campaign_creators (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns,
  creator_id uuid references public.creators,
  fit_score numeric,
  score_breakdown jsonb,
  status text default 'shortlisted',
  proposed_rate numeric,
  agreed_rate numeric,
  deliverables jsonb,
  outreach_email_subject text,
  outreach_email_body text,
  outreach_sent_at timestamptz,
  outreach_opened_at timestamptz,
  contract_url text,
  notes text,
  added_at timestamptz default now()
);
alter table public.campaign_creators enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'campaign_creators' and policyname = 'Users can view own campaign creators') then
    create policy "Users can view own campaign creators" on public.campaign_creators for select using (campaign_id in (select id from public.campaigns where brand_id in (select id from public.brands where user_id = auth.uid())));
    create policy "Users can insert own campaign creators" on public.campaign_creators for insert with check (campaign_id in (select id from public.campaigns where brand_id in (select id from public.brands where user_id = auth.uid())));
    create policy "Users can update own campaign creators" on public.campaign_creators for update using (campaign_id in (select id from public.campaigns where brand_id in (select id from public.brands where user_id = auth.uid())));
  end if;
end $$;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  campaign_creator_id uuid references public.campaign_creators,
  platform text,
  post_url text,
  post_type text,
  tracking_link text,
  utm_params jsonb,
  published_at timestamptz,
  likes integer default 0,
  comments integer default 0,
  shares integer default 0,
  views integer default 0,
  link_clicks integer default 0,
  conversions integer default 0,
  earned_media_value numeric,
  last_refreshed timestamptz
);
alter table public.posts enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'posts' and policyname = 'Users can view own posts') then
    create policy "Users can view own posts" on public.posts for select using (campaign_creator_id in (select id from public.campaign_creators where campaign_id in (select id from public.campaigns where brand_id in (select id from public.brands where user_id = auth.uid()))));
    create policy "Users can insert own posts" on public.posts for insert with check (campaign_creator_id in (select id from public.campaign_creators where campaign_id in (select id from public.campaigns where brand_id in (select id from public.brands where user_id = auth.uid()))));
  end if;
end $$;
`

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({}))
  
  if (!password) {
    return NextResponse.json({ sql: SQL, instructions: 'Run the SQL in your Supabase dashboard SQL Editor' })
  }

  try {
    const { Pool } = await import('pg')
    const pool = new Pool({
      host: `db.${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '')}.supabase.co`,
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password,
      ssl: { rejectUnauthorized: false }
    })

    const client = await pool.connect()
    await client.query(SQL)
    client.release()
    await pool.end()
    
    return NextResponse.json({ success: true, message: 'Tables created successfully!' })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message, sql: SQL }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ sql: SQL, instructions: 'POST with {"password": "your-db-password"} or run the SQL manually in Supabase dashboard' })
}
