-- แยก "เงินออม" ออกเป็น "เงินฝาก/เงินสด" กับ "เงินลงทุน" เพราะให้ผลตอบแทนต่างกัน
-- รันไฟล์นี้ต่อจาก 0001_init.sql ใน Supabase SQL Editor

-- 1) เพิ่มคอลัมน์ใหม่ (อนุญาตให้เป็น null ชั่วคราวระหว่าง backfill)
alter table plans
  add column current_savings_deposit    numeric(14,2),
  add column current_savings_investment numeric(14,2),
  add column monthly_deposit            numeric(14,2),
  add column monthly_investment         numeric(14,2),
  add column deposit_return             numeric(6,4) not null default 0.015;

-- 2) ย้ายข้อมูลเดิม: ของเดิมทั้งหมดถือเป็น "เงินลงทุน" (คอลัมน์เดิมไม่แยกประเภท)
update plans
set
  current_savings_deposit    = 0,
  current_savings_investment = current_savings,
  monthly_deposit             = 0,
  monthly_investment          = monthly_contribution;

-- 3) บังคับ not null + default 0 เหมือนคอลัมน์เดิม
alter table plans
  alter column current_savings_deposit    set not null,
  alter column current_savings_deposit    set default 0,
  alter column current_savings_investment set not null,
  alter column current_savings_investment set default 0,
  alter column monthly_deposit             set not null,
  alter column monthly_deposit             set default 0,
  alter column monthly_investment          set not null,
  alter column monthly_investment          set default 0;

alter table plans
  add constraint current_savings_deposit_nonneg    check (current_savings_deposit >= 0),
  add constraint current_savings_investment_nonneg check (current_savings_investment >= 0),
  add constraint monthly_deposit_nonneg             check (monthly_deposit >= 0),
  add constraint monthly_investment_nonneg          check (monthly_investment >= 0);

-- 4) ลบคอลัมน์เดิมที่ถูกแทนที่แล้ว
alter table plans
  drop column current_savings,
  drop column monthly_contribution;
