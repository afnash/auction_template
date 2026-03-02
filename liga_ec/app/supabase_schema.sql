-- Create teams table
create table public.teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create players table
create table public.players (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  position text not null, -- 'GK', 'DEF', 'MID', 'FWD'
  team_id uuid references public.teams(id),
  image_url text, -- Optional: for player image
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add some dummy teams (6 slots as requested)
insert into public.teams (name) values 
  ('Team A'),
  ('Team B'),
  ('Team C'),
  ('Team D'),
  ('Team E'),
  ('Team F');

create table public.unsold (
  id uuid default gen_random_uuid() primary key,
  player_id uuid references public.players(id),
  position text not null, -- 'GK', 'DEF', 'MID', 'FWD'
  image_url text, -- Optional: for player image
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);