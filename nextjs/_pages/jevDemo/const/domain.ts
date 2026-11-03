import type { TrickCandidate } from '../types';

/** 技マスタから候補に使う道具名 */
export const DIABOLO_EQUIPMENT_NAME = 'ディアボロ';

/** Choice の候補数上限 (グラフで読める本数に抑える) */
export const MAX_TRICK_CANDIDATES = 8;

/**
 * 道具の定義文
 * Equipment マスタに説明フィールドが無いため、デモ側の定数で持つ
 */
export const EQUIPMENT_DEFINITION =
  'ディアボロ：中央が細い軸でつながった2つのお椀型の独楽。両手に持った2本のスティックの間に張った1本の紐の上で回転させて操るジャグリング道具。飲み物やキャラクターの名前ではない';

/**
 * 用語集
 * state には判定対象の技に関係する用語だけを入れる (無関係な情報が多いと精度が落ちるため)
 */
export const GLOSSARY: Record<string, string> = {
  スティック: '紐の両端を結びつけた2本の棒。演者が左右の手に1本ずつ持つ',
  紐: '2本のスティックの間に張られた1本の紐。ディアボロはこの上で回転する',
  水平: 'ディアボロの回転軸が地面と平行な向きで回している状態',
  垂直: 'ディアボロの回転軸が地面と垂直な向きで回している状態',
  縦: 'ディアボロの回転軸が地面と垂直な向きで回している状態',
  '1ディア': 'ディアボロを1個使う演技',
  '2ディア': 'ディアボロを2個同時に使う演技',
  '3ディア': 'ディアボロを3個同時に使う演技',
};

/** 技マスタが取得できないとき (Go API 未起動など) のデモ用ダミー */
export const DEMO_TRICKS: TrickCandidate[] = [
  {
    id: -1,
    name: 'サン',
    categoryName: '水平1ディア',
    description: 'ディアボロを紐に乗せたまま、スティックごと体の前で大きく縦に一周振り回す',
    startStateName: '通常回転（紐の上で水平に回っている）',
    endStateName: '通常回転（紐の上で水平に回っている）',
  },
  {
    id: -2,
    name: 'トス',
    categoryName: '水平1ディア',
    description: '紐を左右に張ってディアボロを真上に投げ上げ、落ちてきたところを紐で受け止める',
    startStateName: '通常回転（紐の上で水平に回っている）',
    endStateName: '通常回転（紐の上で水平に回っている）',
  },
  {
    id: -3,
    name: 'エレベーター',
    categoryName: '水平1ディア',
    description: '片方のスティックに紐を何周か巻き付け、紐を張るとディアボロが紐を伝って上へ登っていく',
    startStateName: '通常回転（紐の上で水平に回っている）',
    endStateName: '紐に巻き付いた状態',
  },
  {
    id: -4,
    name: 'キャッツクレイドル',
    categoryName: '水平1ディア',
    description: 'スティックで紐をあやとりのように交差させ、その交差部分にディアボロを乗せる',
    startStateName: '通常回転（紐の上で水平に回っている）',
    endStateName: 'あやとり状に組んだ紐の上に乗っている',
  },
  {
    id: -5,
    name: 'シャッフル',
    categoryName: '2ディア',
    description: '2個のディアボロを交互に投げ上げ、紐の上で受け止めることを繰り返す',
    startStateName: '2個が紐の上で回っている',
    endStateName: '2個が紐の上で回っている',
  },
];
