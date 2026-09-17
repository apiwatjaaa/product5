# SPEC: โปรแกรมวางแผนและคำนวณมูลค่าเงินเพื่อการเกษียณ

> เอกสารนี้เป็น **ข้อกำหนดโครงงาน (Project Specification)** สำหรับให้ AI เขียนโค้ดเว็บแอปพลิเคชันด้วย Next.js
> อ่านทั้งไฟล์ก่อนเริ่มเขียนโค้ด แล้วพัฒนาตามลำดับ Phase ในหัวข้อสุดท้าย
>
> โครงงานระดับมัธยมศึกษา — โรงเรียนสุคนธีรวิทย์

---

## 1. ภาพรวม

### 1.1 ปัญหาที่แก้

ประเทศไทยเข้าสู่ "สังคมสูงวัยอย่างสมบูรณ์" แล้ว แต่คนส่วนใหญ่ประเมินเงินที่ต้องใช้หลังเกษียณ **ต่ำกว่าความเป็นจริง** เพราะมองข้าม 3 ปัจจัย:

1. อัตราเงินเฟ้อที่กัดกินมูลค่าเงินตลอด 30–40 ปี
2. ผลตอบแทนจากการลงทุนที่ทบต้น
3. ระยะเวลาหลังเกษียณที่ยาวขึ้น (20–30 ปี)

เครื่องมือคำนวณที่มีอยู่มักคำนวณแบบสถิต (Static) ไม่รวมเงินเฟ้อแยกส่วน และไม่เปรียบเทียบพอร์ตตามความเสี่ยง

### 1.2 สิ่งที่เว็บนี้ต้องทำได้

- รับข้อมูลทางการเงินของผู้ใช้ แล้วคำนวณ **เงินก้อนที่ต้องมี ณ วันเกษียณ**
- บอกว่า **ต้องออมเดือนละเท่าไหร่** ถึงจะถึงเป้า
- **เตือน** เมื่อออมไม่ทันเป้า พร้อมเสนอทางแก้ที่คำนวณมาแล้ว
- แสดง **กราฟการเติบโตของเงินออมรายปี** และ **ตารางแผนการออมรายปี**
- แนะนำ **สัดส่วนพอร์ตการลงทุน** ตามระดับความเสี่ยง
- บันทึกแผนไว้ในบัญชีผู้ใช้ กลับมาดู/แก้/เปรียบเทียบได้

### 1.3 กลุ่มผู้ใช้

บุคคลทั่วไปที่ไม่มีความรู้ทางการเงิน — **ภาษาต้องเข้าใจง่าย ไม่ใช้ศัพท์เทคนิคโดยไม่อธิบาย**

---

## 2. Tech Stack

| ส่วน | เทคโนโลยี | หมายเหตุ |
|---|---|---|
| Framework | **Next.js 15+ (App Router)** | ใช้ Server Components เป็นหลัก |
| ภาษา | **TypeScript** (strict mode) | ห้ามใช้ `any` ในโมดูลคำนวณเด็ดขาด |
| Styling | **Tailwind CSS v4** | |
| UI Components | **shadcn/ui** | |
| กราฟ | **Recharts** | |
| ไอคอน | **lucide-react** | |
| Auth + Database | **Supabase** (Auth + Postgres + RLS) | |
| Form + Validation | **react-hook-form + Zod** | Zod schema ใช้ร่วมกับฝั่ง server |
| i18n | **next-intl** | ไทย (ค่าเริ่มต้น) / อังกฤษ |
| Theme | **next-themes** | light / dark / system |
| Deploy | **Vercel** | |

**ฟอนต์:** `IBM Plex Sans Thai` (หัวข้อ + เนื้อหา) และ `IBM Plex Mono` (ตัวเลขในตาราง เพื่อให้หลักตรงกัน) โหลดผ่าน `next/font/google`

---

