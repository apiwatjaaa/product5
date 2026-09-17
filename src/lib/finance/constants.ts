// ค่าคงที่ระดับความเสี่ยงและสมมติฐานเริ่มต้น อ้างอิงเอกสารโครงงาน ข้อ 2.4.2

import type { RiskLevel } from './types';

export const RISK_PROFILES: Record<
  RiskLevel,
  {
    labelTh: string;
    labelEn: string;
    defaultReturn: number;
    allocation: { bondsAndDeposits: number; stocks: number };
    assetsTh: string[];
  }
> = {
  conservative: {
    labelTh: 'ความเสี่ยงต่ำ',
    labelEn: 'Conservative',
    defaultReturn: 0.03,
    allocation: { bondsAndDeposits: 0.8, stocks: 0.2 },
    assetsTh: ['เงินฝากประจำ', 'ตั๋วเงินคลัง', 'พันธบัตรรัฐบาล'],
  },
  moderate: {
    labelTh: 'ความเสี่ยงปานกลาง',
    labelEn: 'Moderate',
    defaultReturn: 0.05,
    allocation: { bondsAndDeposits: 0.5, stocks: 0.5 },
    assetsTh: ['หุ้นกู้ภาคเอกชน', 'กองทุนรวมตราสารหนี้'],
  },
  aggressive: {
    labelTh: 'ความเสี่ยงสูง',
    labelEn: 'Aggressive',
    defaultReturn: 0.08,
    allocation: { bondsAndDeposits: 0.2, stocks: 0.8 },
    assetsTh: ['หุ้นสามัญ', 'กองทุนรวมหุ้น', 'สินทรัพย์ทางเลือก'],
  },
};

export const RISK_LEVEL_ORDER: RiskLevel[] = ['conservative', 'moderate', 'aggressive'];

export const DEFAULT_INFLATION = 0.03;
export const DEFAULT_LIFE_EXPECTANCY = 85;
