-- CREOVA Supabase PostgreSQL Schema & RLS Policies Migration
-- Version: 1.0.0

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users and Workspaces
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists creator_preferences (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete cascade not null unique,
  primary_niche text,
  target_audience text,
  primary_platform text,
  preferred_languages text[] default array['English', 'Malayalam', 'Arabic', 'Urdu'],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists workspaces (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  owner_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists workspace_members (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  profile_id uuid references profiles(id) on delete cascade not null,
  role text check (role in ('owner', 'editor', 'viewer')) default 'editor',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(workspace_id, profile_id)
);

create table if not exists brand_profiles (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null unique,
  brand_name text not null,
  tagline text,
  primary_color text default '#C8F34A',
  secondary_color text default '#050505',
  font_family text default 'Inter',
  tone text,
  target_audience text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Content Management
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  title text not null,
  content_type text check (content_type in ('Video', 'Carousel', 'Short', 'Article')) default 'Video',
  status text check (status in ('Draft', 'In Production', 'Scheduled', 'Published')) default 'Draft',
  platform text check (platform in ('YouTube', 'Instagram', 'TikTok', 'LinkedIn')) default 'YouTube',
  progress int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists content_ideas (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  title text not null,
  hook text not null,
  niche text,
  platform text,
  format text,
  estimated_duration text,
  angle text,
  saved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists research_sources (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  query text not null,
  source_title text,
  source_url text,
  publisher text,
  retrieved_at timestamp with time zone default timezone('utc'::text, now()) not null,
  summary text
);

create table if not exists scripts (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  platform text,
  target_duration text,
  language text default 'English',
  hook text,
  introduction text,
  body text,
  call_to_action text,
  word_count int default 0,
  status text check (status in ('Draft', 'Ready', 'Filmed')) default 'Draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists script_scenes (
  id uuid primary key default uuid_generate_v4(),
  script_id uuid references scripts(id) on delete cascade not null,
  scene_number int not null,
  title text not null,
  duration text,
  visual_description text,
  camera_angle text,
  audio_notes text,
  status text check (status in ('Pending', 'Filmed', 'Editing')) default 'Pending'
);

create table if not exists captions (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  platform text,
  caption_text text not null,
  hashtags text[],
  call_to_action text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists design_assets (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  title text not null,
  asset_type text check (asset_type in ('Thumbnail', 'Carousel', 'Story', 'Banner')) default 'Thumbnail',
  storage_path text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Media Processing
create table if not exists media_assets (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  filename text not null,
  file_size bigint,
  duration float,
  storage_path text not null,
  mime_type text,
  status text check (status in ('Uploaded', 'Processing', 'Ready', 'Failed')) default 'Uploaded',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists transcription_jobs (
  id uuid primary key default uuid_generate_v4(),
  media_id uuid references media_assets(id) on delete cascade not null,
  status text check (status in ('Queued', 'Processing', 'Completed', 'Failed')) default 'Queued',
  raw_transcript jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists localization_jobs (
  id uuid primary key default uuid_generate_v4(),
  media_id uuid references media_assets(id) on delete cascade not null,
  target_language text not null,
  status text check (status in ('Queued', 'Processing', 'Completed', 'Failed')) default 'Queued',
  translated_text jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists subtitle_tracks (
  id uuid primary key default uuid_generate_v4(),
  media_id uuid references media_assets(id) on delete cascade not null,
  language text not null,
  format text check (format in ('SRT', 'VTT')) default 'SRT',
  storage_path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Operations & Publishing
create table if not exists production_tasks (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  title text not null,
  priority text check (priority in ('Low', 'Medium', 'High')) default 'Medium',
  due_date text,
  completed boolean default false,
  project_id uuid references projects(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists content_calendar (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  scheduled_date date not null,
  scheduled_time time not null,
  platform text not null,
  status text check (status in ('Scheduled', 'Published', 'Draft')) default 'Scheduled',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists social_accounts (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  platform text not null,
  account_name text not null,
  access_token_encrypted text,
  token_expires_at timestamp with time zone,
  connected boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists publishing_jobs (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  project_id uuid references projects(id) on delete cascade not null,
  social_account_id uuid references social_accounts(id) on delete cascade not null,
  status text check (status in ('Queued', 'Publishing', 'Published', 'Failed')) default 'Queued',
  provider_response jsonb,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists analytics_snapshots (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  metric_name text not null,
  metric_value numeric not null,
  change_percentage numeric,
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  message text,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Configuration
alter table profiles enable row level security;
alter table creator_preferences enable row level security;
alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table brand_profiles enable row level security;
alter table projects enable row level security;
alter table content_ideas enable row level security;
alter table research_sources enable row level security;
alter table scripts enable row level security;
alter table script_scenes enable row level security;
alter table captions enable row level security;
alter table design_assets enable row level security;
alter table media_assets enable row level security;
alter table transcription_jobs enable row level security;
alter table localization_jobs enable row level security;
alter table subtitle_tracks enable row level security;
alter table production_tasks enable row level security;
alter table content_calendar enable row level security;
alter table social_accounts enable row level security;
alter table publishing_jobs enable row level security;
alter table analytics_snapshots enable row level security;
alter table notifications enable row level security;

-- Sample RLS policy for workspace isolation
create policy "Workspace members can access workspace projects"
  on projects for all
  using (
    workspace_id in (
      select workspace_id from workspace_members where profile_id in (
        select id from profiles where user_id = auth.uid()
      )
    )
  );
