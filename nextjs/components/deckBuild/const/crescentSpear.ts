/**
 * 三日月の槍 最大威力の算出定数。
 * 効果: 8ダメージ + ✦をコストに持つカード1枚につき追加ダメージ（無印2/+版3）。
 * 「✦をコストに持つカード」はデッキ内の実際の枚数（starCostCardCount）を用いる。
 */
export const CRESCENT_SPEAR = {
  label: '三日月の槍',
  plusLabel: '三日月の槍+',
  basePower: 8,
  baseMultiplier: 2,
  plusMultiplier: 3,
} as const;

export const calculateCrescentSpearPower = (starCostCardCount: number, multiplier: number): number =>
  CRESCENT_SPEAR.basePower + multiplier * starCostCardCount;