## 3. โครงสร้างโปรเจกต์

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # 1. Landing
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx          # 2. เข้าสู่ระบบ
│   │   │   ├── register/page.tsx       #    สมัครสมาชิก
│   │   │   └── callback/route.ts
│   │   ├── plan/
│   │   │   ├── new/page.tsx            # 3. ฟอร์มกรอกข้อมูล
│   │   │   └── [id]/page.tsx           # 4. หน้าผลลัพธ์
│   │   ├── dashboard/page.tsx          # 5. รายการแผนที่บันทึกไว้
│   │   └── learn/
│   │       ├── page.tsx                # 6. ความรู้การเงิน
│   │       └── [slug]/page.tsx
│   └── api/
├── components/
│   ├── ui/                             # shadcn/ui
│   ├── plan/                           # PlanForm, ResultSummary, GapAlert, ...
│   ├── charts/                         # GrowthChart, PortfolioPie
│   └── layout/                         # Navbar, LocaleSwitcher, ThemeToggle
├── lib/
│   ├── finance/                        # ⭐ โมดูลคำนวณ — ดูข้อ 5
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   ├── tvm.ts                      # สูตรพื้นฐาน
│   │   ├── corpus.ts                   # เงินก้อนที่ต้องมี 3 วิธี
│   │   ├── simulate.ts                 # จำลองรายปี
│   │   ├── recommend.ts                # คำแนะนำ
│   │   └── __tests__/finance.test.ts
│   ├── supabase/                       # client.ts, server.ts, middleware.ts
│   └── validation/planSchema.ts        # Zod
├── i18n/
│   ├── routing.ts
│   └── messages/{th.json, en.json}
└── middleware.ts
```

**กฎสำคัญ:** โฟลเดอร์ `lib/finance/` ต้องเป็น **pure functions** ทั้งหมด — ห้าม import React, ห้ามเรียก API, ห้ามอ่าน state ใด ๆ รับ input เป็น object ออก output เป็น object เท่านั้น เพื่อให้เขียน unit test ได้และตรวจสอบความถูกต้องได้ง่าย

---

## 4. ฐานข้อมูล (Supabase)

### 4.1 ตาราง

```sql
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
```

### 4.2 Row Level Security

**เปิด RLS ทุกตาราง** ผู้ใช้เห็นและแก้ได้เฉพาะแถวของตัวเอง:

```sql
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
```

### 4.3 สิ่งที่ **ไม่** เก็บ

ห้ามเก็บเลขบัตรประชาชน เลขบัญชีธนาคาร หรือข้อมูลระบุตัวตนอื่นนอกจากอีเมล โครงงานนี้ไม่ต้องใช้

---

## 5. โมดูลคำนวณ (หัวใจของโปรแกรม)

> ⚠️ ส่วนนี้สำคัญที่สุด — ถ้าสูตรผิด โครงงานทั้งหมดผิด
> ทุกฟังก์ชันต้องมี unit test ที่ผ่านตามตัวเลขในข้อ 9

### 5.1 ข้อตกลงเรื่องอัตราดอกเบี้ย

เอกสารโครงงานต้นฉบับระบุว่า *"อัตราต่อปีหารด้วย 12 สำหรับรายเดือน"* — **ให้ใช้ตามนี้** เพื่อให้ผลตรงกับที่คำนวณด้วย Excel ได้:

```ts
const monthlyRate = annualRate / 12;
const months      = years * 12;
```

(ไม่ใช้ `(1+r)^(1/12)-1` เพราะจะไม่ตรงกับเอกสารและกับฟังก์ชัน `FV`/`PMT` ของ Excel)

### 5.2 สูตรพื้นฐาน — `lib/finance/tvm.ts`

**มูลค่าอนาคตของเงินก้อนเดียว**

$$FV = PV \times (1+r)^n$$

```ts
export function futureValue(pv: number, rate: number, periods: number): number {
  return pv * Math.pow(1 + rate, periods);
}
```

**มูลค่าอนาคตของเงินออมสม่ำเสมอ (Ordinary Annuity — ออมปลายงวด)**

$$FV_{annuity} = PMT \times \frac{(1+r)^n - 1}{r}$$

```ts
export function futureValueAnnuity(pmt: number, rate: number, periods: number): number {
  if (Math.abs(rate) < 1e-9) return pmt * periods;   // กันหารศูนย์
  return pmt * ((Math.pow(1 + rate, periods) - 1) / rate);
}
```

**มูลค่าปัจจุบันของเงินถอนสม่ำเสมอ**

$$PV_{annuity} = PMT \times \frac{1 - (1+r)^{-n}}{r}$$

```ts
export function presentValueAnnuity(pmt: number, rate: number, periods: number): number {
  if (Math.abs(rate) < 1e-9) return pmt * periods;   // ⚠️ เคสนี้เกิดจริง ดู TC-02
  return pmt * ((1 - Math.pow(1 + rate, -periods)) / rate);
}
```

**ปรับค่าตามเงินเฟ้อ**

$$Cost_{future} = Cost_{present} \times (1+i)^n$$

**อัตราผลตอบแทนที่แท้จริง (Fisher Effect)**

$$1 + RealRate = \frac{1 + NominalRate}{1 + InflationRate}$$

```ts
export function realRate(nominal: number, inflation: number): number {
  return (1 + nominal) / (1 + inflation) - 1;
}
```

> ใช้สูตรเต็มของ Fisher **ไม่ใช่** สูตรประมาณ `nominal - inflation` แต่ให้แสดงสูตรประมาณไว้ในหน้าความรู้เพื่ออธิบาย

### 5.3 ระดับความเสี่ยง — `lib/finance/constants.ts`

อ้างอิงจากเอกสารโครงงาน ข้อ 2.4.2:

```ts
export const RISK_PROFILES = {
  conservative: {
    labelTh: 'ความเสี่ยงต่ำ',
    labelEn: 'Conservative',
    defaultReturn: 0.03,                    // 3% ต่อปี
    allocation: { bondsAndDeposits: 0.80, stocks: 0.20 },
    assetsTh: ['เงินฝากประจำ', 'ตั๋วเงินคลัง', 'พันธบัตรรัฐบาล'],
  },
  moderate: {
    labelTh: 'ความเสี่ยงปานกลาง',
    labelEn: 'Moderate',
    defaultReturn: 0.05,                    // 5% ต่อปี
    allocation: { bondsAndDeposits: 0.50, stocks: 0.50 },
    assetsTh: ['หุ้นกู้ภาคเอกชน', 'กองทุนรวมตราสารหนี้'],
  },
  aggressive: {
    labelTh: 'ความเสี่ยงสูง',
    labelEn: 'Aggressive',
    defaultReturn: 0.08,                    // 8% ต่อปี
    allocation: { bondsAndDeposits: 0.20, stocks: 0.80 },
    assetsTh: ['หุ้นสามัญ', 'กองทุนรวมหุ้น', 'สินทรัพย์ทางเลือก'],
  },
} as const;

export const DEFAULT_INFLATION = 0.03;
export const DEFAULT_LIFE_EXPECTANCY = 85;
```

เมื่อผู้ใช้เลือกระดับความเสี่ยง ให้เติม `annual_return` อัตโนมัติจาก `defaultReturn` แต่ยังแก้เองได้ในตั้งค่าขั้นสูง

### 5.4 คำนวณเงินก้อนที่ต้องมี ณ วันเกษียณ — `lib/finance/corpus.ts`

**ขั้นที่ 1: ปรับรายจ่ายและเงินบำนาญด้วยเงินเฟ้อ** (เหมือนกันทุกวิธี)

```
yearsToRetirement = retirementAge - currentAge
expenseAtRetirement = monthlyExpenseToday × (1 + inflation) ^ yearsToRetirement
pensionAtRetirement = pensionMonthlyToday × (1 + inflation) ^ yearsToRetirement
netMonthlyNeed      = expenseAtRetirement - pensionAtRetirement     // ต่ำสุด 0
```

> **ข้อสมมติเรื่องเงินบำนาญ:** ผู้ใช้กรอกเป็นมูลค่าเงินวันนี้ ระบบปรับด้วยอัตราเงินเฟ้อเดียวกับรายจ่าย ต้องเขียนข้อสมมตินี้ไว้ในหน้าผลลัพธ์ให้ผู้ใช้เห็น

**ขั้นที่ 2: คำนวณเงินก้อน — เลือกได้ 3 วิธี**

#### วิธี A — `annuity` (ค่าเริ่มต้น, แม่นยำที่สุด)

สมมติว่าเงินที่เหลือยังลงทุนต่อระหว่างเกษียณ จึงคิดลดด้วยอัตราผลตอบแทนที่แท้จริง

```
realAnnual  = (1 + annualReturn) / (1 + inflation) - 1
realMonthly = realAnnual / 12
monthsInRetirement = (lifeExpectancy - retirementAge) × 12

