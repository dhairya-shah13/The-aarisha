create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  username text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

-- Safe upgrade for databases created before usernames were added.
alter table users add column if not exists username text;
update users set username = 'user_' || left(replace(id::text, '-', ''), 8) where username is null;
alter table users alter column username set not null;
create unique index if not exists users_username_key on users (username);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10,2) not null check (price > 0),
  category text not null check (category in ('rings', 'necklaces', 'bracelets', 'earrings')),
  image_url text not null,
  description text,
  in_stock boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

alter table users enable row level security;
alter table products enable row level security;
alter table cart_items enable row level security;

-- The browser never connects to these tables directly. Public product reads are
-- deliberately enabled for future direct Supabase clients; all writes use the API service key.
drop policy if exists "public product read" on products;
create policy "public product read" on products for select using (true);
drop policy if exists "users own cart" on cart_items;
create policy "users own cart" on cart_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
