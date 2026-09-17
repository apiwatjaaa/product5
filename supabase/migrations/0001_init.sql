-- โปรไฟล์ผู้ใช้ (ผูกกับ auth.users)
create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  display_name text,
  locale      text default 'th',
  created_at  timestamptz default now()
);

-- แผนเกษียณ
create table plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  name        text not null default 'แผนของฉัน',

  -- ข้อมูลหลัก (บังคับ)
  current_age            int  not null check (current_age between 15 and 80),
  retirement_age         int  not null check (retirement_age between 40 and 85),
  life_expectancy        int  not null check (life_expectancy between 60 and 110),
  monthly_expense_today  numeric(14,2) not null check (monthly_expense_today > 0),
  current_savings        numeric(14,2) not null default 0 check (current_savings >= 0),
  monthly_contribution   numeric(14,2) not null default 0 check (monthly_contribution >= 0),
  risk_level             text not null check (risk_level in ('conservative','moderate','aggressive')),

  -- ตั้งค่าขั้นสูง (มีค่าเริ่มต้น)
  inflation_rate         numeric(6,4) not null default 0.03,
  annual_return          numeric(6,4) not null,   -- เติมอัตโนมัติจาก risk_level แต่แก้ได้
  contribution_growth    numeric(6,4) not null default 0,
  pension_monthly_today  numeric(14,2) not null default 0,

  -- โหมดคำนวณเงินก้อน
  corpus_method          text not null default 'annuity'
                         check (corpus_method in ('annuity','simple','rule4')),

  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),

  constraint age_order check (current_age < retirement_age
                              and retirement_age < life_expectancy)
);

-- เป้าหมายพิเศษ (ซื้อบ้าน, ท่องเที่ยว, ฯลฯ)
create table plan_goals (
  id          uuid primary key default gen_random_uuid(),
  plan_id     uuid not null references plans on delete cascade,
  name        text not null,
  amount_today numeric(14,2) not null check (amount_today > 0),
  target_age  int not null,
  sort_order  int not null default 0
);

-- เปิด RLS ทุกตาราง ผู้ใช้เห็นและแก้ได้เฉพาะแถวของตัวเอง
alter table profiles   enable row level security;
alter table plans      enable row level security;
alter table plan_goals enable row level security;

create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own plans" on plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own goals" on plan_goals
  for all using (
    exists (select 1 from plans p where p.id = plan_id and p.user_id = auth.uid())
  ) with check (
    exists (select 1 from plans p where p.id = plan_id and p.user_id = auth.uid())
  );

-- อัปเดต updated_at อัตโนมัติเมื่อแก้ไขแผน
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger plans_set_updated_at
  before update on plans
  for each row execute function set_updated_at();

-- สร้างโปรไฟล์อัตโนมัติเมื่อมีผู้ใช้สมัครใหม่
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
