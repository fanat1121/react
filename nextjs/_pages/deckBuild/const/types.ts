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

/** 無印/+版の区別 */
export type CardVariant = 'base' | 'plus';

export type CardCount = Record<CardVariant, number>;

export type CardCounts = Record<string, CardCount>;

export type DeckBuildSummary = {
  /** カタログカード（リージェント専用＋無色＋エンシェント）のみの合計枚数 */
  totalCardCount: number;
  /** カタログカード＋イレギュラーカード＋ごみ札の合計枚数 */
  totalDeckCount: number;
  countByType: Record<CardType, number>;
  /** スキルカードのうちブロックを得る効果を持つカードの枚数 */
  blockSkillCount: number;
  /** スキルカードのうちブロックを得ない効果のカードの枚数（イレギュラースキルもここに含む） */
  nonBlockSkillCount: number;
  totalPower: number;
  totalBlock: number;
  totalStarCost: number;
  totalStarGain: number;
  totalEnergyCost: number;
  /** ✦をコストに持つカードのデッキ内枚数（三日月の槍の威力算出に使用） */
  starCostCardCount: number;
  /** ✦を得る効果を持つカードのデッキ内枚数 */
  starGainCardCount: number;
  /** 三日月の槍/+ の現在の最大威力（deckの構成から動的算出） */
  crescentSpearPower: number;
  crescentSpearPlusPower: number;
  /** 平均値はカード0枚の場合0とする */
  averageAttackPower: number;
  averageBlock: number;
  averageStarCost: number;
  averageStarGain: number;
  averageEnergyCost: number;
};
