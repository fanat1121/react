/**
 * 三日月の槍 最大威力の算出定数。
 * 無印: 8 + 2 × スター消費枚数 / +版: 8 + 3 × スター消費枚数
 */
export const CRESCENT_SPEAR = {
  label: '三日月の槍',
  plusLabel: '三日月の槍+',
  basePower: 8,
  baseMultiplier: 2,
  plusMultiplier: 3,
} as const;

export const calculateCrescentSpearPower = (starConsumedCount: number, multiplier: number): number =>
  CRESCENT_SPEAR.basePower + multiplier * starConsumedCount;