corpus = presentValueAnnuity(netMonthlyNeed, realMonthly, monthsInRetirement)
```

#### วิธี B — `simple` (เข้าใจง่าย)

```
corpus = netMonthlyNeed × monthsInRetirement
```

ไม่คิดผลตอบแทนหลังเกษียณ และไม่คิดเงินเฟ้อระหว่างเกษียณ → ตัวเลขสูงกว่าความจริง แต่อธิบายหน้าชั้นเรียนได้ใน 1 ประโยค

#### วิธี C — `rule4` (กฎ 4%)

```
corpus = netMonthlyNeed × 12 × 25
```

ถอนปีละ 4% ของเงินก้อน ไม่ขึ้นกับอายุคาดการณ์

> **หมายเหตุที่ต้องแสดงใน UI:** ถ้า `lifeExpectancy - retirementAge = 25` พอดี วิธี B กับ C จะให้ผลเท่ากันเสมอ — ไม่ใช่บั๊ก ให้ใส่ข้อความอธิบายไว้ในหน้าเปรียบเทียบ

**API ของโมดูล**

```ts
export function calculateCorpus(input: PlanInput): {
  expenseAtRetirement: number;
  pensionAtRetirement: number;
  netMonthlyNeed: number;
  realAnnualRate: number;
  byMethod: { annuity: number; simple: number; rule4: number };
  selected: number;
}
```

ให้คำนวณทั้ง 3 วิธีเสมอ เพื่อแสดงเปรียบเทียบในหน้าผลลัพธ์ แล้วค่อยเลือกวิธีที่ผู้ใช้ตั้งไว้มาใช้ต่อ

### 5.5 จำลองการออมรายปี — `lib/finance/simulate.ts`

ส่วนนี้สร้างข้อมูลสำหรับ **ตารางรายปี** และ **กราฟเส้น** และรองรับเป้าหมายพิเศษ

```ts
export interface YearRow {
  year: number;              // 1, 2, 3, ...
  age: number;
  monthlyContribution: number;   // ของปีนั้น
  contributedThisYear: number;
  returnThisYear: number;        // ผลตอบแทนที่ได้ในปีนั้น
  goalWithdrawal: number;        // เงินที่ถอนไปใช้เป้าหมายพิเศษ
  endingBalance: number;
  cumulativeContributed: number; // เงินต้นสะสม (เส้นที่ 2 ของกราฟ)
}
```

**อัลกอริทึม** — วนทีละเดือน แต่สรุปผลทีละปี:

```
balance = currentSavings
pmt     = monthlyContribution

สำหรับแต่ละปี y = 1 ... yearsToRetirement:
    สำหรับแต่ละเดือน m = 1 ... 12:
        balance = balance × (1 + monthlyRate) + pmt      // ออมปลายงวด
    ถ้ามีเป้าหมายพิเศษที่ targetAge = currentAge + y:
        goalCost = amountToday × (1 + inflation) ^ y
        balance  = max(0, balance - goalCost)
    บันทึก YearRow
    pmt = pmt × (1 + contributionGrowth)                 // ปรับขึ้นต้นปีถัดไป
