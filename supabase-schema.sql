create extension if not exists pgcrypto;

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
  session_id uuid not null,
  product_id uuid not null references products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamptz default now(),
  unique (session_id, product_id)
);

alter table products enable row level security;
alter table cart_items enable row level security;

-- The browser never connects to these tables directly. Public product reads are
-- deliberately enabled for future direct Supabase clients; all writes use the API service key.
drop policy if exists "public product read" on products;
create policy "public product read" on products for select using (true);
