-- BudgetIQ Database Schema

-- Users profile extension
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Categories
create table if not exists public.categories (
  id text primary key,
  name text not null,
  icon text not null default 'circle',
  color text not null default '#64748b',
  "order" int not null default 0,
  user_id uuid references auth.users on delete cascade,
  is_default boolean not null default false
);

alter table public.categories enable row level security;

create policy "Users can view their categories"
  on categories for select using (auth.uid() = user_id or is_default = true);

create policy "Users can insert their categories"
  on categories for insert with check (auth.uid() = user_id);

create policy "Users can update their categories"
  on categories for update using (auth.uid() = user_id);

create policy "Users can delete their categories"
  on categories for delete using (auth.uid() = user_id);

-- Budgets
create table if not exists public.budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  category text not null references public.categories(id),
  limit_amount numeric(12,2) not null default 0,
  spent numeric(12,2) not null default 0,
  period text not null default 'monthly',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.budgets enable row level security;

create policy "Users can view their budgets"
  on budgets for select using (auth.uid() = user_id);

create policy "Users can insert their budgets"
  on budgets for insert with check (auth.uid() = user_id);

create policy "Users can update their budgets"
  on budgets for update using (auth.uid() = user_id);

create policy "Users can delete their budgets"
  on budgets for delete using (auth.uid() = user_id);

-- Transactions
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text not null check (type in ('income', 'expense')),
  category text not null references public.categories(id),
  amount numeric(12,2) not null,
  description text not null default '',
  date date not null default current_date,
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;

create policy "Users can view their transactions"
  on transactions for select using (auth.uid() = user_id);

create policy "Users can insert their transactions"
  on transactions for insert with check (auth.uid() = user_id);

create policy "Users can update their transactions"
  on transactions for update using (auth.uid() = user_id);

create policy "Users can delete their transactions"
  on transactions for delete using (auth.uid() = user_id);

-- AI Plans
create table if not exists public.ai_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  total_income numeric(12,2) not null,
  savings_recommendation numeric(12,2) not null,
  savings_percentage numeric(5,2) not null,
  allocations jsonb not null default '[]',
  generated_at timestamptz default now()
);

alter table public.ai_plans enable row level security;

create policy "Users can view their ai plans"
  on ai_plans for select using (auth.uid() = user_id);

create policy "Users can insert their ai plans"
  on ai_plans for insert with check (auth.uid() = user_id);

-- Savings Goals
create table if not exists public.savings_goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  target_amount numeric(12,2) not null,
  current_amount numeric(12,2) not null default 0,
  deadline date,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  icon text not null default 'target',
  created_at timestamptz default now()
);

alter table public.savings_goals enable row level security;

create policy "Users can view their savings goals"
  on savings_goals for select using (auth.uid() = user_id);

create policy "Users can insert their savings goals"
  on savings_goals for insert with check (auth.uid() = user_id);

create policy "Users can update their savings goals"
  on savings_goals for update using (auth.uid() = user_id);

create policy "Users can delete their savings goals"
  on savings_goals for delete using (auth.uid() = user_id);

-- Indexes
create index if not exists idx_transactions_user_date on public.transactions(user_id, date desc);
create index if not exists idx_budgets_user on public.budgets(user_id);
create index if not exists idx_ai_plans_user on public.ai_plans(user_id, generated_at desc);
create index if not exists idx_savings_goals_user on public.savings_goals(user_id);