```

**ผลลัพธ์ที่ต้องคืน**

```ts
export function simulateAccumulation(input: PlanInput): {
  rows: YearRow[];
  projectedAtRetirement: number;
  totalContributed: number;
  totalReturn: number;
}
```

### 5.6 คำนวณเงินออมที่ต้องใช้ และช่องว่าง — `lib/finance/corpus.ts`

**เงินที่คาดว่าจะมี ณ วันเกษียณ** (กรณีไม่มีเป้าหมายพิเศษและไม่เพิ่มเงินออม ใช้สูตรปิดได้)

```
fvCurrentSavings = futureValue(currentSavings, monthlyRate, monthsToRetirement)
fvContributions  = futureValueAnnuity(monthlyContribution, monthlyRate, monthsToRetirement)
projected        = fvCurrentSavings + fvContributions
```

> ถ้ามีเป้าหมายพิเศษหรือ `contributionGrowth > 0` ให้ใช้ค่าจาก `simulateAccumulation` แทน เพราะสูตรปิดจะไม่ตรง

**เงินที่ต้องออมต่อเดือนเพื่อให้ถึงเป้า**

$$PMT_{required} = \frac{(Corpus - FV_{currentSavings}) \times r}{(1+r)^n - 1}$$

```ts
export function requiredMonthlyContribution(
  corpus: number, currentSavings: number, monthlyRate: number, months: number
): number {
  const fvSavings = futureValue(currentSavings, monthlyRate, months);
  const need = corpus - fvSavings;
  if (need <= 0) return 0;                            // มีเงินพอแล้ว
  if (Math.abs(monthlyRate) < 1e-9) return need / months;
  return (need * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
}
```

**ช่องว่าง (Gap)**

```
gap = corpus - projected
gap > 0  → ออมไม่ทันเป้า
gap <= 0 → ถึงเป้าแล้ว
```

### 5.7 คำแนะนำ — `lib/finance/recommend.ts`

ทุกคำแนะนำต้องเป็น **rule-based คำนวณจากตัวเลขจริง** ห้ามเขียนข้อความลอย ๆ

```ts
export interface Suggestion {
  type: 'increase_saving' | 'delay_retirement' | 'reduce_expense' | 'increase_risk' | 'on_track';
  severity: 'success' | 'warning' | 'danger';
  titleKey: string;        // key สำหรับ i18n
  values: Record<string, number>;   // ตัวเลขที่จะเสียบในข้อความ
}
```

**กฎที่ต้องมี**

| เงื่อนไข | คำแนะนำที่คืน |
|---|---|
| `gap <= 0` | `on_track` — "คุณออมได้ตามเป้าแล้ว" พร้อมบอกเงินส่วนเกิน |
| `gap > 0` | `increase_saving` — ต้องออมเพิ่มเดือนละ `requiredPMT - currentPMT` บาท |
| `gap > 0` | `delay_retirement` — คำนวณหาอายุเกษียณที่น้อยที่สุดที่ทำให้ gap ≤ 0 โดยเพิ่มทีละ 1 ปี สูงสุด 10 ปี |
| `gap > 0` | `reduce_expense` — คำนวณรายจ่ายต่อเดือนสูงสุดที่เงินออมปัจจุบันรองรับได้ (แก้สมการย้อนกลับ) |
| `gap > 0` และ `riskLevel !== 'aggressive'` | `increase_risk` — แสดงว่าถ้าขยับไประดับถัดไป gap จะเหลือเท่าไหร่ **พร้อมเตือนว่าความเสี่ยงขาดทุนสูงขึ้นด้วย** |

**คำแนะนำการออมและการลงทุน** (แสดงเสมอ ไม่ว่า gap เป็นเท่าไหร่)

- สัดส่วนพอร์ตตาม `RISK_PROFILES[riskLevel].allocation` → แสดงเป็นกราฟวงกลม
- รายชื่อประเภทสินทรัพย์จาก `assetsTh` พร้อมช่วงผลตอบแทนคาดหวัง
- หลักการออม: ออมก่อนใช้ (Pay Yourself First), ตั้งโอนอัตโนมัติวันเงินเดือนออก, ทบทวนแผนปีละครั้ง
- ถ้า `yearsToRetirement < 10` ให้เพิ่มคำเตือนว่าควรลดสัดส่วนหุ้นลงเมื่อใกล้เกษียณ

### 5.8 ⚠️ ข้อความปฏิเสธความรับผิดชอบ (บังคับ)

ต้องแสดงที่ **ท้ายหน้าผลลัพธ์ทุกครั้ง** ในกล่องที่มองเห็นชัด:

> **ข้อควรทราบ** ผลการคำนวณนี้เป็นการประมาณการเพื่อการศึกษาเท่านั้น ตั้งอยู่บนสมมติฐานที่คุณกรอกและอัตราผลตอบแทนคาดหวังซึ่งอาจไม่เกิดขึ้นจริง ผลตอบแทนในอดีตไม่รับประกันผลตอบแทนในอนาคต และการลงทุนมีความเสี่ยงที่จะขาดทุนเงินต้น เว็บไซต์นี้ไม่ใช่คำแนะนำการลงทุนจากผู้ได้รับใบอนุญาต ก่อนตัดสินใจลงทุนจริงควรปรึกษาผู้แนะนำการลงทุนที่ได้รับอนุญาตจาก ก.ล.ต.

ต้องมีทั้งภาษาไทยและอังกฤษใน i18n

---

## 6. หน้าเพจ

### 6.1 Landing — `/`

เข้าถึงได้โดยไม่ต้องล็อกอิน

- **Hero** — พาดหัวสั้น ("รู้ก่อนว่าต้องมีเท่าไหร่ ถึงจะเกษียณได้สบาย") + ปุ่ม *เริ่มคำนวณฟรี*
- **ปัญหา 3 ข้อ** — การ์ด 3 ใบ: อายุยืนขึ้น / เงินเฟ้อกัดกิน / สวัสดิการรัฐไม่พอ พร้อมตัวเลขจริง
- **ตัวอย่างผลลัพธ์** — ภาพกราฟจากข้อมูลตัวอย่าง ให้เห็นว่าได้อะไร
- **วิธีใช้ 3 ขั้น** — กรอกข้อมูล → ดูผล → บันทึกแผน
- Footer — ชื่อโครงงาน ผู้จัดทำ ครูที่ปรึกษา โรงเรียนสุคนธีรวิทย์

### 6.2 เข้าสู่ระบบ / สมัครสมาชิก — `/login`, `/register`

- Supabase Auth ด้วย **อีเมล + รหัสผ่าน** และ **Google OAuth**
- ยืนยันอีเมลก่อนใช้งาน
- ลืมรหัสผ่าน → ส่งลิงก์รีเซ็ต
- ข้อความ error ต้องเป็นภาษาไทยที่คนทั่วไปเข้าใจ ไม่ใช่ error ดิบจาก Supabase
- หลังล็อกอินสำเร็จ → ไป `/dashboard`

### 6.3 ฟอร์มกรอกข้อมูล — `/plan/new`

ออกแบบเป็น **ฟอร์มหน้าเดียว** แบ่งเป็นการ์ด ไม่ใช่ wizard หลายหน้า (ผู้ใช้จะได้ย้อนแก้ง่าย)

**การ์ดที่ 1 — ข้อมูลพื้นฐาน**

| ช่อง | ชนิด | ค่าเริ่มต้น | ตรวจสอบ |
|---|---|---|---|
| อายุปัจจุบัน | number | — | 15–80 |
| อายุที่ต้องการเกษียณ | number | 60 | 40–85, ต้องมากกว่าอายุปัจจุบัน |
| อายุคาดการณ์ | number | 85 | 60–110, ต้องมากกว่าอายุเกษียณ |
| รายจ่ายต่อเดือนที่ต้องการหลังเกษียณ (มูลค่าเงินวันนี้) | currency | — | > 0 |
| เงินออม/เงินลงทุนที่มีอยู่แล้ว | currency | 0 | ≥ 0 |
| เงินที่ออมได้จริงต่อเดือน | currency | — | ≥ 0 |
| ระดับความเสี่ยงที่รับได้ | radio card 3 ใบ | moderate | — |

**การ์ดที่ 2 — เงินบำนาญที่คาดว่าจะได้รับ** (พับเก็บได้)

- เงินบำนาญต่อเดือน (มูลค่าเงินวันนี้) เช่น ประกันสังคม กบข. กองทุนสำรองเลี้ยงชีพ — ค่าเริ่มต้น 0
- มีข้อความอธิบายว่ากรอกเป็นมูลค่าเงินวันนี้ ระบบจะปรับเงินเฟ้อให้

**การ์ดที่ 3 — เป้าหมายพิเศษ** (พับเก็บได้, เพิ่มได้หลายรายการ)

แต่ละรายการ: ชื่อเป้าหมาย / จำนวนเงิน (มูลค่าวันนี้) / อายุที่จะใช้เงิน
ตัวอย่างที่ใส่เป็น placeholder: "ซื้อบ้าน 2,000,000 ตอนอายุ 35", "ท่องเที่ยวต่างประเทศ 150,000 ตอนอายุ 45"

**การ์ดที่ 4 — ตั้งค่าขั้นสูง** (พับเก็บ, ค่าเริ่มต้นใช้งานได้เลย)

| ช่อง | ค่าเริ่มต้น |
|---|---|
| อัตราเงินเฟ้อ | 3% |
| อัตราผลตอบแทนคาดหวังต่อปี | ตามระดับความเสี่ยง (3/5/8%) |
| เพิ่มเงินออมปีละ (%) | 0% |
| วิธีคำนวณเงินก้อน | PV of Annuity |

**พฤติกรรมของฟอร์ม**

- แสดงผลลัพธ์คร่าว ๆ (เงินก้อนที่ต้องมี + ต้องออมเดือนละเท่าไหร่) แบบ **real-time ข้างฟอร์ม** ขณะพิมพ์ ไม่ต้องกดปุ่ม
- ช่องเงินใส่ตัวคั่นหลักพันอัตโนมัติ (`1,234,567`)
- ปุ่ม *ดูผลลัพธ์เต็ม* → บันทึกลง DB แล้วไป `/plan/[id]`
- ถ้ายังไม่ล็อกอิน: คำนวณดูได้ แต่กดบันทึกจะเด้งไปล็อกอิน แล้ว **กลับมาพร้อมข้อมูลที่กรอกไว้** (เก็บใน sessionStorage ชั่วคราว)

### 6.4 หน้าผลลัพธ์ — `/plan/[id]`

เรียงจากบนลงล่างตามนี้:

**1. สรุปตัวเลขใหญ่** — การ์ด 3 ใบ

- เงินก้อนที่ต้องมี ณ วันเกษียณ
- ต้องออมเดือนละ (พร้อมเทียบกับที่ออมได้จริง — สีเขียวถ้าพอ สีแดงถ้าไม่พอ)
- รายจ่ายต่อเดือน ณ วันเกษียณ (พร้อมหมายเหตุว่าปรับเงินเฟ้อแล้วจาก X บาทวันนี้)

**2. กล่องเตือนเมื่อออมไม่ทันเป้า** (แสดงเฉพาะเมื่อ `gap > 0`)

พื้นหลังสีส้ม/แดง หัวข้อบอกจำนวนเงินที่ขาด แล้วตามด้วยทางแก้ที่คำนวณมาแล้วเป็นข้อ ๆ เช่น

> ขาดอยู่ **3,704,641 บาท**
> - ออมเพิ่มเป็นเดือนละ 11,261 บาท (เพิ่มจากเดิม 3,261 บาท)
> - หรือเลื่อนเกษียณไปอายุ 66 ปี
> - หรือลดรายจ่ายหลังเกษียณเหลือเดือนละ 14,457 บาท (มูลค่าเงินวันนี้)
> - หรือปรับพอร์ตเป็นความเสี่ยงสูง ซึ่งจะทำให้ถึงเป้า แต่มีโอกาสขาดทุนเงินต้นมากขึ้น

(ตัวเลขชุดนี้คำนวณจาก TC-01 จริง ใช้เป็นชุดทดสอบของโมดูลคำนวณได้ — ดู TC-07)

**3. กราฟเส้นการเติบโตของเงินออม**

- แกน X = อายุ, แกน Y = จำนวนเงิน
- **3 เส้น:** เงินออมสะสมจริง (รวมผลตอบแทน) / เงินต้นที่ออมไป / เส้นเป้าหมาย (แนวนอน)
- แรเงาพื้นที่ระหว่างเส้นเงินออมกับเส้นเงินต้น = ผลตอบแทนจากการลงทุน พร้อม label
- จุดที่มีเป้าหมายพิเศษให้ทำ marker
- Tooltip แสดงตัวเลขรายปี

**4. กราฟวงกลมสัดส่วนพอร์ต** + รายชื่อสินทรัพย์และช่วงผลตอบแทนคาดหวัง

**5. คำแนะนำการออมและการลงทุน** — จากข้อ 5.7

**6. ตารางแผนการออมรายปี**

คอลัมน์: ปีที่ / อายุ / ออมเดือนละ / ออมปีนี้รวม / ผลตอบแทนปีนี้ / เป้าหมายพิเศษ / ยอดเงินสะสมปลายปี

- ตัวเลขชิดขวา ใช้ฟอนต์ mono
- แถวที่มีเป้าหมายพิเศษไฮไลต์สีต่าง
- ปุ่มพับ/ขยาย (แสดง 10 ปีแรกก่อน)

**7. เปรียบเทียบ 3 วิธีคำนวณ**

ตารางเล็ก ๆ แสดงเงินก้อนที่ต้องมีตามวิธี A/B/C พร้อมคำอธิบายสั้น ๆ ว่าต่างกันเพราะอะไร สลับวิธีได้ทันที

**8. ข้อความปฏิเสธความรับผิดชอบ** (ข้อ 5.8)

**ปุ่มด้านบน:** แก้ไขแผน / เปลี่ยนชื่อแผน / ลบแผน / พิมพ์ (`@media print` ให้ออกมาสวย)

### 6.5 Dashboard — `/dashboard`

ต้องล็อกอิน

- การ์ดรายการแผนทั้งหมด แต่ละใบแสดง: ชื่อแผน / วันที่แก้ไขล่าสุด / เงินก้อนเป้าหมาย / สถานะ (ถึงเป้า ✅ หรือ ขาดอีก X บาท ⚠️)
- ปุ่ม *สร้างแผนใหม่*
- เมนูแต่ละการ์ด: เปิด / ทำสำเนา / เปลี่ยนชื่อ / ลบ (มี dialog ยืนยันก่อนลบ)
- ถ้ายังไม่มีแผน → แสดง empty state ชวนสร้างแผนแรก

### 6.6 ความรู้การเงิน — `/learn`

เข้าถึงได้โดยไม่ต้องล็อกอิน — หน้านี้ตอบวัตถุประสงค์โครงงานข้อ "สร้างความตระหนักทางการเงิน"

หน้ารวมเป็นการ์ดลิงก์ไปบทความย่อย `/learn/[slug]`:

| slug | หัวข้อ | ต้องมีอะไร |
|---|---|---|
| `time-value-of-money` | มูลค่าเงินตามเวลา | สูตร FV, ตัวอย่างเงิน 100 บาทวันนี้ vs อนาคต |
| `compound-interest` | ดอกเบี้ยทบต้น | **กราฟโต้ตอบได้** เทียบดอกเบี้ยทบต้น vs ดอกเบี้ยธรรมดา 30 ปี, ตัวอย่างเริ่มออมอายุ 25 vs 35 |
| `inflation` | เงินเฟ้อคืออะไร | ตัวอย่าง 100 บาท เงินเฟ้อ 3% ผ่านไป 20 ปี เหลือมูลค่า 180.61 บาท (ตามเอกสาร) |
| `real-return` | ผลตอบแทนที่แท้จริง | Fisher Effect, ทำไมฝากประจำ 1.5% แพ้เงินเฟ้อ 3% |
| `risk-and-return` | ความเสี่ยงกับผลตอบแทน | High Risk High Expected Return, ตารางสินทรัพย์ 3 ระดับ |
| `asset-allocation` | การจัดสรรสินทรัพย์ | 3 พอร์ตตัวอย่าง, การกระจายความเสี่ยง |

แต่ละบทความจบด้วยปุ่ม *ลองคำนวณแผนของคุณ* → `/plan/new`

---

## 7. UI / Design System

### 7.1 โทนสี

**โมเดิร์น + dark mode** ใช้ CSS variables ของ shadcn/ui แล้วกำหนดสีหลัก:

- **Primary:** น้ำเงินอมเขียว (teal/emerald) — สื่อถึงการเติบโตและความมั่นคง
- **Success:** เขียว (ถึงเป้า, ผลตอบแทน)
- **Warning:** ส้ม (ออมไม่ทันเป้าเล็กน้อย)
- **Danger:** แดง (ขาดมาก)
- พื้นหลัง light: ขาวนวล / dark: เทาเข้มอมน้ำเงิน (ไม่ใช่ดำสนิท)

ทุกสีต้องผ่าน **WCAG AA contrast ratio ≥ 4.5:1** ทั้งสองโหมด

### 7.2 กราฟ

- ใช้สีเดียวกับ design system ผ่าน CSS variables เพื่อให้เปลี่ยนตามธีมอัตโนมัติ
- ห้ามสื่อความหมายด้วยสีอย่างเดียว — ต้องมี label หรือลายเส้นต่างกันด้วย
- แสดงตัวเลขบนแกน Y แบบย่อ (`1.2 ล้าน`, `1.2M`)

### 7.3 การแสดงตัวเลข

```ts
// ไทย: 1,234,567 บาท    อังกฤษ: ฿1,234,567
new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US', {
  style: 'currency', currency: 'THB', maximumFractionDigits: 0
})
```

- ตัวเลขเงินก้อนใหญ่: ปัดเป็นจำนวนเต็ม
- อัตราดอกเบี้ย: ทศนิยม 2 ตำแหน่ง
- ตัวเลขในตารางใช้ฟอนต์ mono ชิดขวา

### 7.4 Responsive

- Mobile first — ทดสอบที่ 360px เป็นอย่างต่ำ
- ตารางรายปีบนมือถือ: เลื่อนแนวนอนได้ และตรึงคอลัมน์ "อายุ" ไว้
- กราฟบนมือถือ: ลดจำนวน tick บนแกน X

### 7.5 Accessibility

- ทุก input มี `<label>` ผูกจริง
- โฟกัสมองเห็นชัด
- Error message ผูกด้วย `aria-describedby`
- กราฟมีคำอธิบายข้อความสำรอง (`aria-label` สรุปแนวโน้ม)

---

## 8. ระบบสองภาษา (i18n)

- ใช้ **next-intl** กับ routing แบบ `/th/...` และ `/en/...`
- ค่าเริ่มต้น: **ไทย**
- ปุ่มสลับภาษาอยู่บน Navbar (ไอคอนโลก + ตัวย่อ TH/EN)
- **ห้ามฝังข้อความไว้ในโค้ดเด็ดขาด** — ทุกข้อความต้องอยู่ใน `messages/th.json` และ `messages/en.json`
- คอมเมนต์ในโค้ดเขียนเป็น **ภาษาไทย** โดยเฉพาะในโมดูล `lib/finance/` ให้อธิบายว่าแต่ละสูตรมาจากไหน
- ศัพท์การเงินในภาษาไทยให้วงเล็บภาษาอังกฤษกำกับครั้งแรกที่ปรากฏ เช่น "มูลค่าเงินตามเวลา (Time Value of Money)"

---

## 9. ชุดทดสอบ (Test Cases)

> ตัวเลขเหล่านี้คำนวณไว้แล้ว **ให้เขียน unit test ให้ผ่านทุกข้อ** (คลาดเคลื่อนได้ไม่เกิน ±1 บาท)
> และเอกสารโครงงานบทที่ 3 ระบุว่าต้องเทียบผลกับ Microsoft Excel ให้ตรง 100% — ชุดนี้ใช้เทียบได้เลย

### TC-01 — กรณีมาตรฐาน

**Input:** อายุ 25 → เกษียณ 60 → คาดการณ์ 85, รายจ่าย 20,000/เดือน, เงินออมเดิม 100,000, ออมเดือนละ 8,000, ความเสี่ยงปานกลาง (5%), เงินเฟ้อ 3%

| ผลลัพธ์ | ค่าที่ถูกต้อง |
|---|---|
| รายจ่ายต่อเดือน ณ วันเกษียณ | 56,277.25 |
| อัตราผลตอบแทนที่แท้จริง (ต่อปี) | 1.9417% |
| **เงินก้อน วิธี A (annuity)** | **13,366,752.17** |
| เงินก้อน วิธี B (simple) | 16,883,174.73 |
| เงินก้อน วิธี C (rule4) | 16,883,174.73 |
| FV ของเงินออมเดิม | 573,371.84 |
| FV ของเงินออมรายเดือน | 9,088,739.40 |
| เงินที่คาดว่าจะมี | 9,662,111.25 |
| **ช่องว่าง (วิธี A)** | **3,704,640.92** |
| ต้องออมเดือนละ (วิธี A) | 11,260.86 |

### TC-02 — ผลตอบแทนเท่ากับเงินเฟ้อ (เคสหารศูนย์)

เหมือน TC-01 แต่ผลตอบแทน 3% = เงินเฟ้อ 3%

| ผลลัพธ์ | ค่าที่ถูกต้อง |
|---|---|
| อัตราผลตอบแทนที่แท้จริง | **0.0000%** |
| เงินก้อน วิธี A | 16,883,174.73 (= วิธี B) |
| เงินที่คาดว่าจะมี | 6,217,900.17 |
| ต้องออมเดือนละ | 22,382.14 |

> **เคสนี้ต้องไม่ทำให้โปรแกรมพัง** ถ้า `realRate` ใกล้ 0 ให้ใช้ `PMT × n` แทนสูตรที่มีการหาร

### TC-03 — เริ่มออมช้า ความเสี่ยงสูง

อายุ 40 → 60 → 85, รายจ่าย 25,000, เงินออมเดิม 500,000, ออมเดือนละ 15,000, ความเสี่ยงสูง (8%), เงินเฟ้อ 3%

| ผลลัพธ์ | ค่าที่ถูกต้อง |
|---|---|
| รายจ่าย ณ วันเกษียณ | 45,152.78 |
| อัตราผลตอบแทนที่แท้จริง | 4.8544% |
| เงินก้อน วิธี A | 7,837,164.79 |
| เงินที่คาดว่าจะมี | 11,298,707.62 |
| ช่องว่าง | **-3,461,542.83 → ถึงเป้าแล้ว** ต้องแสดงสถานะ `on_track` |

### TC-04 — มีเงินบำนาญ

อายุ 30 → 60 → 85, รายจ่าย 30,000, เงินออมเดิม 200,000, ออมเดือนละ 10,000, ปานกลาง (5%), เงินเฟ้อ 3%, **เงินบำนาญ 6,000/เดือน (มูลค่าวันนี้)**

| ผลลัพธ์ | ค่าที่ถูกต้อง |
|---|---|
| รายจ่าย ณ วันเกษียณ | 72,817.87 |
| เงินบำนาญ ณ วันเกษียณ | 14,563.57 |
| **รายจ่ายสุทธิที่ต้องหาเอง** | **58,254.30** |
| เงินก้อน วิธี A | 13,836,333.41 |
| เงินที่คาดว่าจะมี | 9,216,135.22 |
| ต้องออมเดือนละ | 15,551.40 |

### TC-05 — อายุยืน 90 ปี (วิธี B ≠ วิธี C)

อายุ 30 → 60 → **90**, รายจ่าย 20,000, เงินออมเดิม 0, ออมเดือนละ 10,000, ปานกลาง (5%), เงินเฟ้อ 3%

| ผลลัพธ์ | ค่าที่ถูกต้อง |
|---|---|
| เงินก้อน วิธี A | 13,237,931.27 |
| เงินก้อน วิธี B | 17,476,289.79 |
| เงินก้อน วิธี C | 14,563,574.83 |

> ข้อนี้พิสูจน์ว่าวิธี B กับ C ให้ผลต่างกันเมื่อระยะเกษียณไม่ใช่ 25 ปีพอดี

### TC-06 — ตารางรายปี (พารามิเตอร์ TC-01 + เพิ่มเงินออมปีละ 3%)

| สิ้นปีที่ | อายุ | ยอดเงินสะสม | เงินออมเดือนถัดไป |
|---|---|---|---|
| 1 | 26 | 203,347.03 | 8,240.00 |
| 2 | 27 | 314,928.42 | 8,487.20 |
| 3 | 28 | 435,253.86 | 8,741.82 |
| 4 | 29 | 564,861.77 | 9,004.07 |
| 5 | 30 | 704,320.85 | 9,274.19 |

### TC-07 — คำแนะนำเมื่อออมไม่ทันเป้า (ต่อจาก TC-01)

ทดสอบ `lib/finance/recommend.ts` ด้วยพารามิเตอร์ TC-01 ซึ่งมี gap = 3,704,640.92

| คำแนะนำ | ค่าที่ถูกต้อง | วิธีหา |
|---|---|---|
| `increase_saving` | ออมเป็นเดือนละ **11,260.86** (เพิ่ม 3,260.86) | `requiredMonthlyContribution()` |
| `delay_retirement` | เลื่อนไปอายุ **66 ปี** | วนเพิ่มอายุเกษียณทีละ 1 ปี จนกว่า gap ≤ 0 |
| `reduce_expense` | ลดเหลือเดือนละ **14,456.93** (มูลค่าวันนี้) | `projected / ((1+i)^yrs × PVfactor)` |
| `increase_risk` | เปลี่ยนเป็นความเสี่ยงสูง (8%) → gap = **-10,212,277** (เกินเป้า) | คำนวณใหม่ทั้งชุดด้วย return 8% |

> ข้อควรระวังตอนเขียน `delay_retirement`: เมื่อเลื่อนอายุเกษียณ **เงินก้อนที่ต้องมีจะลดลงด้วย** (เพราะระยะเวลาหลังเกษียณสั้นลง) พร้อม ๆ กับที่เงินออมโตขึ้น ต้องคำนวณใหม่ทั้งสองฝั่ง ไม่ใช่ตรึงเงินก้อนไว้เท่าเดิม
>
> ค่ากลางที่ควรได้ระหว่างทาง (ใช้ตรวจสอบ): เกษียณ 63 → gap 1,671,600 · เกษียณ 65 → gap 22,997 · เกษียณ 66 → gap -900,395

### TC-08 — กรณีขอบที่ต้องไม่พัง

ทดสอบว่าโปรแกรมไม่ crash และแสดงข้อความที่เหมาะสม:

| กรณี | พฤติกรรมที่ถูกต้อง |
|---|---|
| อายุเกษียณ ≤ อายุปัจจุบัน | Zod แจ้ง error ที่ฟอร์ม ไม่ส่งไปคำนวณ |
| อายุคาดการณ์ ≤ อายุเกษียณ | Zod แจ้ง error |
| เงินออมต่อเดือน = 0 | คำนวณได้ปกติ แสดง gap เต็มจำนวน |
| เงินบำนาญ > รายจ่าย | `netMonthlyNeed` = 0, เงินก้อนที่ต้องมี = 0, แสดงข้อความว่าเงินบำนาญเพียงพอแล้ว |
| เป้าหมายพิเศษมากกว่าเงินที่มี | ยอดเงินติดลบไม่ได้ ให้เป็น 0 และเตือนผู้ใช้ |
| อัตราผลตอบแทน = 0 | ใช้สูตรกรณีพิเศษ ไม่หารศูนย์ |

---

## 10. ลำดับการพัฒนา

พัฒนาตาม Phase นี้ **ห้ามข้าม** — แต่ละ Phase ต้องรันได้จริงก่อนไปต่อ

### Phase 1 — โมดูลคำนวณ (สำคัญที่สุด ทำก่อนทุกอย่าง)

1. สร้างโปรเจกต์ Next.js + TypeScript + Tailwind + shadcn/ui
2. เขียน `lib/finance/` ทั้งหมด (types, constants, tvm, corpus, simulate, recommend)
3. เขียน unit test ตาม TC-01 ถึง TC-08 ด้วย Vitest
4. **ต้องผ่านทุกข้อก่อนเขียน UI**

### Phase 2 — ฟอร์มและผลลัพธ์ (ยังไม่ต้องมี DB)

5. หน้า `/plan/new` พร้อม Zod validation และคำนวณ real-time
6. หน้าผลลัพธ์แบบยังไม่บันทึก (ส่งข้อมูลผ่าน state)
7. กราฟเส้น + กราฟวงกลม + ตารางรายปี
8. กล่องเตือนและคำแนะนำ
9. ข้อความปฏิเสธความรับผิดชอบ

### Phase 3 — ระบบสมาชิกและฐานข้อมูล

10. ตั้งค่า Supabase, สร้างตาราง, เปิด RLS
11. หน้า login / register / reset password
12. บันทึก / โหลด / แก้ / ลบ แผน
13. หน้า `/dashboard`

### Phase 4 — เนื้อหาและความสมบูรณ์

14. หน้า Landing
15. หน้า `/learn` ทั้ง 6 บทความ พร้อมกราฟโต้ตอบในบทดอกเบี้ยทบต้น
16. i18n ไทย/อังกฤษ ครบทุกข้อความ
17. Dark mode
18. Responsive + accessibility
19. `@media print` สำหรับพิมพ์หน้าผลลัพธ์

### Phase 5 — Deploy

20. Deploy ขึ้น Vercel
21. ตั้งค่า environment variables
22. ทดสอบบนมือถือจริง

---

## 11. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # ใช้ฝั่ง server เท่านั้น ห้ามขึ้นต้นด้วย NEXT_PUBLIC_
NEXT_PUBLIC_SITE_URL=
```

