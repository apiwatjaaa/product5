// สูตรพื้นฐานมูลค่าเงินตามเวลา (Time Value of Money)
// ข้อตกลง: อัตราต่อปีหารด้วย 12 สำหรับรายเดือน (monthlyRate = annualRate / 12)
// เพื่อให้ผลตรงกับฟังก์ชัน FV/PMT ของ Excel

/** มูลค่าอนาคตของเงินก้อนเดียว: FV = PV × (1+r)^n */
export function futureValue(pv: number, rate: number, periods: number): number {
  return pv * Math.pow(1 + rate, periods);
}

/** มูลค่าอนาคตของเงินออมสม่ำเสมอ (Ordinary Annuity — ออมปลายงวด) */
export function futureValueAnnuity(pmt: number, rate: number, periods: number): number {
  if (Math.abs(rate) < 1e-9) return pmt * periods; // กันหารศูนย์
  return pmt * ((Math.pow(1 + rate, periods) - 1) / rate);
}

/** มูลค่าปัจจุบันของเงินถอนสม่ำเสมอ */
export function presentValueAnnuity(pmt: number, rate: number, periods: number): number {
  if (Math.abs(rate) < 1e-9) return pmt * periods; // เคสผลตอบแทนเท่ากับเงินเฟ้อพอดี (ดู TC-02)
  return pmt * ((1 - Math.pow(1 + rate, -periods)) / rate);
}

/** อัตราผลตอบแทนที่แท้จริง (Fisher Effect): 1+RealRate = (1+Nominal)/(1+Inflation) */
export function realRate(nominal: number, inflation: number): number {
  return (1 + nominal) / (1 + inflation) - 1;
}
