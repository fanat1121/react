export type CardType = 'attack' | 'skill' | 'power';

export type ValueKind = 'damage' | 'block' | 'none';

export type CardData = {
  id: string;
  name: string;
  type: CardType;
  rarity: string;
  /** エナジーコスト。Xコストはnull */
  energyCostBase: number | null;
  /** スター（✦）消費。無いカードは0、Xコストはnull */
  starCostBase: number | null;
  energyCostPlus: number | null;
  starCostPlus: number | null;
  valueKind: ValueKind;
  /** 主効果（ダメージ/ブロック）の数値。抽出不能・非対象はnull */
  baseValue: number | null;
  plusValue: number | null;
  /**
   * 総威力/総ブロックの自動集計に含めてよいか。
   * 条件付き効果・Xコスト・パワーカード（固有パッシブ）はfalse。
   */
  aggregatable: boolean;
  /** 「✦を得る」表現から抽出したスター回収数。該当なしはnull */
  starGainBase: number | null;
  starGainPlus: number | null;
  effectBase: string;
  effectPlus: string;
};