ใส่ไฟล์ `.env.example` ไว้ในโปรเจกต์ และเพิ่ม `.env.local` ใน `.gitignore`

---

## 12. เกณฑ์ว่างานเสร็จ

- [ ] unit test ของ `lib/finance/` ผ่านครบทุกข้อใน TC-01 ถึง TC-08
- [ ] ผลคำนวณตรงกับ Microsoft Excel ทุกตัวเลขในข้อ 9
- [ ] สมัครสมาชิก เข้าสู่ระบบ บันทึกแผน แก้แผน ลบแผน ทำงานได้จริง
- [ ] ผู้ใช้ A เปิดแผนของผู้ใช้ B ไม่ได้ (ทดสอบ RLS จริง)
- [ ] สลับภาษาไทย/อังกฤษได้ทุกหน้า ไม่มีข้อความตกหล่น
- [ ] สลับ light/dark ได้ กราฟเปลี่ยนสีตาม
- [ ] ใช้งานบนมือถือกว้าง 360px ได้ ไม่มีการเลื่อนแนวนอนที่ไม่ต้องการ
- [ ] ข้อความปฏิเสธความรับผิดชอบแสดงในหน้าผลลัพธ์
- [ ] `npm run build` ผ่านโดยไม่มี error และไม่มี TypeScript error
- [ ] Deploy ขึ้น Vercel แล้วเปิดใช้ได้จริง

