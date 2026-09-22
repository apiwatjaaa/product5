// ภาษีเงินได้บุคคลธรรมดาแบบขั้นบันได (อัตราตามประมวลรัษฎากร มาตรา 47 ที่ใช้ตั้งแต่ปีภาษี 2560 เป็นต้นมา)
// ใช้กับเครื่องคำนวณการศึกษาในหน้า /learn เท่านั้น — ไม่ผูกกับการคำนวณแผนเกษียณหลัก

export interface TaxBracket {
  /** ขอบบนของขั้นเงินได้สุทธิ (บาท) — null หมายถึงไม่มีเพดาน (ขั้นสุดท้าย) */
  upTo: number | null;
  rate: number;
}

export const THAI_PERSONAL_INCOME_TAX_BRACKETS: TaxBracket[] = [
  { upTo: 150_000, rate: 0 },
  { upTo: 300_000, rate: 0.05 },
  { upTo: 500_000, rate: 0.1 },
  { upTo: 750_000, rate: 0.15 },
  { upTo: 1_000_000, rate: 0.2 },
  { upTo: 2_000_000, rate: 0.25 },
  { upTo: 5_000_000, rate: 0.3 },
  { upTo: null, rate: 0.35 },
];

/** หักค่าใช้จ่ายมาตรฐานสำหรับเงินได้ประเภทเงินเดือน (มาตรา 40(1)): 50% ของเงินได้ สูงสุด 100,000 บาท */
export const STANDARD_EXPENSE_DEDUCTION_RATE = 0.5;
export const STANDARD_EXPENSE_DEDUCTION_CAP = 100_000;

/** ค่าลดหย่อนส่วนตัวมาตรฐาน (ผู้มีเงินได้) */
export const PERSONAL_ALLOWANCE = 60_000;

export interface TaxBracketResult extends TaxBracket {
  from: number;
  taxableAmountInBracket: number;
  taxForBracket: number;
}

export interface PersonalIncomeTaxResult {
  taxableIncome: number;
  totalTax: number;
  /** อัตราภาษีขั้นสูงสุดที่เงินได้สุทธินี้ตกอยู่ */
  marginalRate: number;
  brackets: TaxBracketResult[];
}

/** คำนวณภาษีแบบขั้นบันไดจาก "เงินได้สุทธิ" (หลังหักค่าใช้จ่ายและค่าลดหย่อนแล้ว) */
export function calculateProgressiveTax(taxableIncome: number): PersonalIncomeTaxResult {
  const income = Math.max(0, taxableIncome);
  let remaining = income;
  let lowerBound = 0;
  let totalTax = 0;
  let marginalRate = 0;
  const brackets: TaxBracketResult[] = [];

  for (const bracket of THAI_PERSONAL_INCOME_TAX_BRACKETS) {
    const bracketSize = bracket.upTo === null ? remaining : bracket.upTo - lowerBound;
    const taxableAmountInBracket = Math.min(remaining, bracketSize);
    const taxForBracket = taxableAmountInBracket * bracket.rate;

    brackets.push({ ...bracket, from: lowerBound, taxableAmountInBracket, taxForBracket });

    if (taxableAmountInBracket > 0) {
      totalTax += taxForBracket;
      marginalRate = bracket.rate;
    }

    remaining -= taxableAmountInBracket;
    lowerBound = bracket.upTo ?? lowerBound;
    if (remaining <= 0) break;
  }

  return { taxableIncome: income, totalTax, marginalRate, brackets };
}

/**
 * เงินได้สุทธิของเงินเดือน (เงินได้ประเภท 40(1)) หลังหักค่าใช้จ่ายมาตรฐานและค่าลดหย่อนส่วนตัว
 * ไม่รวมค่าลดหย่อนอื่น เช่น ประกันสังคม, SSF/RMF, คู่สมรส หรือบุตร
 */
export function calculateEmploymentTaxableIncome(annualIncome: number): number {
  const income = Math.max(0, annualIncome);
  const expenseDeduction = Math.min(income * STANDARD_EXPENSE_DEDUCTION_RATE, STANDARD_EXPENSE_DEDUCTION_CAP);
  return Math.max(0, income - expenseDeduction - PERSONAL_ALLOWANCE);
}
