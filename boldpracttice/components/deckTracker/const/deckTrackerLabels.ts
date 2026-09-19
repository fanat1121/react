export const DECK_TRACKER_SECTION_TITLES = {
  cardCount: '枚数カウント',
  totalAmount: '総量管理',
} as const;

export const DECK_TRACKER_LABELS = {
  attack: 'アタック',
  block: 'ブロック',
  skill: 'スキル',
  power: 'パワー',
  starCost: 'スター消費',
  starGain: 'スター回収',
  crescentSpearCount: '三日月の槍',
  crescentSpearPlusCount: '三日月の槍+',
  attackTotal: 'アタック総値',
  blockTotal: 'ブロック総数',
  starCostTotal: 'スター消費総数',
  starGainTotal: 'スター回収総数',
} as const;

export const CARD_UNIT = '枚';

/** 項目ごとの識別用アクセントカラー（対応する「総数」項目とはペアで同色にする） */
export const DECK_TRACKER_COLORS = {
  attack: '#e07a5f',
  block: '#3d5a80',
  skill: '#81b29a',
  power: '#f2cc8f',
  starCost: '#9c89b8',
  starGain: '#6c757d',
  crescentSpearCount: '#bc6c25',
  crescentSpearPlusCount: '#bc6c25',
  attackTotal: '#e07a5f',
  blockTotal: '#3d5a80',
  starCostTotal: '#9c89b8',
  starGainTotal: '#6c757d',
} as const;

/** 大幅増減ボタンの幅 */
export const BIG_STEP = 10;

/** リセット時に戻る初期値（未指定の項目は0） */
export const DECK_TRACKER_INITIAL_VALUES = {
  attack: 5,
  block: 4,
  starCost: 1,
  starGain: 1,
  attackTotal: 32,
  blockTotal: 20,
  starCostTotal: 2,
  starGainTotal: 2,
} as const;