---

## ภาคผนวก — ที่มาของสูตร

สูตรทั้งหมดอ้างอิงจากเอกสารโครงงาน บทที่ 2:

| สูตร | ที่มา |
|---|---|
| $FV = PV(1+r)^n$ | ข้อ 2.2.2 ดอกเบี้ยทบต้น |
| $FV_{annuity} = PMT\frac{(1+r)^n-1}{r}$ | ข้อ 2.2.3 การออมสะสมเท่ากันทุกงวด |
| $Cost_{future} = Cost_{present}(1+i)^n$ | ข้อ 2.3.1 อัตราเงินเฟ้อ |
| $1+RealRate = \frac{1+Nominal}{1+Inflation}$ | ข้อ 2.3.2 Fisher Effect |
| สัดส่วนพอร์ต 80/20, 50/50, 20/80 | ข้อ 2.4.2 Asset Allocation |
| ช่วงผลตอบแทน 1–3%, 3–5%, 7–10% | ข้อ 2.4.2 ประเภทสินทรัพย์ |

$PV_{annuity}$ (ข้อ 5.2) ไม่ได้อยู่ในเอกสารต้นฉบับ แต่เป็นสูตรมาตรฐานทางการเงินที่ใช้คู่กับ $FV_{annuity}$ จำเป็นสำหรับคำนวณเงินก้อนวิธี A — ควรเพิ่มเข้าไปในบทที่ 2 ของเล่มรายงานด้วย
