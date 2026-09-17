// Database types ที่สอดคล้องกับ supabase/migrations/0001_init.sql
// (เขียนมือแทนการรัน `supabase gen types` เพราะยังไม่ผูก Supabase CLI กับโปรเจกต์)
//
// หมายเหตุสำคัญ: Row/Insert/Update ของแต่ละตารางต้องประกาศด้วย `type` (object
// literal) ห้ามใช้ `interface` — @supabase/postgrest-js เวอร์ชัน 2.116.0 ใช้
// conditional/mapped type ที่ซับซ้อนในการตรวจสอบ .insert()/.update() ซึ่งจะ
// resolve เป็น `never` อย่างเงียบ ๆ เมื่อ Row/Insert/Update เป็น `interface`
// (ยืนยันด้วยการทดสอบแยกแล้ว — interface ตัวเดียวกันทุกอย่างแต่เปลี่ยนเป็น
// type ก็หายพัง)

export type RiskLevelDb = "conservative" | "moderate" | "aggressive";
export type CorpusMethodDb = "annuity" | "simple" | "rule4";

export type PlanGoalRow = {
  id: string;
  plan_id: string;
  name: string;
  amount_today: number;
  target_age: number;
  sort_order: number;
};

export type PlanGoalInsert = {
  id?: string;
  plan_id: string;
  name: string;
  amount_today: number;
  target_age: number;
  sort_order: number;
};

export type PlanGoalUpdate = {
  name?: string;
  amount_today?: number;
  target_age?: number;
  sort_order?: number;
};

export type PlanRow = {
  id: string;
  user_id: string;
  name: string;
  current_age: number;
  retirement_age: number;
  life_expectancy: number;
  monthly_expense_today: number;
  current_savings: number;
  monthly_contribution: number;
  risk_level: RiskLevelDb;
  inflation_rate: number;
  annual_return: number;
  contribution_growth: number;
  pension_monthly_today: number;
  corpus_method: CorpusMethodDb;
  created_at: string;
  updated_at: string;
};

export type PlanInsert = {
  id?: string;
  user_id: string;
  name: string;
  current_age: number;
  retirement_age: number;
  life_expectancy: number;
  monthly_expense_today: number;
  current_savings: number;
  monthly_contribution: number;
  risk_level: RiskLevelDb;
  inflation_rate: number;
  annual_return: number;
  contribution_growth: number;
  pension_monthly_today: number;
  corpus_method: CorpusMethodDb;
};

export type PlanUpdate = {
  name?: string;
  current_age?: number;
  retirement_age?: number;
  life_expectancy?: number;
  monthly_expense_today?: number;
  current_savings?: number;
  monthly_contribution?: number;
  risk_level?: RiskLevelDb;
  inflation_rate?: number;
  annual_return?: number;
  contribution_growth?: number;
  pension_monthly_today?: number;
  corpus_method?: CorpusMethodDb;
};

export type ProfileRow = {
  id: string;
  display_name: string | null;
  locale: string;
  created_at: string;
};

export type ProfileInsert = {
  id: string;
  display_name?: string | null;
  locale?: string;
};

export type ProfileUpdate = {
  display_name?: string | null;
  locale?: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      plans: {
        Row: PlanRow;
        Insert: PlanInsert;
        Update: PlanUpdate;
        Relationships: [];
      };
      plan_goals: {
        Row: PlanGoalRow;
        Insert: PlanGoalInsert;
        Update: PlanGoalUpdate;
        Relationships: [
          {
            foreignKeyName: "plan_goals_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
